// SPDX-License-Identifier: MIT

pragma solidity >=0.6.12;

import "../UniswapV2Factory.sol";

contract SushiSwapFactory is UniswapV2Factory {
    constructor() public UniswapV2Factory(msg.sender) {}
}