import * as dotenv from "dotenv";
import { BigNumber, ethers } from "ethers";
import {
  dragonsAbi,
  dragonsAddress,
  rerollAbi,
  rerollAddress,
} from "../utils/constants";
import { db } from "../utils/firebase";
import { isItemWeapon, rollRarity } from "../utils/rollRarity";

dotenv.config();

const EXPECTED_PONG_BACK = 15000;
const KEEP_ALIVE_CHECK_INTERVAL = 7500;

const bloodIdToRarity = {
  [7]: "D1",
  [6]: "D2",
  [5]: "D3",
  [4]: "Legendary",
};

export const listenToBurnEvents = () => {
  const wsProvider = new ethers.providers.WebSocketProvider(
    process.env.WS_RPC_URL!!,
    {
      name: process.env.CHAIN_NAME || "homestead",
      chainId: Number(process.env.CHAIN_ID) || 1,
    }
  );

  const dragonsWsContract = new ethers.Contract(
    dragonsAddress,
    dragonsAbi,
    wsProvider
  );

  const rerollContract = new ethers.Contract(
    rerollAddress,
    rerollAbi,
    wsProvider
  );

  dragonsWsContract.on(
    "BloodBurn",
    async (bloodIds: BigNumber[], tokenIds: BigNumber[], event) => {
      for (let i = 0; i < bloodIds.length; i++) {
        const bloodId = bloodIds[i];
        const tokenId = tokenIds[i];
        try {
          // @ts-ignore
          const rarity = bloodIdToRarity[Number(bloodId)];
          const rarityIndex = (
            await db.collection("RarityCounter").doc(rarity).get()
          ).data()?.counter;
          const txId = event.transactionHash;
          console.log(
            `Blood ${bloodId} (rarity: ${rarity}) burnt for Dragon ${tokenId} on tx ${txId}. Rarity Index for this dragon is: ${rarityIndex}`
          );

          if (typeof rarityIndex !== "number") {
            console.error(`Invalid Rarity Index: ${rarityIndex} for ${rarity}`);
          }

          await db.collection("Dragons").doc(tokenId.toString()).set({
            rarity,
            index: rarityIndex,
            txId,
            tokenId: tokenId.toNumber(),
          });

          await db
            .collection("RarityCounter")
            .doc(rarity)
            .set({
              counter: rarityIndex + 1,
            });
        } catch (e) {
          console.error("Unexpected error");
          console.log(e);
        }
      }
    }
  );

  rerollContract.on(
    "Reroll",
    async (weaponIds: BigNumber[], dragonIds: BigNumber[], event) => {
      for (let i = 0; i < weaponIds.length; i++) {
        const weaponId = weaponIds[i].toNumber();
        const dragonId = dragonIds[i];
        if (!isItemWeapon(weaponId)) {
          console.log(
            `burnt item ${weaponId.toString()}, which is not a weapon`
          );
          continue;
        }
        try {
          const rarity = rollRarity(weaponId);
          const rarityIndex = (
            await db.collection("RarityCounter").doc(rarity).get()
          ).data()?.counter;
          const txId = event.transactionHash;
          console.log(
            `Weapon ${weaponId} burnt to re-roll rarity for Dragon ${dragonId}. New rarity: ${rarity}. Tx: ${txId}. Rarity Index for this dragon is: ${rarityIndex}`
          );

          if (typeof rarityIndex !== "number") {
            console.error(`Invalid Rarity Index: ${rarityIndex} for ${rarity}`);
          }

          const dragon = (
            await db.collection("Dragons").doc(dragonId.toString()).get()
          ).data();

          await db
            .collection("Dragons")
            .doc(dragonId.toString())
            .set({
              rarity,
              index: rarityIndex,
              txId,
              rerolled: dragon?.rerolled ? dragon.rerolled + 1 : 1,
              tokenId: dragonId.toNumber(),
            });

          await db
            .collection("RarityCounter")
            .doc(rarity)
            .set({
              counter: rarityIndex + 1,
            });
        } catch (e) {
          console.error("Unexpected error");
          console.log(e);
        }
      }
    }
  );

  let pingTimeout: NodeJS.Timeout;
  let keepAliveInterval: NodeJS.Timer;

  wsProvider._websocket.on("open", () => {
    keepAliveInterval = setInterval(() => {
      console.log("Checking if the connection is alive, sending a ping");

      wsProvider._websocket.ping();

      // Use `WebSocket#terminate()`, which immediately destroys the connection,
      // instead of `WebSocket#close()`, which waits for the close timer.
      // Delay should be equal to the interval at which your server
      // sends out pings plus a conservative assumption of the latency.
      pingTimeout = setTimeout(() => {
        wsProvider._websocket.terminate();
      }, EXPECTED_PONG_BACK);
    }, KEEP_ALIVE_CHECK_INTERVAL);
  });

  wsProvider._websocket.on("close", () => {
    console.log("The websocket connection was closed");
    clearInterval(keepAliveInterval);
    clearTimeout(pingTimeout);
    listenToBurnEvents();
  });

  wsProvider._websocket.on("pong", () => {
    console.log("Received pong, so connection is alive, clearing the timeout");
    clearInterval(pingTimeout);
  });
};
