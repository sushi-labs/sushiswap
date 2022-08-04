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

interface IL1Helper {
  function wrapAndRelayTokens(address _receiver, bytes calldata _data) external payable;
}

contract SushiXSwapTasker is ITasker {
  using SafeERC20 for IERC20;

  IBentoBoxMinimal public immutable bentoBox;
  ISushiXSwap public immutable sushiXSwap;
  IL1Helper private immutable l1Helper;

  constructor(
    IBentoBoxMinimal _bentoBox,
    ISushiXSwap _sushiXSwap,
    IL1Helper _l1Helper
  ) {
    bentoBox = _bentoBox;
    sushiXSwap = _sushiXSwap;
    l1Helper = _l1Helper;
  }

  function onTaskReceived(bytes calldata data) external {
    (
      address token,
      uint128 shares,
      bool tornado,
      bytes memory tornadoData,
      uint8[] memory actions,
      uint256[] memory values,
      bytes[] memory datas
    ) = abi.decode(data, (address, uint128, bool, bytes, uint8[], uint256[], bytes[]));
    IERC20(token).safeTransfer(address(sushiXSwap), bentoBox.toAmount(token, shares, false));
    sushiXSwap.cook(actions, values, datas);
    if (tornado) {
      (address _receiver, bytes memory _data) = abi.decode(tornadoData, (address, bytes));
      l1Helper.wrapAndRelayTokens{value: address(this).balance}(_receiver, _data);
    }
  }
}
