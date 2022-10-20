// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >= 0.8.0;

import "./ERC20Mock.sol";
import "../interfaces/IERC20PermitAllowed.sol";

contract ERC20PermitAllowedMock is ERC20Mock, IERC20PermitAllowed {
    constructor(uint256 supply) ERC20Mock("Mock", "MOCK", supply) {}

    function permit(
        address holder,
        address spender,
        uint256 nonce,
        uint256 expiry,
        bool allowed,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override {
        require(this.nonces(holder) == nonce, "ERC20PermitAllowedMock::permit: wrong nonce");
        permit(holder, spender, allowed ? type(uint256).max : 0, expiry, v, r, s);
    }
}