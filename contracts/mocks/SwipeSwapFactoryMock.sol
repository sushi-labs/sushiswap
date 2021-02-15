// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../swipeswapv2/SwipeswapV2Factory.sol";

contract SwipeSwapFactoryMock is SwipeswapV2Factory {
    constructor(address _feeToSetter) public SwipeswapV2Factory(_feeToSetter) {}
}