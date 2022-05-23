// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../interfaces/IFlashLoan.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";

contract FlashLoanerMock is IFlashBorrower, IBatchFlashBorrower {
    using BoringMath for uint256;
    using BoringERC20 for IERC20;

    function onBatchFlashLoan(
        address sender,
        IERC20[] calldata tokens,
        uint256[] calldata amounts,
        uint256[] calldata fees,
        bytes calldata
    ) external override {
        address bentoBox = address(msg.sender);
        uint256 payback = amounts[0].add(fees[0]);
        IERC20 token = tokens[0];
        uint256 money = token.balanceOf(address(this));
        token.safeTransfer(address(bentoBox), payback);
        uint256 winnings = money.sub(payback);
        token.safeTransfer(sender, winnings);
    }

    function onFlashLoan(
        address sender,
        IERC20 token,
        uint256 amount,
        uint256 fee,
        bytes calldata
    ) external override {
        address bentoBox = address(msg.sender);
        uint256 payback = amount.add(fee);
        uint256 money = token.balanceOf(address(this));
        token.safeTransfer(address(bentoBox), payback);
        uint256 winnings = money.sub(payback);
        token.safeTransfer(sender, winnings);
    }
}
