// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../suniswap/SuniswapPair.sol";

contract SuniSwapPairMock is SuniswapPair {
    constructor() public SuniswapPair() {}
}