// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Prediction {
    struct Market {
        uint256 id;
        address payable maker;
        address payable taker;
        uint amount;
        uint oddsForTrueResult; // 100 == 1 decimal odd
        bool makerOnTrue;
    }

    address payable public owner;
    address public sureToken; // not sure if this is needed
    uint public lastMarketOperationTime;
    uint public resolveTime;
    string public description;
   // mapping(uint256 => Market) public markets;
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

    function createMarket(uint _amount, uint _odds, bool _makerOnTrue) public {
        Market memory market;
        market.maker = payable(msg.sender);
        market.amount = _amount;
        market.oddsForTrueResult = _odds;
        market.makerOnTrue = _makerOnTrue;
        markets.push(market);
    }

    function takeMarket(uint _amount, uint _odds) public {
        for (uint i = 0; i < markets.length; i++) {
            if (
                    markets[i].amount == _amount && 
                    markets[i].oddsForTrueResult == _odds &&
                    markets[i].taker == address(0x0)
                ) {
                markets[i].taker = payable(msg.sender);
                return;
            }
        }
    }

    function resolvePrediction(bool _result) public view {
        for (uint i = 0; i < markets.length; i++) {
            uint poolAmount = ( markets[i].amount * markets[i].oddsForTrueResult ) / 100;
            if (_result) {
                // markets[i].makerOnTrue ? toMaker : toTaker;
                poolAmount++; // just to resolve the warning for the time being
            } else {
                // markets[i].makerOnTrue ? toTaker : toMaker;
            }

        }
    }
}