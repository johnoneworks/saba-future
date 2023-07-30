// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract PredictionWorld7 is Initializable {
    address public commissionAddress;
    address public owner;
    address public sureToken;
    uint256 public totalMarkets;

    mapping(uint256 => Market) public markets;
    mapping(address => uint256) winAmounts;
    address[] winAddresses;

    mapping(address => bool) adminAddresses;

    // Save bets with different structure for enhancing performance
    // When it want to get the user's bets, it should get the market
    // and retrive every bets to check the user. It'll take a lot of time.
    // 1st Key: <USER_ADDRESS>
    // 2nd Key: <MARKET_ID>
    mapping(address => mapping(uint => Bet[])) userYesBets;
    mapping(address => mapping(uint => Bet[])) userNoBets;

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
        bool isSuspended;
    }

    struct Info {
        string question;
        uint256 timestamp;
        uint256 endTimestamp;
        address createdBy;
        string creatorImageHash;
        string description;
        string resolverUrl;
        bool isTest;
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

    error MarketClosed();
    error MarketSuspended();
    error MarketEnded();

    function initialize(address _sureToken) public initializer {
        sureToken = _sureToken;
        owner = msg.sender;
        commissionAddress = owner;
        adminAddresses[owner] = true;
    }

    function createMarket(
        string calldata _question,
        string calldata _creatorImageHash,
        string calldata _description,
        string calldata _resolverUrl,
        uint256 _endTimestamp,
        bool _isTest
    ) public onlyAdmin {
        uint256 timestamp = block.timestamp;

        Market storage market = markets[totalMarkets];
        market.id = totalMarkets++;
        market.info.question = _question;
        market.info.creatorImageHash = _creatorImageHash;
        market.info.timestamp = timestamp;
        market.info.createdBy = msg.sender;
        market.info.isTest = _isTest;
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

    // NOTICE: It'll update all of fields even if the value is empty.
    function setMarketInfo(
        uint256 _marketId,
        string calldata _question,
        string calldata _creatorImageHash,
        string calldata _description,
        string calldata _resolverUrl,
        uint256 _endTimestamp,
        bool _isTest
    ) public onlyAdmin {
        Market storage market = markets[_marketId];
        market.info.question = _question;
        market.info.creatorImageHash = _creatorImageHash;
        market.info.description = _description;
        market.info.resolverUrl = _resolverUrl;
        market.info.endTimestamp = _endTimestamp;
        market.info.isTest = _isTest;
    }

    function setMarketInfoQuestion(
        uint256 _marketId,
        string calldata _question
    ) public onlyAdmin {
        markets[_marketId].info.question = _question;
    }

    function setMarketInfoDescription(
        uint256 _marketId,
        string calldata _description
    ) public onlyAdmin {
        markets[_marketId].info.description = _description;
    }

    function setMarketInfoImage(
        uint256 _marketId,
        string calldata _Image
    ) public onlyAdmin {
        markets[_marketId].info.creatorImageHash = _Image;
    }

    function setMarketInfoResolverUrl(
        uint256 _marketId,
        string calldata _resolverUrl
    ) public onlyAdmin {
        markets[_marketId].info.resolverUrl = _resolverUrl;
    }

    function setMarketInfoEndTimestamp(
        uint256 _marketId,
        uint256 _endTimestamp
    ) public onlyAdmin {
        markets[_marketId].info.endTimestamp = _endTimestamp;
    }

    function setMarketInfoIsTest(
        uint256 _marketId,
        bool _isTest
    ) public onlyAdmin {
        markets[_marketId].info.isTest = _isTest;
    }

    function setMarketIsSuspended(
        uint256 _marketId,
        bool _isSuspended
    ) public onlyAdmin {
        markets[_marketId].isSuspended = _isSuspended;
    }

    function addYesBet(uint256 _marketId, uint256 _value) public payable {
        require(
            _value <= ERC20(sureToken).allowance(msg.sender, address(this)),
            "Not allowed to spend this amount."
        );

        Market storage market = markets[_marketId];
        if (market.marketClosed) {
            revert MarketClosed();
        }
        if (market.isSuspended) {
            revert MarketSuspended();
        }
        if (market.info.endTimestamp < (block.timestamp * 1000)) {
            revert MarketEnded();
        }

        ERC20(sureToken).transferFrom(msg.sender, address(this), _value);
        Bet memory bet = Bet(msg.sender, _value, block.timestamp);

        market.totalYesAmount += _value;
        market.totalAmount += _value;
        market.yesBets.push(bet);

        // add the same data into userBets for enhancing performance
        userYesBets[msg.sender][_marketId].push(bet);
    }

    function addNoBet(uint256 _marketId, uint256 _value) public payable {
        require(
            _value <= ERC20(sureToken).allowance(msg.sender, address(this)),
            "Not allowed to spend this amount."
        );

        Market storage market = markets[_marketId];
        if (market.marketClosed) {
            revert MarketClosed();
        }
        if (market.isSuspended) {
            revert MarketSuspended();
        }
        if (market.info.endTimestamp < (block.timestamp * 1000)) {
            revert MarketEnded();
        }

        ERC20(sureToken).transferFrom(msg.sender, address(this), _value);
        Bet memory bet = Bet(msg.sender, _value, block.timestamp);

        market.totalNoAmount += _value;
        market.totalAmount += _value;
        market.noBets.push(bet);

        // add the same data into userBets for enhancing performance
        userNoBets[msg.sender][_marketId].push(bet);
    }

    function getBets(
        uint256 _marketId
    ) public view returns (Bet[] memory yesBets, Bet[] memory noBets) {
        Market memory market = markets[_marketId];
        return (market.yesBets, market.noBets);
    }

    function getUserBets(
        address _userAddress,
        uint256 _marketId
    ) public view returns (Bet[] memory yesBets, Bet[] memory noBets) {
        return (
            userYesBets[_userAddress][_marketId],
            userNoBets[_userAddress][_marketId]
        );
    }

    function updateUserBets(
        address _userAddress,
        uint256 _marketId
    ) public onlyAdmin {
        Market memory market = markets[_marketId];
        delete userYesBets[_userAddress][_marketId];
        for (uint i = 0; i < market.yesBets.length; i++) {
            if (market.yesBets[i].user == _userAddress) {
                userYesBets[_userAddress][_marketId].push(market.yesBets[i]);
            }
        }
        delete userNoBets[_userAddress][_marketId];
        for (uint i = 0; i < market.noBets.length; i++) {
            if (market.noBets[i].user == _userAddress) {
                userNoBets[_userAddress][_marketId].push(market.noBets[i]);
            }
        }
    }

    function distributeWinningAmount(
        uint256 _marketId,
        bool _eventOutcome
    ) public payable onlyAdmin {
        uint256 commissionRate = 99;
        uint256 hundred = 100;

        Market storage market = markets[_marketId];
        if (market.marketClosed) {
            revert MarketClosed();
        }

        if (_eventOutcome) {
            uint256 bounus = (market.totalNoAmount * commissionRate) / hundred;
            uint256 totalWinAmount = 0;
            for (uint256 i = 0; i < market.yesBets.length; i++) {
                // split all No bets with the Yessers
                uint256 winAmount = ((bounus * market.yesBets[i].amount) /
                    market.totalYesAmount);
                totalWinAmount += winAmount;
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

            // Send the commission.
            uint256 commission = market.totalNoAmount - totalWinAmount;
            address payable _commissionAddress = payable(commissionAddress);
            ERC20(sureToken).transfer(_commissionAddress, commission);

            delete winAddresses;
        } else {
            uint256 bounus = (market.totalYesAmount * commissionRate) / hundred;
            uint256 totalWinAmount = 0;
            for (uint256 i = 0; i < market.noBets.length; i++) {
                uint256 winAmount = ((bounus * market.noBets[i].amount) /
                    market.totalNoAmount);
                totalWinAmount += winAmount;
                winAmounts[market.noBets[i].user] += (winAmount +
                    market.noBets[i].amount);
                winAddresses.push(market.noBets[i].user);
            }

            for (uint256 i = 0; i < winAddresses.length; i++) {
                address payable _address = payable(winAddresses[i]);
                ERC20(sureToken).transfer(_address, winAmounts[_address]);
                delete winAmounts[_address];
            }

            // Send the commission.
            uint256 commission = market.totalYesAmount - totalWinAmount;
            address payable _commissionAddress = payable(commissionAddress);
            ERC20(sureToken).transfer(_commissionAddress, commission);

            delete winAddresses;
        }
        market.outcome = _eventOutcome;
        market.marketClosed = true;
    }

    /// Fetch markets with parameters
    /// @param cursor The starting cursor.
    ///               It will always skip the cursor.
    ///               Only when the order type is ASC and the starting cursor is 0
    ///               will it rerun the market with  0 cursor.
    ///               If the order type is DESC,
    ///               you should use the totalMarkets as the starting cursor.
    /// @param size The size for fetching
    /// @param status Filter by status => 0: All, 1: NOT Closed, 2: Closed
    /// @param withTest Filter by test status => true: Test, false: NOT Test
    /// @param isDescendOrder Sort by desc => true: asc, false: desc
    /// @return values The markets
    /// @return nextCursor Next filtering cursor
    function fetchMarkets(
        uint256 cursor,
        uint256 size,
        uint8 status,
        bool withTest,
        bool isDescendOrder
    ) public view returns (Market[] memory values, uint256 nextCursor) {
        uint256 totalCount = getCountWithoutTest(
            cursor,
            size,
            status,
            withTest,
            isDescendOrder
        );

        if (totalCount == 0) {
            return (values, 0);
        }

        values = new Market[](totalCount);

        uint256 newIndex;
        uint256 currentCount;
        uint256 i;
        // It will always skip the cursor.
        // Only when the order type is asc and the starting cursor is 0
        // will it rerun the market with  0 cursor.
        if (!isDescendOrder && cursor == 0) {
            i = 0;
        } else {
            if (isDescendOrder) {
                i = cursor - 1;
            } else {
                i = cursor + 1;
            }
        }
        for (
            ;
            isDescendOrder ? (i >= 0) : (i < totalMarkets);
            isDescendOrder ? i-- : i++
        ) {
            if (
                (status == 1 && markets[i].marketClosed) ||
                (status == 2 && !markets[i].marketClosed) ||
                (!withTest && markets[i].info.isTest)
            ) {
                // Avoid the desc order with 0 start index.
                if (isDescendOrder && i == 0) {
                    break;
                }
                continue;
            }

            values[newIndex++] = markets[i];
            currentCount++;
            if (currentCount >= size) {
                break;
            }
            // Avoid the desc order with 0 start index.
            if (isDescendOrder && i == 0) {
                break;
            }
        }
        return (values, i);
    }

    function getCountWithoutTest(
        uint256 cursor,
        uint256 size,
        uint8 status,
        bool withTest,
        bool isDescendOrder
    ) internal view returns (uint256) {
        // When ordering by descend, the final cursor should be -1.
        // BUT the uint must be greater than 0,
        // It has to check if the cursor == 0 and order type is descend
        // it should be return empty array.
        if (isDescendOrder && cursor <= 0) {
            return 0;
        }

        uint256 count;
        uint256 i;
        // It will always skip the cursor.
        // Only when the order type is asc and the starting cursor is 0
        // will it rerun the market with  0 cursor.
        if (!isDescendOrder && cursor == 0) {
            i = 0;
        } else {
            if (isDescendOrder) {
                i = cursor - 1;
            } else {
                i = cursor + 1;
            }
        }
        for (
            ;
            isDescendOrder ? (i >= 0) : (i < totalMarkets);
            isDescendOrder ? i-- : i++
        ) {
            if (
                (status == 1 && markets[i].marketClosed) ||
                (status == 2 && !markets[i].marketClosed) ||
                (!withTest && markets[i].info.isTest)
            ) {
                // Avoid the desc order with 0 start index.
                if (isDescendOrder && i == 0) {
                    break;
                }
                continue;
            }
            count++;
            if (count >= size) {
                return count;
            }
            // Avoid the desc order with 0 start index.
            if (isDescendOrder && i == 0) {
                break;
            }
        }
        return count;
    }

    function setNewOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function isAdminUser(address _address) public view returns (bool) {
        return adminAddresses[_address];
    }

    function addAdminUser(address _address) public onlyOwner {
        if (!adminAddresses[_address]) {
            adminAddresses[_address] = true;
        }
    }

    function removeAdminUser(address _address) public onlyOwner {
        delete adminAddresses[_address];
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    modifier onlyAdmin() {
        require(adminAddresses[msg.sender], "Unauthorized");
        _;
    }
}
