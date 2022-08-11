// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
import "../interfaces/IStrategy.sol";
import "@boringcrypto/boring-solidity/contracts/BoringOwnable.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol";

// solhint-disable not-rely-on-time

interface ISushiBar is IERC20 {
    function enter(uint256 _amount) external;

    function leave(uint256 _share) external;
}

contract MoneySink is IStrategy, BoringOwnable {
    using BoringMath for uint256;
    using BoringERC20 for IERC20;

    IERC20 public immutable sushi;
    address public immutable bentoBox;

    constructor(address _bentoBox, IERC20 _sushi) public {
        sushi = _sushi;
        bentoBox = _bentoBox;
    }

    function lose(uint256 amount) public {
        sushi.safeTransfer(0xdEad000000000000000000000000000000000000, amount);
    }

    // Send the assets to the Strategy and call skim to invest them
    function skim(uint256) external override {
        return;
    }

    // Harvest any profits made converted to the asset and pass them to the caller
    function harvest(uint256 balance, address) external override onlyOwner returns (int256 amountAdded) {
        uint256 realBalance = sushi.balanceOf(address(this));
        if (realBalance < balance) {
            amountAdded = -int256(balance.sub(realBalance));
        } else {
            amountAdded = int256(realBalance.sub(balance));
            sushi.safeTransfer(bentoBox, uint256(amountAdded));
        }
    }

    // Withdraw assets. The returned amount can differ from the requested amount due to rounding or if the request was more than there is.
    function withdraw(uint256 amount) external override onlyOwner returns (uint256 actualAmount) {
        sushi.safeTransfer(owner, amount);
        actualAmount = amount;
    }

    // Withdraw all assets in the safest way possible. This shouldn't fail.
    function exit(uint256 balance) external override onlyOwner returns (int256 amountAdded) {
        uint256 realBalance = sushi.balanceOf(address(this));
        if (realBalance < balance) {
            amountAdded = -int256(balance.sub(realBalance));
        } else {
            amountAdded = int256(realBalance.sub(balance));
        }
        sushi.safeTransfer(bentoBox, realBalance);
    }
}
