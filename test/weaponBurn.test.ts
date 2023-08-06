import { deployContract, deployProxy } from "./utils";
import { DragonsV2, MoonrunnersLoot, WeaponBurn } from "../typechain-types";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";

describe("weapon burn/re-roll", () => {
  it("should emit re-roll event", async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const weaponsContract = (await deployContract(
      "MoonrunnersLoot"
    )) as MoonrunnersLoot;
    const dragonsContract = (await deployProxy("DragonsV2", [
      owner.address,
      444,
    ])) as DragonsV2;
    const weaponsBurnContract = (await deployContract("WeaponBurn", [
      dragonsContract.address,
      weaponsContract.address,
    ])) as WeaponBurn;
    await weaponsContract.moonDropBatch(
      [otherAccount.address],
      [[1, 2, 3]],
      [[5, 5, 5]]
    );
    await dragonsContract.setPublicMinting(true, 1);
    await dragonsContract.setMaxPerWallet(100);
    await dragonsContract.connect(otherAccount).mint([], {
      value: (await dragonsContract.price()).mul(BigNumber.from("100")),
    });
    await dragonsContract.mint([], {
      value: (await dragonsContract.price()).mul(BigNumber.from("100")),
    });
    await expect(
      weaponsBurnContract
        .connect(otherAccount)
        .rerollDragons([1, 2, 3], [101, 102, 103])
    ).to.be.revertedWith("Dragon is not yours to re-roll!");
    await weaponsBurnContract
      .connect(otherAccount)
      .rerollDragons([1, 2, 3], [1, 2, 3]);
    expect(await weaponsContract.balanceOf(otherAccount.address, 1)).to.equal(
      4
    );
    expect(await weaponsContract.balanceOf(otherAccount.address, 2)).to.equal(
      4
    );
    expect(await weaponsContract.balanceOf(otherAccount.address, 3)).to.equal(
      4
    );
    const tx = await weaponsBurnContract
      .connect(otherAccount)
      .rerollDragons([1, 2, 3], [1, 2, 3]);
    const receipt = await tx.wait();
    expect(
      receipt.events?.filter((x) => {
        return x.event === "Reroll";
      }).length
    ).to.equal(1);
  });
});
