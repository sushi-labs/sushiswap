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
  function approveStable0(IERC20 token, address spender, uint256 amount) internal returns (bool) {
    (bool success, bytes memory data) = address(token).call(
      abi.encodeWithSelector(token.approve.selector, spender, amount)
    );
    return success && (data.length > 0 ? abi.decode(data, (bool)) : true);
  }

  /**
   * @dev ERC20 approve that correct works with token.approve which reverts if amount and 
   *      current allowance are not zero (USDT for example). In second case it tries to set allowance to 0,
   *      and then back to amount.
   * @param token The token targeted by the call.
   * @param spender token spender
   * @param amount token amount
   */
  function approveStable(IERC20 token, address spender, uint256 amount) internal returns (bool) {
    return approveStable0(token, spender, amount) 
      || (approveStable0(token, spender, 0) && approveStable0(token, spender, amount));
  }
}
