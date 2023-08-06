import * as core from "express-serve-static-core";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_API_URL = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`;

export default (app: core.Express) => {
  app.post("/eth-proxy", async (req, res) => {
    try {
      const requestData = req.body;
      const response = await axios.post(ALCHEMY_API_URL, requestData);
      res.json(response.data);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const errorWithResponse = error as {
          response: { status: number; data: any };
        };
        res
          .status(errorWithResponse.response.status)
          .json(errorWithResponse.response.data);
      } else {
        res.status(500).json({ error: "Proxy request failed" });
      }
    }
  });
};
