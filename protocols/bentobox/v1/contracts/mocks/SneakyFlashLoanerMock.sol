// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../interfaces/IFlashLoan.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";

contract SneakyFlashLoanerMock is IFlashBorrower, IBatchFlashBorrower {
    using BoringMath for uint256;
    using BoringERC20 for IERC20;

    function onFlashLoan(
        address sender,
        IERC20 token,
        uint256,
        uint256,
        bytes calldata
    ) external override {
        uint256 money = token.balanceOf(address(this));
        token.safeTransfer(sender, money);
    }

    function onBatchFlashLoan(
        address sender,
        IERC20[] calldata tokens,
        uint256[] calldata,
        uint256[] calldata,
        bytes calldata
    ) external override {
        IERC20 token = tokens[0];
        uint256 money = token.balanceOf(address(this));
        token.safeTransfer(sender, money);
    }
}
