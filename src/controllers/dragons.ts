import { Request, Response } from "express";
import path from "path";
import { dragonsAddress } from "../utils/constants";
import { Alchemy, Network } from "alchemy-sdk";
import axios from "axios";
import { db } from "../utils/firebase";

const settings = {
  apiKey: process.env.ALCHEMY_KEY,
  network:
    process.env.CHAIN_NAME === "goerli"
      ? Network.ETH_GOERLI
      : Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export const getById = async (req: Request, res: Response) => {
  const id = req.params.id;
  let rarityInfo;
  try {
    rarityInfo = (await db.collection("Dragons").doc(id).get()).data();
  } catch (e) {
    console.log(e);
    return res.sendStatus(404);
  }
  if (!rarityInfo && Number(id) > 1487) {
    return res.sendStatus(404);
  }
  console.log(rarityInfo);
  if (rarityInfo) {
    const rarity = rarityInfo.rarity;
    const index = rarityInfo.index;
    const baseMetadata: JSON = (
      await axios.get(
        `https://moonrunners-dragons.s3.eu-central-1.amazonaws.com/${rarity}/json/${index}.json`
      )
    ).data;
    const metadata = {
      ...baseMetadata,
      name: `Dragonhorde #${id}`,
      image: `${req.protocol}://${req.get("host")}/dragons/image/${id}`,
    };
    return res.json(metadata);
  }
  try {
    const baseMetadata = require(`../../data/json/${id}.json`);
    const metadata = {
      ...baseMetadata,
      name: `Dragonhorde #${id}`,
      image: `${req.protocol}://${req.get("host")}/dragons/image/${id}`,
    };
    res.json(metadata);
  } catch (e) {
    return res.sendStatus(404);
  }
};

export const getImageById = async (req: Request, res: Response) => {
  const id = req.params.id;
  let rarityInfo;
  try {
    rarityInfo = (await db.collection("Dragons").doc(id).get()).data();
  } catch (e) {
    return res.sendStatus(404);
  }
  console.log(rarityInfo);
  if (rarityInfo) {
    const rarity = rarityInfo.rarity;
    const index = rarityInfo.index;
    // const extension = rarity === "Legendary" ? "gif" : "png";
    const extension = "png";
    const image: Buffer = (
      await axios.get(
        `https://moonrunners-dragons.s3.eu-central-1.amazonaws.com/${rarity}/images/${index}.${extension}`,
        {
          responseType: "arraybuffer",
        }
      )
    ).data;
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", image.length);
    res.send(image);
    return;
  }
  try {
    res.sendFile(path.resolve(`${__dirname}/../../data/images/${id}.png`));
  } catch (e) {
    return res.sendStatus(404);
  }
};

export const getDragonsByTxId = async (req: Request, res: Response) => {
  try {
    const txId = req.params.txId;
    const dragonDocs = await db
      .collection("Dragons")
      .where("txId", "==", txId)
      .get();
    console.log(`${dragonDocs.size} dragons were minted in tx ${txId}`);

    const dragons = [];
    for (let i = 0; i < dragonDocs.docs.length; i++) {
      const data = dragonDocs.docs[i].data();
      const extension = data.rarity === "Legendary" ? "gif" : "png";
      const res: Buffer = (
        await axios.get(
          `https://moonrunners-dragons.s3.eu-central-1.amazonaws.com/${data.rarity}/images/${data.index}.${extension}`,
          {
            responseType: "arraybuffer",
          }
        )
      ).data;
      dragons.push({
        ...data,
        image: res.toString("base64"),
      });
    }
    console.log(dragons);
    res.json(dragons);
  } catch (e) {
    console.log(e);
    return res.sendStatus(404);
  }
};

export const getDragonsByAddress = async (req: Request, res: Response) => {
  try {
    const address = req.params.id;
    const dragons = (
      await alchemy.nft.getNftsForOwner(address as string, {
        contractAddresses: [dragonsAddress],
        // pageSize: 30,
      })
    ).ownedNfts;
    const dbDragonFetches = await Promise.all(
      dragons.map((dragon) =>
        db.collection("Dragons").doc(dragon.tokenId).get()
      )
    );
    const dbDragons = dbDragonFetches.map((d) => d.data());
    console.log(`found ${dbDragons.length} dragons.`);
    res.json(
      dragons.map((dragon, index) => ({
        ...dragon,
        rarity: dbDragons[index]?.rarity,
      }))
    );
  } catch (e) {
    console.log(e);
    return res.json([]);
  }
};
