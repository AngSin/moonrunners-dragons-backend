import { BigNumber } from "ethers";

const rarities: Rarity[] = ["D1", "D2", "D3", "Legendary"];

type Rarity = "D1" | "D2" | "D3" | "Legendary";

type WeaponId = 0 | 8 | 1 | 2 | 9 | 3 | 12;
export const rarityChancesByWeapon = {
  [0]: [0, 530, 975, 1000],
  [8]: [510, 910, 1000, 1000],
  [1]: [370, 920, 1000, 1000],
  [2]: [660, 970, 1000, 1000],
  [9]: [660, 970, 1000, 1000],
  [3]: [770, 990, 1000, 1000],
  [12]: [680, 965, 999.97426, 1000], // dice
};

export const isItemWeapon = (itemId: number): itemId is WeaponId =>
  Object.keys(rarityChancesByWeapon).includes(itemId.toString());

export const rollRarity = (weaponId: WeaponId): Rarity => {
  const rarityThresholds = rarityChancesByWeapon[weaponId];
  const random = Math.random() * 1000;
  console.log(`Rolled ${random} value for ${weaponId}`);
  for (let i = 0; i < rarityThresholds.length; i++) {
    const threshold = rarityThresholds[i];
    if (random <= threshold) {
      return rarities[i];
    }
  }
  console.error(`${random} random value failed for weapon ${weaponId}`);
  throw Error("Something went wrong!");
};
