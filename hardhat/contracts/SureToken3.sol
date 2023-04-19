// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// this one is utilizing openzeppelin to make the tokens

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SureToken3 is ERC20 {
    address public owner;

    constructor() ERC20("Sure Token", "SURE") {
        owner = msg.sender;
        _mint(msg.sender, 1000000 * 10**18); // 100,000 SURE token to owner
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == owner, "Only owner can mint");
        _mint(to, amount);
    }
}