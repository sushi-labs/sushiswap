// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.24;

interface ITridentCLPool {
  function token0() external returns (address);
  function token1() external returns (address);

  function swap(
    address recipient,
    bool zeroForOne,
    int256 amountSpecified,
    uint160 sqrtPriceLimitX96,
    bool unwrapBento,
    bytes calldata data
  ) external returns (int256 amount0, int256 amount1);
}
