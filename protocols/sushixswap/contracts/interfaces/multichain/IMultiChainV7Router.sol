// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.11;

import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '../../base/ImmutableState.sol';
import '../ISushiXSwap.sol';

interface IMultiChainV7Router {
  function anySwapOutAndCall(
    address token,
    string calldata to,
    uint256 amount,
    uint256 toChainID,
    string calldata anycallProxy,
    bytes calldata data
  ) external;
}
