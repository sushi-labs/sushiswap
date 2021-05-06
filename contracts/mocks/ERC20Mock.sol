// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 memory decimal,
        uint256 supply
    ) public ERC20(name, symbol, decimal) {
        _setupDecimals(decimal);
        _mint(msg.sender, supply);
    }
}