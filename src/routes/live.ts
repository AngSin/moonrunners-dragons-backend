import * as core from "express-serve-static-core";
import path from "path";

export default (app: core.Express) => {
  app.get("/", (req, res) => {
    res.sendStatus(200);
  });

  app.get("/loadforge.txt", (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../../loadforge.txt`));
  });
};
