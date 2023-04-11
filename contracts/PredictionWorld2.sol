// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract PredictionWorld2 {
    address public owner;
    address public sureToken2;
    uint256 public totalMarkets = 0;
    
    constructor(address _sureToken) {
        owner = msg.sender;
        sureToken2 = _sureToken;
    }

    mapping(uint256 => Market) public markets;

    struct Market {
        uint256 id;
        string market;
        uint256 timestamp;
        uint256 endTimestamp;
        address createdBy;
        AmountAdded[] yesCount;
        AmountAdded[] noCount;
        uint256 totalAmount;
        uint256 totalYesAmount;
        uint256 totalNoAmount;
        bool marketClosed;
        string description;
        string resolverUrl;
    }

    struct AmountAdded {
        address user;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => uint256) public winAmounts;
    address[] public winAddresses;

    event MarketCreated(
        uint256 id,
        string market,
        uint256 timestamp,
        address createdBy,
        uint256 totalAmount,
        uint256 totalYesAmount,
        uint256 totalNoAmount
    );

    function createMarket(
        string memory _market,
        string memory _description,
        string memory _resolveUrl,
        uint256 _endTimestamp
    ) public {

    }
}