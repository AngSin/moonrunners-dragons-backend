import fs from "fs";
import { BigNumber, ethers } from "ethers";
import * as dotenv from "dotenv";
import { dragonsAbi } from "../src/utils/constants";
import axios from "axios";
import { expect } from "chai";
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL, {
  name: "homestead",
  chainId: 1,
});

export const lines = fs
  .readFileSync("./tx-bloodBurn.csv")
  .toString()
  .split("\n")
  .filter((line) => !!line);

// problematic time from tx: 0x46614e18c71afa6b2f3de2d28bbb1626fb61046d31164eecf70c1d0423d3078b till: 0x176f0f00e8bca02811802c7d6d912846e656d3f1db8eb932c1089b1bf74ad177
// lines 150-175

const dragonsInterface = new ethers.utils.Interface(dragonsAbi);

const rarities = ["D1", "D2", "D3", "Legendary"];

const getRarity = (bloodId: BigNumber): "D1" | "D2" | "D3" | "Legendary" => {
  if (bloodId.eq(BigNumber.from("4"))) {
    return "Legendary";
  } else if (bloodId.eq(BigNumber.from("5"))) {
    return "D3";
  } else if (bloodId.eq(BigNumber.from("6"))) {
    return "D2";
  } else {
    return "D1";
  }
};

type Rarity = "D1" | "D2" | "D3" | "Legendary";

let lastIndexes = {
  D1: 1932,
  D2: 1256,
  D3: 717,
  Legendary: 9,
};

const isRarityLowerThanExpected = (
  expectedRarity: Rarity,
  actualRarity: Rarity
): boolean => {
  return (
    rarities.findIndex((r) => r === expectedRarity) >
    rarities.findIndex((r) => r === actualRarity)
  );
};

const incorrectlyAssignedDragonIds: number[] = [];
const rarityLowerThanExpected: { id: number; expectedRarity: Rarity }[] = [];

let lastOkDragonId = 1356;

const checkTxs = async () => {
  for (let i = 149; i < 239; i++) {
    // for (let i = 226; i < 239; i++) {
    const parts = lines[i].split(",");
    const fnName = parts[15];
    if (fnName.includes("Burn Blood For Dragons")) {
      const txId = parts[0].replaceAll('"', "");
      console.log(`tx id: ${txId}`);
      const tx = await provider.getTransaction(txId);
      const input = dragonsInterface.decodeFunctionData(
        "burnBloodForDragons",
        tx.data
      )[0];
      for (let i = 0; i < input.length; i++) {
        lastOkDragonId++;
        const dragonMetadata = await axios.get(
          `http://localhost:8080/dragons/${lastOkDragonId}`
        );
        const dragonRarity = dragonMetadata.data.attributes.find(
          // @ts-ignore
          (t) => t.trait_type === "Rarity"
        ).value;
        const expectedRarity = getRarity(input[i]);
        if (dragonRarity !== expectedRarity) {
          incorrectlyAssignedDragonIds.push(lastOkDragonId);
        }
        if (isRarityLowerThanExpected(expectedRarity, dragonRarity)) {
          rarityLowerThanExpected.push({
            id: lastOkDragonId,
            expectedRarity,
          });
        }
      }
    }
  }
};

const main = async () => {
  await checkTxs();
  console.log(rarityLowerThanExpected);
  rarityLowerThanExpected.forEach(({ id, expectedRarity }, index) => {
    const lastIndex = lastIndexes[expectedRarity];
    fs.renameSync(`./data/images/${id}.png`, `./unused/images/${id}.png`);
    fs.renameSync(`./data/json/${id}.json`, `./unused/json/${id}.json`);
    fs.renameSync(
      `./data/bloodBurn/${expectedRarity}/images/${lastIndex}.png`,
      `./data/images/${id}.png`
    );
    fs.renameSync(
      `./data/bloodBurn/${expectedRarity}/json/${lastIndex}.json`,
      `./data/json/${id}.json`
    );
    lastIndexes[expectedRarity]--;
  });
};

main();
