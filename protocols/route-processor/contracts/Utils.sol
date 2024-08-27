// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.24;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

library Utils {
  using SafeERC20 for IERC20;

  address constant NATIVE_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

  /**
   * @dev returns user's balance of token (or native)
   */
  function anyBalanceOf(address token, address user) internal view returns (uint256) {
    if (token == NATIVE_ADDRESS) return address(user).balance;
    else return IERC20(token).balanceOf(user);
  }

  /**
   * @dev transfers native with correct revert bubble up
   */
  function transferNative(address to, uint256 amount) internal {
    (bool success, bytes memory returnBytes) = to.call{value: amount}('');
    if (!success) {
      assembly {
        revert(add(32, returnBytes), mload(returnBytes))
      }
    }
  }

  /**
   * @dev transfers ERC20 or native
   */
  function transferAny(address token, address to, uint256 amount) internal {
    if (token == NATIVE_ADDRESS) transferNative(to, amount);
    else IERC20(token).safeTransfer(to, amount);
  }

  /**
   * @dev transfers from ERC20 or transfers native
   */
  function transferAnyFromSender(address token, address to, uint256 amount) internal {
    if (token == NATIVE_ADDRESS) transferNative(to, amount);  // native liquidity is already on this contract
    else IERC20(token).safeTransferFrom(msg.sender, to, amount);
  }

  /**
   * @dev ERC20 approve that correct works with token.approve which returns bool or nothing (USDT for example)
   * @param token The token targeted by the call.
   * @param spender token spender
   * @param amount token amount
   */
  function approveStable(IERC20 token, address spender, uint256 amount) internal returns (bool) {
    (bool success, bytes memory data) = address(token).call(
      abi.encodeWithSelector(token.approve.selector, spender, amount)
    );
    return success && (data.length == 0 || abi.decode(data, (bool)));
  }

  /**
   * @dev ERC20 approve that correct works with token.approve which reverts if amount and 
   *      current allowance are not zero simultaniously (USDT for example). 
   *      In second case it tries to set allowance to 0, and then back to amount.
   * @param token The token targeted by the call.
   * @param spender token spender
   * @param amount token amount
   */
  function approveSafe(IERC20 token, address spender, uint256 amount) internal returns (bool) {
    return approveStable(token, spender, amount) 
      || (approveStable(token, spender, 0) && approveStable(token, spender, amount));
  }
}
