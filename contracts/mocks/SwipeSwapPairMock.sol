// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../swipeswapv2/SwipeswapV2Pair.sol";

contract SwipeSwapPairMock is SwipeswapV2Pair {
    constructor() public SwipeswapV2Pair() {}
}