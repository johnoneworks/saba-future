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
        string memory _resolverUrl,
        uint256 _endTimestamp
    ) public {
        require(msg.sender == owner, "Unauthorized");
        uint256 timestamp = block.timestamp;

        Market storage market = markets[totalMarkets];
        market.id = totalMarkets++;
        market.market = _market;
        market.timestamp = timestamp;
        market.createdBy = msg.sender;
        market.totalAmount = 0;
        market.totalYesAmount = 0;
        market.totalNoAmount = 0;
        market.description = _description;
        market.resolverUrl = _resolverUrl;
        market.endTimestamp = _endTimestamp;

        emit MarketCreated(
            totalMarkets,
            _market,
            timestamp,
            msg.sender,
            0,
            0,
            0
        );
    }

    function addYesBet(uint256 _marketId, uint256 _value) public payable {
        require(_value <= ERC20(sureToken2).allowance(msg.sender, address(this)), "Not allowed to spend this ammount.");
        Market storage market = markets[_marketId];
        ERC20(sureToken2).transferFrom(msg.sender, address(this), _value);
        AmountAdded memory amountAdded = AmountAdded(
            msg.sender,
            _value,
            block.timestamp
        );

        market.totalYesAmount += _value;
        market.totalAmount += _value;
        market.yesCount.push(amountAdded);
    }

    function addNoBet(uint256 _marketId, uint256 _value) public payable {
        require(_value <= ERC20(sureToken2).allowance(msg.sender, address(this)), "Not allowed to spend this amount.");
        Market storage market = markets[_marketId];
        ERC20(sureToken2).transferFrom(msg.sender, address(this), _value);
        AmountAdded memory amountAdded = AmountAdded(
            msg.sender,
            _value,
            block.timestamp
        );

        market.totalNoAmount += _value;
        market.totalAmount += _value;
        market.noCount.push(amountAdded);
    }

    function distributeWinningAmount(uint256 _marketId, bool eventOutcome) public payable {
        require(msg.sender == owner, "Unauthorized");

        Market storage market = markets[_marketId];
        if (eventOutcome) {
            for (uint256 i = 0; i < market.yesCount.length; i++) {
                // split all No bets with the Yessers
                uint256 winAmount = (market.totalNoAmount * (market.yesCount[i].amount / market.totalYesAmount));
                winAmounts[market.yesCount[i].user] += (winAmount + market.yesCount[i].amount);
                winAddresses.push(market.yesCount[i].user);
            }

            for (uint256 i = 0; i < winAddresses.length; i++) {
                address payable _address = payable(winAddresses[i]);
                ERC20(sureToken2).transfer(_address, winAmounts[_address]);
                delete winAmounts[_address];
            }
            delete winAddresses;
        } else {
            for (uint256 i = 0; i < market.noCount.length; i++) {
                uint256 winAmount = (market.totalYesAmount * (market.noCount[i].amount / market.totalNoAmount));
                winAmounts[market.noCount[i].user] += (winAmount + market.noCount[i].amount);
                winAddresses.push(market.noCount[i].user);
            }

            for (uint256 i = 0; i < winAddresses.length; i++) {
                address payable _address = payable(winAddresses[i]);
                ERC20(sureToken2).transfer(_address, winAmounts[_address]);
            }
            delete winAddresses;
        }
        market.marketClosed = true;
    }

        
 }