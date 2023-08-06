// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "erc721a/contracts/interfaces/IERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ILoot {
    function controlledBurn(address _from, uint256 _id, uint256 _amount) external;
}

contract WeaponBurn is Ownable {
    address public dragonsContract;
    address public weaponsContract;
    event Reroll(uint256[] _weaponIds, uint256[] _dragonIds);
    constructor(address _dragonsContract, address _weaponsContract){
        dragonsContract = _dragonsContract;
        weaponsContract = _weaponsContract;
    }

    function setDragonsContract(address _dragonsContract) public onlyOwner {
        dragonsContract = _dragonsContract;
    }

    function setLootContract(address _lootContract) public onlyOwner {
        weaponsContract = _lootContract;
    }

    function rerollDragons(uint256[] calldata _weaponIds, uint256[] calldata _dragonIds) public {
        for (uint256 i = 0; i < _weaponIds.length; i++) {
            require(IERC721A(dragonsContract).ownerOf(_dragonIds[i]) == msg.sender, "Dragon is not yours to re-roll!");
            ILoot(weaponsContract).controlledBurn(msg.sender, _weaponIds[i], 1);
        }
        emit Reroll(_weaponIds, _dragonIds);
    }
}
