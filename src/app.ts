import express, { Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import liveRoute from "./routes/live";
import walletRoute from "./routes/wallet";
import proxy from "./routes/proxy";
import dragons from "./routes/dragons";
import * as dotenv from "dotenv";
import { listenToBurnEvents } from "./listeners/lootBurn";
dotenv.config();

const httpPort = process.env.PORT || 3000;

const startServer = () => {
  const app = express();
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // turn off parsing urlencoded request body
  app.use(express.urlencoded({ extended: false }));

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());

  liveRoute(app);
  walletRoute(app);
  proxy(app);
  dragons(app);
  listenToBurnEvents();

  app.listen(httpPort, () => {
    console.log(`App listening on port ${httpPort}`);
  });
};

startServer();
