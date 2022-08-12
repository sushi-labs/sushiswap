// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "@sushiswap/bentobox-sdk/contracts/IStrategy.sol";
import "@sushiswap/bentobox-sdk/contracts/IFlashBorrower.sol";
import "@sushiswap/bentobox-sdk/contracts/IBentoBoxV1.sol";
import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Factory.sol";
import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Pair.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol";
import "../KashiPair.sol";
import "../KashiPairHelper.sol";
import "../interfaces/ISwapper.sol";

// solhint-disable not-rely-on-time

contract FlashloanStrategyMock is IStrategy, IFlashBorrower, KashiPairHelper {
    using BoringMath for uint256;
    using BoringERC20 for IERC20;

    IERC20 private immutable assetToken;
    IERC20 private immutable collateralToken;
    KashiPair private immutable kashiPair;
    IBentoBoxV1 private immutable bentoBox;
    ISwapper private immutable swapper;
    address private immutable target;
    IUniswapV2Factory public factory;

    modifier onlyBentoBox() {
        require(msg.sender == address(bentoBox), "only bentoBox");
        _;
    }

    constructor(
        IBentoBoxV1 bentoBox_,
        KashiPair _kashiPair,
        IERC20 asset,
        IERC20 collateral,
        ISwapper _swapper,
        IUniswapV2Factory _factory
    ) public {
        bentoBox = bentoBox_;
        kashiPair = _kashiPair;
        assetToken = asset;
        collateralToken = collateral;
        swapper = _swapper;
        factory = _factory;
        target = msg.sender;
    }

    // Send the assets to the Strategy and call skim to invest them
    function skim(uint256) external override onlyBentoBox {
        // Leave the tokens on the contract
        return;
    }

    // Harvest any profits made converted to the asset and pass them to the caller
    function harvest(uint256 balance, address) external override onlyBentoBox returns (int256 amountAdded) {
        // flashloan everything we can
        uint256 flashAmount = assetToken.balanceOf(address(bentoBox));
        bentoBox.flashLoan(IFlashBorrower(this), address(this), assetToken, flashAmount, new bytes(0));

        // Profit is any leftover after the flashloan and liquidation succeeded
        amountAdded = int256(assetToken.balanceOf(address(this)).sub(balance));
        assetToken.safeTransfer(address(bentoBox), uint256(amountAdded));
    }

    // Withdraw assets. The returned amount can differ from the requested amount due to rounding or if the request was more than there is.
    function withdraw(uint256 amount) external override onlyBentoBox returns (uint256 actualAmount) {
        assetToken.safeTransfer(address(bentoBox), uint256(amount));
        actualAmount = amount;
    }

    // Withdraw all assets in the safest way possible. This shouldn't fail.
    function exit(uint256 balance) external override onlyBentoBox returns (int256 amountAdded) {
        amountAdded = 0;
        assetToken.safeTransfer(address(bentoBox), balance);
    }

    // Given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256 amountOut) {
        uint256 amountInWithFee = amountIn.mul(997);
        uint256 numerator = amountInWithFee.mul(reserveOut);
        uint256 denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    // liquidate
    function onFlashLoan(
        address, /*sender*/
        IERC20 token,
        uint256 amount,
        uint256 fee,
        bytes calldata /*data*/
    ) external override onlyBentoBox {
        require(token == assetToken);

        // approve kashiPair
        bentoBox.setMasterContractApproval(address(this), address(kashiPair.masterContract()), true, 0, 0, 0);
        // approve & deposit asset into bentoBox
        assetToken.approve(address(bentoBox), amount);
        bentoBox.deposit(assetToken, address(this), address(this), amount, 0);

        // update exchange rate first
        kashiPair.updateExchangeRate();
        // calculate how much we can liquidate
        uint256 PREC = 1e5;
        uint256 targetBorrowPart = kashiPair.userBorrowPart(target);
        // round up
        uint256 divisor =
            (KashiPairHelper.getCollateralSharesForBorrowPart(kashiPair, targetBorrowPart) * PREC) / (kashiPair.userCollateralShare(target)) + 1;
        // setup
        address[] memory users = new address[](1);
        uint256[] memory amounts = new uint256[](1);
        users[0] = target;
        amounts[0] = (targetBorrowPart * PREC) / divisor;

        // get rid of some assets and receive collateral
        kashiPair.liquidate(users, amounts, address(this), ISwapper(address(0)), true);

        // swap the collateral to asset
        IUniswapV2Pair pair = IUniswapV2Pair(factory.getPair(address(collateralToken), address(assetToken)));
        // withdraw collateral to uniswap
        (uint256 amountFrom, ) =
            bentoBox.withdraw(collateralToken, address(this), address(pair), 0, bentoBox.balanceOf(collateralToken, address(this)));
        // withdraw remaining assets
        bentoBox.withdraw(assetToken, address(this), address(this), 0, bentoBox.balanceOf(assetToken, address(this)));

        {
            // swap
            (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
            if (pair.token0() == address(collateralToken)) {
                uint256 amountTo = getAmountOut(amountFrom, reserve0, reserve1);
                pair.swap(0, amountTo, address(this), new bytes(0));
            } else {
                uint256 amountTo = getAmountOut(amountFrom, reserve1, reserve0);
                pair.swap(amountTo, 0, address(this), new bytes(0));
            }
        }

        // transfer flashloan + fee back to bentoBox
        assetToken.safeTransfer(msg.sender, amount.add(fee));
    }
}
