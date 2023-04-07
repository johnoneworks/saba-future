// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Prediction {
    struct Market {
        address payable maker;
        address payable taker;
        uint amount;
        int oddsForTrueResult; // 100 == 1 decimal odd
    }

    address payable public owner;
    uint public lastMarketOperationTime;
    uint public resolveTime;
    string public description;
    Market[] public markets;

    constructor(uint _lastMarketOperationTime, uint _resolveTime, string memory _description) payable {
        require(
            block.timestamp < _resolveTime,
            "Prediction resolve time should be in the future"
        );
        require(
            block.timestamp < _lastMarketOperationTime,
            "Market operation time should be in the future"
        );
        require(
            _lastMarketOperationTime < _resolveTime,
            "No market operations after resolving"
        );

        owner = payable(msg.sender);
        lastMarketOperationTime = _lastMarketOperationTime;
        resolveTime = _resolveTime;
        description = _description;
    }

}