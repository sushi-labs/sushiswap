// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../uniswapv2/SuniswapPair.sol";

contract SuniSwapPairMock is SuniswapPair {
    constructor() public SuniswapPair() {}
}