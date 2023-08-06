import * as core from "express-serve-static-core";
import {
  getById,
  getDragonsByAddress,
  getDragonsByTxId,
  getImageById,
} from "../controllers/dragons";

export default (app: core.Express) => {
  app.get("/dragons/:id", getById);
  app.get("/dragons/staked/:id", getById);
  app.get("/dragons/image/:id", getImageById);
  app.get("/dragons/tx/:txId", getDragonsByTxId);
  app.get("/dragons/address/:id", getDragonsByAddress);
};
