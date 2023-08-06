import fs from "fs";

for (let i = 967; i <= 1356; i++) {
  const extension = i === 1149 ? "gif" : "png";
  fs.copyFileSync(
    `./data/images/${i}.${extension}`,
    `./unused/images/${i}.${extension}`
  );
  fs.unlinkSync(`./data/images/${i}.${extension}`);
  fs.copyFileSync(`./data/json/${i}.json`, `./unused/json/${i}.json`);
  fs.unlinkSync(`./data/json/${i}.json`);
}
