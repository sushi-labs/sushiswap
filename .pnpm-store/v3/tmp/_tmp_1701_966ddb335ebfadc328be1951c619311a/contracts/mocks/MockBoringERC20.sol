// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../libraries/BoringERC20.sol";

contract MockBoringERC20 {
    using BoringERC20 for IERC20;

    IERC20 public token;

    constructor(IERC20 token_) public {
        token = token_;
    }

    function safeSymbol() public view returns (string memory) {
        return token.safeSymbol();
    }

    function safeName() public view returns (string memory) {
        return token.safeName();
    }

    function safeDecimals() public view returns (uint8) {
        return token.safeDecimals();
    }

    function safeTransfer(address to, uint256 amount) public {
        return token.safeTransfer(to, amount);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 amount
    ) public {
        return token.safeTransferFrom(from, to, amount);
    }
}
