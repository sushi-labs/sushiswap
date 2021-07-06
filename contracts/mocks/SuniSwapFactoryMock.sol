// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../suniswap/SuniswapFactory.sol";

contract SuniSwapFactoryMock is SuniswapFactory {
    constructor(address _feeToSetter) public SuniswapFactory(_feeToSetter) {}
}