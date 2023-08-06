import * as dotenv from "dotenv";
import { initializeApp, cert } from "firebase-admin/app";
import { Storage } from "@google-cloud/storage";
dotenv.config();

const serviceAccount = require("../firebase-config.json");

initializeApp({
  credential: cert(serviceAccount),
});

const storage = new Storage({
  keyFilename: "./firebase-config.json",
});

const limits = {
  D1: 7812,
  D2: 5084,
  D3: 2981,
  Legendary: 11,
};

const main = async () => {
  const rarity = "D3";
  const limit = 2981;
  // await Promise.all(
  // Object.entries(limits).map(async ([rarity, limit]) => {
  try {
    const files = await storage
      .bucket("gs://moonrunners-dragons-goerli")
      .exists({});
    // .getFiles({
    //   startOffset: String(limit - 10),
    // });
    console.log(files.length);
  } catch (e) {
    console.log(`Failed to upload: ${e}`);
  }
};

main();
// const storageRef = ref(storage);
