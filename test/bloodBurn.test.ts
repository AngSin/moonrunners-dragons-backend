import { deployContract, deployProxy } from "./utils";
import { DragonsV2, MoonrunnersLoot, Trophies } from "../typechain-types";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("burnBloodForDragons", () => {
  it("should let users burn their blood for dragons", async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    const dragons = (await deployProxy("DragonsV2", [
      owner.address,
      444,
    ])) as DragonsV2;
    const loot = (await deployContract("MoonrunnersLoot")) as MoonrunnersLoot;
    const trophies = (await deployProxy("Trophies")) as Trophies;
    await dragons.setTrophiesContract(trophies.address);
    await dragons.setLootContract(loot.address);
    await dragons.setIsBloodBurnLive(true);
    await loot.mintBatch(otherAccount.address, [7, 6, 5, 4], [5, 4, 1, 2]);
    expect(await loot.balanceOf(otherAccount.address, 7)).to.equal(5);
    // not enough common blood balance
    await expect(
      dragons.connect(otherAccount).burnBloodForDragons([7, 7])
    ).to.be.revertedWith("ERC1155: burn amount exceeds balance");
    expect(await loot.balanceOf(otherAccount.address, 7)).to.equal(5);
    // burn all of user's blood
    await dragons.connect(otherAccount).burnBloodForDragons([7, 6, 5, 4, 4]);
    expect(await loot.balanceOf(otherAccount.address, 7)).to.equal(0);
    expect(await loot.balanceOf(otherAccount.address, 6)).to.equal(0);
    expect(await loot.balanceOf(otherAccount.address, 5)).to.equal(0);
    expect(await loot.balanceOf(otherAccount.address, 4)).to.equal(0);
    expect(await dragons.balanceOf(otherAccount.address)).to.equal(5);
  });
});
