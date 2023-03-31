// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SureToken {
    uint256 public totalSupply_;
    string public name;
    string public symbol;
    uint public decimals;
    address public owner;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;

    event Approval (
        address indexed tokenOwner,
        address indexed spender,
        uint256 tokens
    );

    event Transfer(address indexed from, address indexed to, uint256 tokens);

    constructor(
        uint256 _total,
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _owneraddress
    ) {
        totalSupply_ = _total;
        owner = _owneraddress;
        balances[_owneraddress] = totalSupply_; // why do we write it like this?
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public view returns (uint256) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint256 numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender] - numTokens;
        balances[receiver] = balances[receiver] + numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    // https://stackoverflow.com/questions/70672642/whats-the-purpose-of-the-approve-function-in-erc-20
    function approve(address delegate, uint256 numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address _owner, address _delegate) public view returns (uint256) {
        return allowed[_owner][_delegate];
    }

    function transferFrom(
        address _owner,
        address _buyer,
        uint256 numTokens
    ) public returns (bool) {
        require(numTokens <= balances[_owner]);
        require(numTokens <= allowed[_owner][msg.sender]);
        balances[_owner] = balances[_owner] - numTokens;
    }
}