import { expect } from "chai";
import { ethers } from "hardhat";
import { deployProxy } from "./utils";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { DragonsV2, Trophies } from "../typechain-types";
import { BigNumber } from "ethers";

describe("Staking", () => {
  it("token uri changes when dragons are staked", async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const dragons = (await deployProxy("Dragons", [
      owner.address,
      444,
    ])) as DragonsV2;
    const trophies = (await deployProxy("Trophies")) as Trophies;
    await dragons.setIsAllowListMinting(true);
    await dragons.setTrophiesContract(trophies.address);
    const values = [owner.address, otherAccount.address].map((add) => [add]);
    const tree = StandardMerkleTree.of(values, ["address"]);
    const proof = tree.getProof([owner.address]);
    await dragons.setRoot(tree.root);
    await dragons.mint(proof, {
      value: (await dragons.price()).mul(BigNumber.from("2")),
    });
    expect(await dragons.ownerOf(0)).to.equal(owner.address);
    await dragons.toggleStaking([0, 1], true);
    for (let i = 0; i < 2; i++) {
      expect(await dragons.tokenURI(i)).to.equal(
        `https://moonrunners-dragons.herokuapp.com/dragons/staked/${i}`
      );
      expect(await dragons.isStaked(i)).to.equal(true);
    }
    await dragons.toggleStaking([0, 1], false);
    for (let i = 0; i < 2; i++) {
      expect(await dragons.tokenURI(i)).to.equal(
        `https://moonrunners-dragons.herokuapp.com/dragons/${i}`
      );
      expect(await dragons.isStaked(i)).to.equal(false);
    }
  });

  it("dragons become non-transferable when staked", async () => {
    const [owner, otherAccount, o1, o2] = await ethers.getSigners();
    const dragons = (await deployProxy("Dragons", [
      owner.address,
      444,
    ])) as DragonsV2;
    const trophies = (await deployProxy("Trophies")) as Trophies;
    await dragons.setIsAllowListMinting(true);
    await dragons.setTrophiesContract(trophies.address);
    const values = [
      owner.address,
      otherAccount.address,
      o1.address,
      o2.address,
    ].map((add) => [add]);
    const tree = StandardMerkleTree.of(values, ["address"]);
    const proof = tree.getProof([owner.address]);
    await dragons.setRoot(tree.root);
    await dragons.mint(proof, {
      value: (await dragons.price()).mul(BigNumber.from("2")),
    });
    expect(await dragons.totalSupply()).to.equal(2);
    await dragons.toggleStaking([0, 1], true);
    for (let i = 0; i < 2; i++) {
      expect(await dragons.isStaked(i)).to.equal(true);
      await expect(
        dragons.transferFrom(owner.address, otherAccount.address, i)
      ).to.be.revertedWith("This dragon is staked!");
    }
    await dragons.toggleStaking([0, 1], false);
    for (let i = 0; i < 2; i++) {
      await dragons.transferFrom(owner.address, otherAccount.address, i);
      expect(await dragons.ownerOf(i)).to.equal(otherAccount.address);
    }
  });
});
