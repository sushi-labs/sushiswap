// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import '../interfaces/multichain/IMultiChainV7Router.sol';

abstract contract MultiChainAdapter is ImmutableState {
  using SafeERC20 for IERC20;

  struct AnySwapTeleportParams {
    address token;
    address to;
    uint256 amount;
    uint256 toChainID;
    address anyCallProxy;
    bytes32 srcContext;
  }

  function _anySwapTeleport(
    AnySwapTeleportParams memory params,
    uint8[] memory actions,
    uint256[] memory values,
    bytes[] memory datas
  ) internal {
    bytes memory payload = abi.encode(params.to, actions, values, datas, params.srcContext);

    uint256 amount = params.amount != 0 ? params.amount : IERC20(params.token).balanceOf(address(this));

    IERC20(params.token).safeApprove(params.to, amount);

    multichainRouter.anySwapOutAndCall(
      params.token,
      Strings.toHexString(params.to),
      amount,
      params.toChainID,
      Strings.toHexString(params.anyCallProxy),
      payload
    );
  }

  function exec(
    address token,
    address receiver,
    uint256 amount,
    bytes calldata data
  ) external returns (bool success, bytes memory result) {
    (address to, uint8[] memory actions, uint256[] memory values, bytes[] memory datas, bytes32 srcContext) = abi
      .decode(payload, (address, uint8[], uint256[], bytes[], bytes32));

    /// @dev incase the actions fail, transfer bridge token to the to address
    try ISushiXSwap(payable(address(this))).cook{gas: limit}(actions, values, datas) {} catch (bytes memory) {
      IERC20(_token).safeTransfer(to, amountLD);
      failed = true;
    }

    /// @dev transfer any native token received as dust to the to address
    if (address(this).balance > 0) to.call{value: (address(this).balance)}('');
  }
}
