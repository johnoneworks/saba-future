// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Prediction {
    struct Market {
        address payable maker;
        address payable taker;
        ufixed decimalOddsForTrueResult;
    }

    address payable public owner;
    uint public lastMarketOperationTime;
    uint public resolveTime;
    string public description;
    
}