// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity >=0.5.0;

/// @notice Math library that contains methods that perform common math functions but do not do any overflow or underflow checks.
/// @author Adapted from https://github.com/Uniswap/uniswap-v3-core/blob/main/contracts/libraries/UnsafeMath.sol.
library UnsafeMath {
    /// @notice Returns ceil(x / y).
    /// @dev Division by 0 has unspecified behavior, and must be checked externally.
    /// @param x The dividend.
    /// @param y The divisor.
    /// @return z The quotient, ceil(x / y).
    function divRoundingUp(uint256 x, uint256 y) internal pure returns (uint256 z) {
        assembly {
            z := add(div(x, y), gt(mod(x, y), 0))
        }
    }
}
