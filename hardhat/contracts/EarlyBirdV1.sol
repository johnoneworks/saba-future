// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract EarlyBirdV1 is Initializable {
    // Early Bird Free Amount
    uint256 public amountOfFreeTokenForEarlyBird;
    // Early Bird Limit (Get the SURE when first play)
    uint32 public numOfEarlyBirdsAllowed;
    // Early Bird Actually Count (Current count)
    uint32 public currentEarlyBirdCount;
    // Early Bird Map
    mapping(address => bool) earlyBirds;
    // Contract Owner
    address public owner;

    error AllOccupied();
    error AlreadyExists();
    error UnknownValidState(uint8);

    function initialize(
        uint32 _numOfEarlyBirdsAllowed,
        uint256 _amountOfFreeTokenForEarlyBird
    ) public initializer {
        numOfEarlyBirdsAllowed = _numOfEarlyBirdsAllowed;
        amountOfFreeTokenForEarlyBird = _amountOfFreeTokenForEarlyBird;
        owner = msg.sender;
    }

    function snapUp(address sureToken) public payable {
        uint8 validState = validate(msg.sender);
        if (validState == 1) {
            currentEarlyBirdCount += 1;
            earlyBirds[msg.sender] = true;

            // transfer tokens
            address payable _address = payable(msg.sender);
            ERC20(sureToken).transfer(_address, amountOfFreeTokenForEarlyBird);
        } else if (validState == 2) {
            revert AllOccupied();
        } else if (validState == 3) {
            revert AlreadyExists();
        } else {
            revert UnknownValidState(validState);
        }
    }

    // Returns uint8
    // Valid  - 1
    // All Occupied - 2
    // Already Exists  - 3
    function validate(address _address) public view returns (uint8) {
        if (currentEarlyBirdCount >= numOfEarlyBirdsAllowed) {
            return 2;
        } else {
            if (earlyBirds[_address]) {
                return 3;
            }
        }
        return 1;
    }

    function setNewOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }
}
