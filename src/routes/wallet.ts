import * as core from "express-serve-static-core";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
// import addresses from "../../data/addresses.json";
const addresses: String[][] = [];
import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { trophiesAbi, trophiesAddress } from "../utils/constants";
dotenv.config();

const tree = StandardMerkleTree.of(addresses, ["address"]);
console.log(tree.root);
console.log(tree.getProof(["0xa25B778E5A9A6a892f9446A55922F8A7de44b4C0"]));

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const trophiesContract = new ethers.Contract(
  trophiesAddress,
  trophiesAbi,
  provider
);

const randomHex = [
  "0xd5b5f64d66cc31c622be4bdc9e83b48fafd599c8e2dcd4402032ab1c9f89dece",
];

export default (app: core.Express) => {
  app.post("/wallet-check", async (req, res) => {
    res.json({
      _proof: tree.getProof(["0x84CD1AAFbC183373Ee0bBF228aB19146296f2EE8"]),
    });
  });

  app.get("/tx/:transactionId", async (req, res) => {
    const transactionId = req.params.transactionId;
    console.log(transactionId);
    const details = await provider.getTransaction(transactionId);
    console.log(details);
  });
};
