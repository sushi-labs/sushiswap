// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.10;

import '../interfaces/ITasker.sol';
import '../libraries/SafeERC20.sol';
import '../interfaces/IBentoBoxMinimal.sol';

interface ISushiXSwap {
  function cook(
    uint8[] memory actions,
    uint256[] memory values,
    bytes[] memory datas
  ) external payable;
}

contract SushiXSwapTasker is ITasker {
  using SafeERC20 for IERC20;

  IBentoBoxMinimal public immutable bentoBox;
  ISushiXSwap public immutable sushiXSwap;

  constructor(IBentoBoxMinimal _bentoBox, ISushiXSwap _sushiXSwap) {
    bentoBox = _bentoBox;
    sushiXSwap = _sushiXSwap;
  }

  function onTaskReceived(bytes calldata data) external {
    (address token, uint128 shares, uint8[] memory actions, uint256[] memory values, bytes[] memory datas) = abi.decode(
      data,
      (address, uint128, uint8[], uint256[], bytes[])
    );
    IERC20(token).safeTransfer(address(sushiXSwap), bentoBox.toAmount(token, shares, false));
    sushiXSwap.cook(actions, values, datas);
  }
}
