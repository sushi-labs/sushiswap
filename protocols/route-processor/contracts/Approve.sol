// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

library Approve {

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
