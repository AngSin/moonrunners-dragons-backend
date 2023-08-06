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
  for (let i = 0; i <= limit; i++) {
    try {
      await storage
        .bucket("gs://moonrunners-dragons-goerli")
        .upload(`./data/bloodBurn/${rarity}/json/${i}.json`, {
          destination: `${rarity}/json/${i}.json`,
        });
      // @ts-ignore
      if (rarity !== "Legendary") {
        await storage
          .bucket("gs://moonrunners-dragons-goerli")
          .upload(`./data/bloodBurn/${rarity}/images/${i}.png`, {
            destination: `${rarity}/images/${i}.png`,
          });
      } else {
        await storage
          .bucket("gs://moonrunners-dragons-goerli")
          .upload(`./data/bloodBurn/${rarity}/images/${i}.gif`, {
            destination: `${rarity}/images/${i}.gif`,
          });
      }
    } catch (e) {
      console.log(`Failed to upload: ${e}`);
      console.log("Failed at index: ", i);
      break;
    }
  }
  // })
  // );
};

main();
// const storageRef = ref(storage);
