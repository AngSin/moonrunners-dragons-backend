/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ITrophies,
  ITrophiesInterface,
} from "../../../contracts/DragonsV2.sol/ITrophies";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getStake",
    outputs: [
      {
        components: [
          {
            internalType: "uint256[]",
            name: "tokenIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct ITrophies.Stake",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class ITrophies__factory {
  static readonly abi = _abi;
  static createInterface(): ITrophiesInterface {
    return new utils.Interface(_abi) as ITrophiesInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITrophies {
    return new Contract(address, _abi, signerOrProvider) as ITrophies;
  }
}