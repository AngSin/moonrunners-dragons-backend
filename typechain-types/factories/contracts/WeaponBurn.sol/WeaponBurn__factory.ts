/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  WeaponBurn,
  WeaponBurnInterface,
} from "../../../contracts/WeaponBurn.sol/WeaponBurn";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_dragonsContract",
        type: "address",
      },
      {
        internalType: "address",
        name: "_weaponsContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_weaponIds",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "_dragonIds",
        type: "uint256[]",
      },
    ],
    name: "Reroll",
    type: "event",
  },
  {
    inputs: [],
    name: "dragonsContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "_weaponIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_dragonIds",
        type: "uint256[]",
      },
    ],
    name: "rerollDragons",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_dragonsContract",
        type: "address",
      },
    ],
    name: "setDragonsContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_lootContract",
        type: "address",
      },
    ],
    name: "setLootContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "weaponsContract",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161079738038061079783398101604081905261002f916100d5565b61003833610069565b600180546001600160a01b039384166001600160a01b03199182161790915560028054929093169116179055610108565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80516001600160a01b03811681146100d057600080fd5b919050565b600080604083850312156100e857600080fd5b6100f1836100b9565b91506100ff602084016100b9565b90509250929050565b610680806101176000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80638da5cb5b1161005b5780638da5cb5b146100ec578063bb940b94146100fd578063c037af6214610110578063f2fde38b1461012357600080fd5b80633505c67d1461008d57806370ee3e0d146100bc578063715018a6146100cf5780637cd22fc1146100d9575b600080fd5b6002546100a0906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b6001546100a0906001600160a01b031681565b6100d7610136565b005b6100d76100e73660046104b0565b61014a565b6000546001600160a01b03166100a0565b6100d761010b3660046104b0565b610174565b6100d761011e366004610520565b61019e565b6100d76101313660046104b0565b610378565b61013e6103f1565b610148600061044b565b565b6101526103f1565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b61017c6103f1565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b60005b838110156103345760015433906001600160a01b0316636352211e8585858181106101ce576101ce61058c565b905060200201356040518263ffffffff1660e01b81526004016101f391815260200190565b602060405180830381865afa158015610210573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061023491906105a2565b6001600160a01b03161461028f5760405162461bcd60e51b815260206004820152601f60248201527f447261676f6e206973206e6f7420796f75727320746f2072652d726f6c6c210060448201526064015b60405180910390fd5b6002546001600160a01b031663ee720065338787858181106102b3576102b361058c565b6040516001600160e01b031960e087901b1681526001600160a01b039094166004850152602002919091013560248301525060016044820152606401600060405180830381600087803b15801561030957600080fd5b505af115801561031d573d6000803e3d6000fd5b50505050808061032c906105bf565b9150506101a1565b507f5bf245604a4ce796bb52d63c3dd27a3cec1622fd801aa2c0d5b0e532df524e388484848460405161036a9493929190610618565b60405180910390a150505050565b6103806103f1565b6001600160a01b0381166103e55760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610286565b6103ee8161044b565b50565b6000546001600160a01b031633146101485760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610286565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146103ee57600080fd5b6000602082840312156104c257600080fd5b81356104cd8161049b565b9392505050565b60008083601f8401126104e657600080fd5b50813567ffffffffffffffff8111156104fe57600080fd5b6020830191508360208260051b850101111561051957600080fd5b9250929050565b6000806000806040858703121561053657600080fd5b843567ffffffffffffffff8082111561054e57600080fd5b61055a888389016104d4565b9096509450602087013591508082111561057357600080fd5b50610580878288016104d4565b95989497509550505050565b634e487b7160e01b600052603260045260246000fd5b6000602082840312156105b457600080fd5b81516104cd8161049b565b6000600182016105df57634e487b7160e01b600052601160045260246000fd5b5060010190565b81835260006001600160fb1b038311156105ff57600080fd5b8260051b80836020870137939093016020019392505050565b60408152600061062c6040830186886105e6565b828103602084015261063f8185876105e6565b97965050505050505056fea264697066735822122078f157f2f30261d31e16f61effd857849c9baddbd0fcaa8d7398b03e25ef3f9564736f6c63430008120033";

type WeaponBurnConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: WeaponBurnConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class WeaponBurn__factory extends ContractFactory {
  constructor(...args: WeaponBurnConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _dragonsContract: PromiseOrValue<string>,
    _weaponsContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<WeaponBurn> {
    return super.deploy(
      _dragonsContract,
      _weaponsContract,
      overrides || {}
    ) as Promise<WeaponBurn>;
  }
  override getDeployTransaction(
    _dragonsContract: PromiseOrValue<string>,
    _weaponsContract: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _dragonsContract,
      _weaponsContract,
      overrides || {}
    );
  }
  override attach(address: string): WeaponBurn {
    return super.attach(address) as WeaponBurn;
  }
  override connect(signer: Signer): WeaponBurn__factory {
    return super.connect(signer) as WeaponBurn__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WeaponBurnInterface {
    return new utils.Interface(_abi) as WeaponBurnInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WeaponBurn {
    return new Contract(address, _abi, signerOrProvider) as WeaponBurn;
  }
}
