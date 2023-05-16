// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract PredictionWorld4 is Initializable {
    address public owner;
    address public sureToken;
    uint256 public totalMarkets;
    // Early Bird Limit (Get the SURE when first play)
    uint32 public numOfEarlyBirdsAllowed;
    // Early Bird Free Amount
    uint256 public amountOfFreeTokenForEarlyBird;
    // Early Bird Actually Count (Current count)
    uint32 public currentEarlyBirdCount;

    mapping(uint256 => Market) public markets;
    mapping(address => uint256) public winAmounts;
    address[] public winAddresses;

    struct Market {
        uint256 id;
        Info info;
        Bet[] yesBets;
        Bet[] noBets;
        uint256 totalAmount;
        uint256 totalYesAmount;
        uint256 totalNoAmount;
        bool marketClosed;
        bool outcome;
    }

    struct Info {
        string question;
        uint256 timestamp;
        uint256 endTimestamp;
        address createdBy;
        string creatorImageHash;
        string description;
        string resolverUrl;
    }

    struct Bet {
        address user;
        uint256 amount;
        uint256 timestamp;
    }

    event MarketCreated(
        uint256 id,
        string market,
        uint256 timestamp,
        address createdBy,
        string creatorImageHash,
        uint256 totalAmount,
        uint256 totalYesAmount,
        uint256 totalNoAmount
    );

    function initialize(
        address _sureToken,
        uint32 _numOfEarlyBirdsAllowed,
        uint256 _amountOfFreeTokenForEarlyBird
    ) public initializer {
        sureToken = _sureToken;
        numOfEarlyBirdsAllowed = _numOfEarlyBirdsAllowed;
        amountOfFreeTokenForEarlyBird = _amountOfFreeTokenForEarlyBird;
        owner = msg.sender;
    }

    function createMarket(
        string memory _question,
        string memory _creatorImageHash,
        string memory _description,
        string memory _resolverUrl,
        uint256 _endTimestamp
    ) public {
        require(msg.sender == owner, "Unauthorized");
        uint256 timestamp = block.timestamp;

        Market storage market = markets[totalMarkets];
        market.id = totalMarkets++;
        market.info.question = _question;
        market.info.creatorImageHash = _creatorImageHash;
        market.info.timestamp = timestamp;
        market.info.createdBy = msg.sender;
        market.totalAmount = 0;
        market.totalYesAmount = 0;
        market.totalNoAmount = 0;
        market.info.description = _description;
        market.info.resolverUrl = _resolverUrl;
        market.info.endTimestamp = _endTimestamp;

        emit MarketCreated(
            totalMarkets,
            _question,
            timestamp,
            msg.sender,
            _creatorImageHash,
            0,
            0,
            0
        );
    }

    function addYesBet(uint256 _marketId, uint256 _value) public payable {
        require(
            _value <= ERC20(sureToken).allowance(msg.sender, address(this)),
            "Not allowed to spend this amount."
        );
        if (checkEarlyBird()) {
            address payable _address = payable(msg.sender);
            ERC20(sureToken).transfer(_address, amountOfFreeTokenForEarlyBird);
        }
        Market storage market = markets[_marketId];
        ERC20(sureToken).transferFrom(msg.sender, address(this), _value);
        Bet memory bet = Bet(msg.sender, _value, block.timestamp);

        market.totalYesAmount += _value;
        market.totalAmount += _value;
        market.yesBets.push(bet);
    }

    function addNoBet(uint256 _marketId, uint256 _value) public payable {
        require(
            _value <= ERC20(sureToken).allowance(msg.sender, address(this)),
            "Not allowed to spend this amount."
        );
        if (checkEarlyBird()) {
            address payable _address = payable(msg.sender);
            ERC20(sureToken).transfer(_address, amountOfFreeTokenForEarlyBird);
        }
        Market storage market = markets[_marketId];
        ERC20(sureToken).transferFrom(msg.sender, address(this), _value);
        Bet memory bet = Bet(msg.sender, _value, block.timestamp);

        market.totalNoAmount += _value;
        market.totalAmount += _value;
        market.noBets.push(bet);
    }

    function getBets(
        uint256 _marketId
    ) public view returns (Bet[] memory, Bet[] memory) {
        Market storage market = markets[_marketId];
        return (market.yesBets, market.noBets);
    }

    function distributeWinningAmount(
        uint256 _marketId,
        bool eventOutcome
    ) public payable {
        require(msg.sender == owner, "Unauthorized");

        Market storage market = markets[_marketId];
        if (eventOutcome) {
            for (uint256 i = 0; i < market.yesBets.length; i++) {
                // split all No bets with the Yessers
                uint256 winAmount = ((market.totalNoAmount *
                    market.yesBets[i].amount) / market.totalYesAmount);
                winAmounts[market.yesBets[i].user] += (winAmount +
                    market.yesBets[i].amount);
                // console.log(
                //     "%s win %s",
                //     market.yesBets[i].user,
                //     winAmounts[market.yesBets[i].user]
                // );
                winAddresses.push(market.yesBets[i].user);
            }

            for (uint256 i = 0; i < winAddresses.length; i++) {
                address payable _address = payable(winAddresses[i]);
                ERC20(sureToken).transfer(_address, winAmounts[_address]);
                delete winAmounts[_address];
            }
            delete winAddresses;
        } else {
            for (uint256 i = 0; i < market.noBets.length; i++) {
                uint256 winAmount = ((market.totalYesAmount *
                    market.noBets[i].amount) / market.totalNoAmount);
                winAmounts[market.noBets[i].user] += (winAmount +
                    market.noBets[i].amount);
                winAddresses.push(market.noBets[i].user);
            }

            for (uint256 i = 0; i < winAddresses.length; i++) {
                address payable _address = payable(winAddresses[i]);
                ERC20(sureToken).transfer(_address, winAmounts[_address]);
            }
            delete winAddresses;
        }
        market.outcome = eventOutcome;
        market.marketClosed = true;
    }

    mapping(address => bool) earlyBirds;

    function checkEarlyBird() public returns (bool) {
        if (currentEarlyBirdCount >= numOfEarlyBirdsAllowed) {
            return false;
        } else {
            if (earlyBirds[msg.sender]) {
                return false;
            } else {
                currentEarlyBirdCount += 1;
                earlyBirds[msg.sender] = true;
                return true;
            }
        }
    }

    function setNewOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
}
