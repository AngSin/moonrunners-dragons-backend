import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import addresses from "../data/addresses.json";

const tree = StandardMerkleTree.of(addresses, ["address"]);
console.log(tree.root);
