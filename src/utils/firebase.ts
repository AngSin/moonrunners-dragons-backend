import * as dotenv from "dotenv";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
dotenv.config();

const serviceAccount = require("../../firebase-config.json"); // create your own project and add a firebase config file

initializeApp({
  credential: cert(serviceAccount),
});

export const db = getFirestore();
