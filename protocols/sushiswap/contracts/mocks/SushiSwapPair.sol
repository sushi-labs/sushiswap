// SPDX-License-Identifier: MIT

pragma solidity >=0.6.12;

import "../UniswapV2Pair.sol";

contract SushiSwapPair is UniswapV2Pair {
    constructor() public UniswapV2Pair() {}
}