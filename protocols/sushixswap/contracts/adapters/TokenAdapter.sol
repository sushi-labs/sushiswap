// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IWETH.sol";

/// @title TokenAdapter
/// @notice Adapter for all token operations
abstract contract TokenAdapter {
    using SafeERC20 for IERC20;

    /// @notice Function to transfer tokens from address(this)
    /// @param token token to transfer
    /// @param to receiver
    /// @param amount amount to transfer
    function _transferTokens(
        IERC20 token,
        address to,
        uint256 amount
    ) internal {
        if (address(token) != address(0)) {
            token.safeTransfer(to, amount);
        } else {
            payable(to).transfer(amount);
        }
    }

    /// @notice Function to transfer tokens from user to the to address
    /// @param token token to transfer
    /// @param to receiver
    /// @param amount amount to transfer
    function _transferFromToken(
        IERC20 token,
        address to,
        uint256 amount
    ) internal {
        token.safeTransferFrom(msg.sender, to, amount);
    }

    /// @notice Unwraps the wrapper native into native and sends it to the receiver.
    /// @param token token to transfer
    /// @param to receiver
    function _unwrapTransfer(address token, address to) internal {
        IWETH(token).withdraw(IERC20(token).balanceOf(address(this)));
        _transferTokens(IERC20(address(0)), to, address(this).balance);
    }

    /// @notice Wraps the token to the wrapped token
    /// @param token token to wrap
    /// @param amount amount to wrap
    function _wrapToken(address token, uint256 amount) internal {
        IWETH(token).deposit{value: amount}();
    }
}