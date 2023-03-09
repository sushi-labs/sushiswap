// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "../interfaces/IBentoBoxMinimal.sol";
import "../base/ImmutableState.sol";

/// @title BentoAdapter
/// @notice Adapter which provides all functions of BentoBox require by this contract.
/// @dev These are generic functions, make sure, only msg.sender, address(this) and address(bentoBox)
/// are passed in the from param, or else the attacker can sifu user's funds in bentobox.
abstract contract BentoAdapter is ImmutableState {
    /// @notice Deposits the token from users wallet into the BentoBox.
    /// @dev Make sure, only msg.sender, address(this) and address(bentoBox)
    /// are passed in the from param, or else the attacker can sifu user's funds in bentobox.
    /// Pass either amount or share.
    /// @param token token to deposit. Use token as address(0) when depositing native token
    /// @param from sender
    /// @param to receiver
    /// @param amount amount to be deposited
    /// @param share share to be deposited
    /// @param value native token value to be deposited. Only use when token address is address(0)
    function _depositToBentoBox(
        address token,
        address from,
        address to,
        uint256 amount,
        uint256 share,
        uint256 value
    ) internal {
        bentoBox.deposit{value: value}(token, from, to, amount, share);
    }

    /// @notice Transfers the token from bentobox user to another or withdraw it to another address.
    /// @dev Make sure, only msg.sender, address(this) and address(bentoBox)
    /// are passed in the from param, or else the attacker can sifu user's funds in bentobox.
    /// Pass either amount or share.
    /// @param token token to transfer. For native tokens, use wnative token address
    /// @param from sender
    /// @param to receiver
    /// @param amount amount to transfer
    /// @param share share to transfer
    /// @param unwrapBento use true for withdraw and false for transfer
    function _transferFromBentoBox(
        address token,
        address from,
        address to,
        uint256 amount,
        uint256 share,
        bool unwrapBento
    ) internal {
        if (unwrapBento) {
            bentoBox.withdraw(token, from, to, amount, share);
        } else {
            if (amount > 0) {
                share = bentoBox.toShare(token, amount, false);
            }
            bentoBox.transfer(token, from, to, share);
        }
    }
}