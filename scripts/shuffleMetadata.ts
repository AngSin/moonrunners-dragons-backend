import _ from "lodash";
import fs from "fs";

fs.mkdirSync("./shuffled");
fs.mkdirSync("./shuffled/images");
fs.mkdirSync("./shuffled/json");

const unmintedTokenIds = [];

for (let i = 894; i < 1500; i++) {
  unmintedTokenIds.push(i);
}

const newTokenIds = _.shuffle(unmintedTokenIds);

unmintedTokenIds.forEach((tokenId, index) => {
  const newTokenId = newTokenIds[index];
  const extension = tokenId === 1363 ? "gif" : "png";
  fs.copyFileSync(
    `./data/images/${tokenId}.${extension}`,
    `./shuffled/images/${newTokenId}.${extension}`
  );
  fs.copyFileSync(
    `./data/json/${tokenId}.json`,
    `./shuffled/json/${newTokenId}.json`
  );
});
