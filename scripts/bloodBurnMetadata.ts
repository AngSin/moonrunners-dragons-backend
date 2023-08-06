import fs from "fs";

const indexes = {
  D1: 1933,
  D2: 1245,
  D3: 702,
  Legendary: 10,
};

for (let i = 5418; i < 17420; i++) {
  const json = require(`../Batch3/json/${i}.json`);
  const metadata = {
    description: json.description,
    attributes: json.attributes,
  };
  const rarity = metadata.attributes.find(
    // @ts-ignore
    (t) => t.trait_type === "Rarity"
  ).value;
  // @ts-ignore
  const index = indexes[rarity]++;
  if (rarity === "Legendary") {
    fs.copyFileSync(
      `./Batch3/images/${i}.gif`,
      `./data/bloodBurn/${rarity}/images/${index}.gif`
    );
  } else {
    fs.copyFileSync(
      `./Batch3/images/${i}.png`,
      `./data/bloodBurn/${rarity}/images/${index}.png`
    );
  }
  fs.writeFileSync(
    `./data/bloodBurn/${rarity}/json/${index}.json`,
    JSON.stringify(metadata)
  );
}
