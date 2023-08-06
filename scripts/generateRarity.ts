import fs from "fs";

const rarityObj = {};

for (let i = 0; i < 1500; i++) {
  const metadata = require(`../data/json/${i}.json`);
  // @ts-ignore
  rarityObj[i] = metadata.attributes.find(
    // @ts-ignore
    (t) => t.trait_type === "Rarity"
  ).value;
}

fs.writeFileSync("./data/rarities.json", JSON.stringify(rarityObj));
