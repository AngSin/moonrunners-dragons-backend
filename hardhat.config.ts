import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {},
    // goerli: {
    //   url: process.env.RPC_URL!!,
    //   accounts: [process.env.PRIVATE_KEY!!],
    // },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!!,
  },
};

export default config;
