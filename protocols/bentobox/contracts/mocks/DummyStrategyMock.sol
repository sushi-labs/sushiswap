// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../interfaces/IStrategy.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol";

// solhint-disable not-rely-on-time

contract DummyStrategyMock is IStrategy {
    using BoringMath for uint256;
    using BoringERC20 for IERC20;

    IERC20 private immutable token;
    address private immutable bentoBox;

    int256 public _harvestProfit;

    modifier onlyBentoBox() {
        require(msg.sender == bentoBox, "Ownable: caller is not the owner");
        _;
    }

    constructor(address bentoBox_, IERC20 token_) public {
        bentoBox = bentoBox_;
        token = token_;
    }

    function setHarvestProfit(int256 val) public {
        _harvestProfit = val;
    }

    // Send the assets to the Strategy and call skim to invest them
    function skim(uint256) external override onlyBentoBox {
        return;
    }

    // Harvest any profits made converted to the asset and pass them to the caller
    function harvest(
        uint256 balance,
        address /*sender*/
    ) external override onlyBentoBox returns (int256 amountAdded) {
        if (_harvestProfit > 0) {
            amountAdded = int256(balance) + _harvestProfit;
        } else {
            amountAdded = int256(balance) - _harvestProfit;
        }
    }

    // Withdraw assets. The returned amount can differ from the requested amount due to rounding or if the request was more than there is.
    function withdraw(uint256 amount) external override onlyBentoBox returns (uint256 actualAmount) {
        actualAmount = token.balanceOf(address(this));
        if (amount > actualAmount) {
            actualAmount = amount;
        }
        token.safeTransfer(msg.sender, actualAmount);
    }

    // Withdraw all assets in the safest way possible. This shouldn't fail.
    function exit(uint256 balance) external override onlyBentoBox returns (int256 amountAdded) {
        uint256 moneyToBeTransferred = token.balanceOf(address(this));
        amountAdded = int256(moneyToBeTransferred) - int256(balance);
        // that is here to reach some branches in BentoBox
        if (_harvestProfit > 0) {
            amountAdded += _harvestProfit;
        } else {
            amountAdded -= _harvestProfit;
        }
        token.safeTransfer(msg.sender, moneyToBeTransferred);
    }
}
