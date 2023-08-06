import fs from "fs";
import _ from "lodash";
import { ethers } from "ethers";

const lines = fs.readFileSync("./wl.csv").toString().split("\n");
console.log(`total lines: ${lines.length}`);
const uniqLines = _.uniq(lines.sort());
console.log(`total uniq lines: ${uniqLines.length}`);

const walletAddresses = uniqLines
  .map((line) => line.trim())
  .filter((line, index) => ethers.utils.isAddress(line));
console.log(`total correct wallets: ${walletAddresses.length}`);

fs.writeFileSync(
  "./addresses.json",
  JSON.stringify(walletAddresses.map((address) => [address]))
);
