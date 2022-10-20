// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "../../interfaces/IBentoBoxMinimal.sol";
import "../../interfaces/IMasterDeployer.sol";
import "../../interfaces/ITridentCallee.sol";
import "../../interfaces/ITridentRouter.sol";
import "../../interfaces/IPositionManager.sol";
import "../../interfaces/IConcentratedLiquidityPool.sol";
import "../../libraries/FullMath.sol";
import "../../libraries/TickMath.sol";
import "../../libraries/UnsafeMath.sol";
import "../../libraries/DyDxMath.sol";
import "../../libraries/SwapLib.sol";
import "../../libraries/Ticks.sol";

/// @notice Trident Concentrated liquidity pool implementation.
/// @dev Amounts are considered to be in Bentobox shared
contract ConcentratedLiquidityPool is IConcentratedLiquidityPoolStruct {
    using Ticks for mapping(int24 => Tick);

    event Mint(address indexed owner, uint256 amount0, uint256 amount1);
    event Burn(address indexed owner, uint256 amount0, uint256 amount1);
    event Collect(address indexed sender, uint256 amount0, uint256 amount1);
    event Swap(address indexed recipient, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

    uint24 internal constant MAX_FEE = 100000; /// @dev Maximum `swapFee` is 10%.
    /// @dev Reference: tickSpacing of 100 -> 2% between ticks.
    uint24 internal immutable tickSpacing;
    uint24 internal immutable swapFee; /// @dev 1000 corresponds to 0.1% fee. Fee is measured in pips.
    uint128 internal immutable MAX_TICK_LIQUIDITY;

    address internal immutable barFeeTo;
    IBentoBoxMinimal internal immutable bento;
    IMasterDeployer internal immutable masterDeployer;

    address internal immutable token0;
    address internal immutable token1;

    uint128 public liquidity;

    uint160 internal secondsGrowthGlobal; /// @dev Multiplied by 2^128.
    uint32 internal lastObservation;

    uint256 public feeGrowthGlobal0; /// @dev All fee growth counters are multiplied by 2^128.
    uint256 public feeGrowthGlobal1;

    uint256 public barFee;

    uint128 internal token0ProtocolFee;
    uint128 internal token1ProtocolFee;

    uint128 internal reserve0; /// @dev `bento` share balance tracker.
    uint128 internal reserve1;

    uint160 internal price; /// @dev Sqrt of price aka. √(y/x), multiplied by 2^96.
    int24 internal nearestTick; /// @dev Tick that is just below the current price.

    uint256 internal unlocked;

    mapping(int24 => Tick) public ticks;
    mapping(address => mapping(int24 => mapping(int24 => Position))) public positions;

    /// @dev Error list to optimize around pool requirements.
    error Locked();
    error ZeroAddress();
    error InvalidToken();
    error InvalidSwapFee();
    error LiquidityOverflow();
    error Token0Missing();
    error Token1Missing();
    error InvalidTick();
    error LowerEven();
    error UpperOdd();
    error MaxTickLiquidity();
    error Overflow();

    modifier lock() {
        if (unlocked == 2) revert Locked();
        unlocked = 2;
        _;
        unlocked = 1;
    }

    /// @dev Only set immutable variables here - state changes made here will not be used.
    constructor(bytes memory _deployData, IMasterDeployer _masterDeployer) {
        (address _token0, address _token1, uint24 _swapFee, uint24 _tickSpacing) = abi.decode(
            _deployData,
            (address, address, uint24, uint24)
        );

        if (_token0 == address(0)) revert ZeroAddress();
        if (_token0 == address(this)) revert InvalidToken();
        if (_token1 == address(this)) revert InvalidToken();
        if (_swapFee > MAX_FEE) revert InvalidSwapFee();

        token0 = _token0;
        token1 = _token1;
        swapFee = _swapFee;
        tickSpacing = _tickSpacing;
        bento = IBentoBoxMinimal(_masterDeployer.bento());
        barFeeTo = _masterDeployer.barFeeTo();
        barFee = _masterDeployer.barFee();
        masterDeployer = _masterDeployer;
        MAX_TICK_LIQUIDITY = Ticks.getMaxLiquidity(_tickSpacing);
        ticks[TickMath.MIN_TICK] = Tick(TickMath.MIN_TICK, TickMath.MAX_TICK, uint128(0), 0, 0, 0);
        ticks[TickMath.MAX_TICK] = Tick(TickMath.MIN_TICK, TickMath.MAX_TICK, uint128(0), 0, 0, 0);
        nearestTick = TickMath.MIN_TICK;
        unlocked = 1;
        lastObservation = uint32(block.timestamp);
    }

    /// @dev Called only once from the factory.
    /// @dev Price is not a constructor parameter to allow for predictable address calculation.
    function setPrice(uint160 _price) external {
        if (price == 0) {
            TickMath.validatePrice(_price);
            price = _price;
        }
    }

    /// @dev Mints LP tokens - should be called via the CL pool manager contract.
    function mint(MintParams memory mintParams) public lock returns (uint256 liquidityMinted) {
        _ensureTickSpacing(mintParams.lower, mintParams.upper);

        uint256 priceLower = uint256(TickMath.getSqrtRatioAtTick(mintParams.lower));
        uint256 priceUpper = uint256(TickMath.getSqrtRatioAtTick(mintParams.upper));
        uint256 currentPrice = uint256(price);

        liquidityMinted = DyDxMath.getLiquidityForAmounts(
            priceLower,
            priceUpper,
            currentPrice,
            uint256(mintParams.amount1Desired),
            uint256(mintParams.amount0Desired)
        );

        // Ensure no overflow happens when we cast from uint256 to int128.
        if (liquidityMinted > uint128(type(int128).max)) revert Overflow();

        _updateSecondsPerLiquidity(uint256(liquidity));

        unchecked {
            (uint256 amount0Fees, uint256 amount1Fees) = _updatePosition(
                msg.sender,
                mintParams.lower,
                mintParams.upper,
                int128(uint128(liquidityMinted))
            );
            if (amount0Fees > 0) {
                _transfer(token0, amount0Fees, msg.sender, false);
                reserve0 -= uint128(amount0Fees);
            }
            if (amount1Fees > 0) {
                _transfer(token1, amount1Fees, msg.sender, false);
                reserve1 -= uint128(amount1Fees);
            }

            if (priceLower <= currentPrice && currentPrice < priceUpper) liquidity += uint128(liquidityMinted);
        }

        nearestTick = Ticks.insert(
            ticks,
            feeGrowthGlobal0,
            feeGrowthGlobal1,
            secondsGrowthGlobal,
            mintParams.lowerOld,
            mintParams.lower,
            mintParams.upperOld,
            mintParams.upper,
            uint128(liquidityMinted),
            nearestTick,
            uint160(currentPrice)
        );

        (uint128 amount0Actual, uint128 amount1Actual) = DyDxMath.getAmountsForLiquidity(
            priceLower,
            priceUpper,
            currentPrice,
            liquidityMinted,
            true
        );

        IPositionManager(msg.sender).mintCallback(token0, token1, amount0Actual, amount1Actual, mintParams.native);

        if (amount0Actual != 0) {
            reserve0 += amount0Actual;
            if (reserve0 > _balance(token0)) revert Token0Missing();
        }

        if (amount1Actual != 0) {
            reserve1 += amount1Actual;
            if (reserve1 > _balance(token1)) revert Token1Missing();
        }

        emit Mint(msg.sender, amount0Actual, amount1Actual);
    }

    function burn(
        int24 lower,
        int24 upper,
        uint128 amount
    )
        public
        lock
        returns (
            uint256 token0Amount,
            uint256 token1Amount,
            uint256 token0Fees,
            uint256 token1Fees
        )
    {
        uint160 priceLower = TickMath.getSqrtRatioAtTick(lower);
        uint160 priceUpper = TickMath.getSqrtRatioAtTick(upper);
        uint160 currentPrice = price;

        _updateSecondsPerLiquidity(uint256(liquidity));

        unchecked {
            if (priceLower <= currentPrice && currentPrice < priceUpper) liquidity -= amount;
        }

        (token0Amount, token1Amount) = DyDxMath.getAmountsForLiquidity(
            uint256(priceLower),
            uint256(priceUpper),
            uint256(currentPrice),
            uint256(amount),
            false
        );

        // Ensure no overflow happens when we cast from uint128 to int128.
        if (amount > uint128(type(int128).max)) revert Overflow();

        (token0Fees, token1Fees) = _updatePosition(msg.sender, lower, upper, -int128(amount));

        uint256 amount0;
        uint256 amount1;

        unchecked {
            amount0 = token0Amount + token0Fees;
            amount1 = token1Amount + token1Fees;
            reserve0 -= uint128(amount0);
            reserve1 -= uint128(amount1);
        }

        _transferBothTokens(msg.sender, amount0, amount1);

        nearestTick = Ticks.remove(ticks, lower, upper, amount, nearestTick);

        emit Burn(msg.sender, amount0, amount1);
    }

    function collect(int24 lower, int24 upper) public lock returns (uint256 amount0fees, uint256 amount1fees) {
        (amount0fees, amount1fees) = _updatePosition(msg.sender, lower, upper, 0);

        reserve0 -= uint128(amount0fees);
        reserve1 -= uint128(amount1fees);

        _transferBothTokens(msg.sender, amount0fees, amount1fees);

        emit Collect(msg.sender, amount0fees, amount1fees);
    }

    function _updateSecondsPerLiquidity(uint256 currentLiquidity) internal {
        unchecked {
            uint256 diff = block.timestamp - uint256(lastObservation);
            if (diff > 0 && currentLiquidity > 0) {
                lastObservation = uint32(block.timestamp); // Overfyarnlow in 2106. Don't do staking rewards in the year 2106.
                secondsGrowthGlobal += uint160((diff << 128) / currentLiquidity);
            }
        }
    }

    /// @dev Swaps one token for another. The router must prefund this contract and ensure there isn't too much slippage.
    function swap(bytes memory data) public lock returns (uint256 amountOut) {
        (bool zeroForOne, address recipient, bool unwrapBento) = abi.decode(data, (bool, address, bool));

        uint256 inAmount = _balance(zeroForOne ? token0 : token1) - (zeroForOne ? reserve0 : reserve1);

        SwapCache memory cache = SwapCache({
            feeAmount: 0,
            totalFeeAmount: 0,
            protocolFee: 0,
            feeGrowthGlobalA: zeroForOne ? feeGrowthGlobal1 : feeGrowthGlobal0,
            feeGrowthGlobalB: zeroForOne ? feeGrowthGlobal0 : feeGrowthGlobal1,
            currentPrice: uint256(price),
            currentLiquidity: uint256(liquidity),
            input: inAmount,
            nextTickToCross: zeroForOne ? nearestTick : ticks[nearestTick].nextTick
        });

        _updateSecondsPerLiquidity(cache.currentLiquidity);

        while (cache.input != 0) {
            uint256 nextTickPrice = uint256(TickMath.getSqrtRatioAtTick(cache.nextTickToCross));
            uint256 output = 0;
            bool cross = false;

            if (zeroForOne) {
                // Trading token 0 (x) for token 1 (y).
                // Price is decreasing.
                // Maximum input amount within current tick range: Δx = Δ(1/√𝑃) · L.
                uint256 maxDx = DyDxMath.getDx(cache.currentLiquidity, nextTickPrice, cache.currentPrice, false);

                if (cache.input <= maxDx) {
                    // We can swap within the current range.
                    uint256 liquidityPadded = cache.currentLiquidity << 96;
                    // Calculate new price after swap: √𝑃[new] =  L · √𝑃 / (L + Δx · √𝑃)
                    // This is derived from Δ(1/√𝑃) = Δx/L
                    // where Δ(1/√𝑃) is 1/√𝑃[old] - 1/√𝑃[new] and we solve for √𝑃[new].
                    // In case of an overflow we can use: √𝑃[new] = L / (L / √𝑃 + Δx).
                    // This is derived by dividing the original fraction by √𝑃 on both sides.
                    uint256 newPrice = uint256(
                        FullMath.mulDivRoundingUp(liquidityPadded, cache.currentPrice, liquidityPadded + cache.currentPrice * cache.input)
                    );

                    if (!(nextTickPrice <= newPrice && newPrice < cache.currentPrice)) {
                        // Overflow. We use a modified version of the formula.
                        newPrice = uint160(UnsafeMath.divRoundingUp(liquidityPadded, liquidityPadded / cache.currentPrice + cache.input));
                    }
                    // Based on the price difference calculate the output of th swap: Δy = Δ√P · L.
                    output = DyDxMath.getDy(cache.currentLiquidity, newPrice, cache.currentPrice, false);
                    cache.currentPrice = newPrice;
                    cache.input = 0;
                } else {
                    // Execute swap step and cross the tick.
                    output = DyDxMath.getDy(cache.currentLiquidity, nextTickPrice, cache.currentPrice, false);
                    cache.currentPrice = nextTickPrice;
                    cross = true;
                    cache.input -= maxDx;
                }
            } else {
                // Price is increasing.
                // Maximum swap amount within the current tick range: Δy = Δ√P · L.
                uint256 maxDy = DyDxMath.getDy(cache.currentLiquidity, cache.currentPrice, nextTickPrice, false);

                if (cache.input <= maxDy) {
                    // We can swap within the current range.
                    // Calculate new price after swap: ΔP = Δy/L.
                    uint256 newPrice = cache.currentPrice +
                        FullMath.mulDiv(cache.input, 0x1000000000000000000000000, cache.currentLiquidity);
                    // Calculate output of swap
                    // - Δx = Δ(1/√P) · L.
                    output = DyDxMath.getDx(cache.currentLiquidity, cache.currentPrice, newPrice, false);
                    cache.currentPrice = newPrice;
                    cache.input = 0;
                } else {
                    // Swap & cross the tick.
                    output = DyDxMath.getDx(cache.currentLiquidity, cache.currentPrice, nextTickPrice, false);
                    cache.currentPrice = nextTickPrice;
                    cross = true;
                    cache.input -= maxDy;
                }
            }

            // cache.feeGrowthGlobalA is the feeGrowthGlobal counter for the output token.
            // It increases each swap step.
            (cache.totalFeeAmount, amountOut, cache.protocolFee, cache.feeGrowthGlobalA) = SwapLib.handleFees(
                output,
                swapFee,
                barFee,
                cache.currentLiquidity,
                cache.totalFeeAmount,
                amountOut,
                cache.protocolFee,
                cache.feeGrowthGlobalA
            );
            if (cross) {
                (cache.currentLiquidity, cache.nextTickToCross) = Ticks.cross(
                    ticks,
                    cache.nextTickToCross,
                    secondsGrowthGlobal,
                    cache.currentLiquidity,
                    cache.feeGrowthGlobalA,
                    cache.feeGrowthGlobalB,
                    zeroForOne,
                    tickSpacing
                );
                if (cache.currentLiquidity == 0) {
                    // We step into a zone that has liquidity - or we reach the end of the linked list.
                    cache.currentPrice = uint256(TickMath.getSqrtRatioAtTick(cache.nextTickToCross));
                    (cache.currentLiquidity, cache.nextTickToCross) = Ticks.cross(
                        ticks,
                        cache.nextTickToCross,
                        secondsGrowthGlobal,
                        cache.currentLiquidity,
                        cache.feeGrowthGlobalA,
                        cache.feeGrowthGlobalB,
                        zeroForOne,
                        tickSpacing
                    );
                }
            }
        }

        price = uint160(cache.currentPrice);

        int24 newNearestTick = zeroForOne ? cache.nextTickToCross : ticks[cache.nextTickToCross].previousTick;

        if (nearestTick != newNearestTick) {
            nearestTick = newNearestTick;
            liquidity = uint128(cache.currentLiquidity);
        }

        _updateReserves(zeroForOne, uint128(inAmount), amountOut);

        _updateFees(zeroForOne, cache.feeGrowthGlobalA, uint128(cache.protocolFee));

        if (zeroForOne) {
            _transfer(token1, amountOut, recipient, unwrapBento);
            emit Swap(recipient, token0, token1, inAmount, amountOut);
        } else {
            _transfer(token0, amountOut, recipient, unwrapBento);
            emit Swap(recipient, token1, token0, inAmount, amountOut);
        }
    }

    function getAmountIn(bytes calldata data) public view returns (uint256 finalAmountIn) {
        // TODO: make override
        (address tokenOut, uint256 amountOut) = abi.decode(data, (address, uint256));
        uint256 amountOutWithoutFee = (amountOut * 1e6) / (1e6 - swapFee) + 1;
        uint256 currentPrice = uint256(price);
        uint256 currentLiquidity = uint256(liquidity);
        int24 nextTickToCross = tokenOut == token1 ? nearestTick : ticks[nearestTick].nextTick;
        int24 nextTick;

        finalAmountIn = 0;
        while (amountOutWithoutFee != 0) {
            uint256 nextTickPrice = uint256(TickMath.getSqrtRatioAtTick(nextTickToCross));
            if (tokenOut == token1) {
                uint256 maxDy = DyDxMath.getDy(currentLiquidity, nextTickPrice, currentPrice, false);
                if (amountOutWithoutFee <= maxDy) {
                    unchecked {
                        amountOut = (amountOut * 1e6) / (1e6 - swapFee) + 1;
                    }
                    uint256 newPrice = currentPrice - FullMath.mulDiv(amountOut, 0x1000000000000000000000000, currentLiquidity);
                    finalAmountIn += (DyDxMath.getDx(currentLiquidity, newPrice, currentPrice, false) + 1);
                    // finalAmountIn += amountOut/currentPrice/newPrice  TODO: equal?
                    break;
                } else {
                    finalAmountIn += DyDxMath.getDx(currentLiquidity, nextTickPrice, currentPrice, false);
                    unchecked {
                        if ((nextTickToCross / int24(tickSpacing)) % 2 == 0) {
                            currentLiquidity -= ticks[nextTickToCross].liquidity;
                        } else {
                            currentLiquidity += ticks[nextTickToCross].liquidity;
                        }
                        amountOutWithoutFee -= maxDy;
                        amountOutWithoutFee += 1; // to compensate rounding issues
                        uint256 feeAmount = FullMath.mulDivRoundingUp(maxDy, swapFee, 1e6);
                        if (amountOut <= (maxDy - feeAmount)) break;
                        amountOut -= (maxDy - feeAmount);
                    }
                    nextTick = ticks[nextTickToCross].previousTick;
                }
            } else {
                uint256 maxDx = DyDxMath.getDx(currentLiquidity, currentPrice, nextTickPrice, false);

                if (amountOutWithoutFee <= maxDx) {
                    unchecked {
                        amountOut = (amountOut * 1e6) / (1e6 - swapFee) + 1;
                    }
                    uint256 liquidityPadded = currentLiquidity << 96;
                    uint256 newPrice = uint256(
                        FullMath.mulDivRoundingUp(liquidityPadded, currentPrice, liquidityPadded - currentPrice * amountOut)
                    );
                    if (!(currentPrice < newPrice && newPrice <= nextTickPrice)) {
                        // Overflow. We use a modified version of the formula.
                        newPrice = uint160(UnsafeMath.divRoundingUp(liquidityPadded, liquidityPadded / currentPrice - amountOut));
                    }
                    finalAmountIn += (DyDxMath.getDy(currentLiquidity, currentPrice, newPrice, false) + 1);
                    break;
                } else {
                    // Swap & cross the tick.
                    finalAmountIn += DyDxMath.getDy(currentLiquidity, currentPrice, nextTickPrice, false);
                    unchecked {
                        if ((nextTickToCross / int24(tickSpacing)) % 2 == 0) {
                            currentLiquidity += ticks[nextTickToCross].liquidity;
                        } else {
                            currentLiquidity -= ticks[nextTickToCross].liquidity;
                        }
                        amountOutWithoutFee -= maxDx;
                        amountOutWithoutFee += 1; // to compensate rounding issues
                        uint256 feeAmount = FullMath.mulDivRoundingUp(maxDx, swapFee, 1e6);
                        if (amountOut <= (maxDx - feeAmount)) break;
                        amountOut -= (maxDx - feeAmount);
                    }
                    nextTick = ticks[nextTickToCross].nextTick;
                }
            }
            currentPrice = nextTickPrice;
            require(nextTickToCross != nextTick, "CL:Insufficient output liquidity");
            nextTickToCross = nextTick;
        }
    }

    /// @dev Updates `barFee` for Trident protocol.
    function updateBarFee() public {
        barFee = IMasterDeployer(masterDeployer).barFee();
    }

    /// @dev Collects fees for Trident protocol.
    function collectProtocolFee() public lock returns (uint128 amount0, uint128 amount1) {
        if (token0ProtocolFee > 1) {
            amount0 = token0ProtocolFee - 1;
            token0ProtocolFee = 1;
            reserve0 -= amount0;
            _transfer(token0, amount0, barFeeTo, false);
        }
        if (token1ProtocolFee > 1) {
            amount1 = token1ProtocolFee - 1;
            token1ProtocolFee = 1;
            reserve1 -= amount1;
            _transfer(token1, amount1, barFeeTo, false);
        }
    }

    function _ensureTickSpacing(int24 lower, int24 upper) internal view {
        if (lower % int24(tickSpacing) != 0) revert InvalidTick();
        if ((lower / int24(tickSpacing)) % 2 != 0) revert LowerEven();
        if (upper % int24(tickSpacing) != 0) revert InvalidTick();
        if ((upper / int24(tickSpacing)) % 2 == 0) revert UpperOdd();
    }

    function _updateReserves(
        bool zeroForOne,
        uint128 inAmount,
        uint256 amountOut
    ) internal {
        if (zeroForOne) {
            uint256 balance0 = _balance(token0);
            uint128 newBalance = reserve0 + inAmount;
            if (uint256(newBalance) > balance0) revert Token0Missing();
            reserve0 = newBalance;
            unchecked {
                reserve1 -= uint128(amountOut);
            }
        } else {
            uint256 balance1 = _balance(token1);
            uint128 newBalance = reserve1 + inAmount;
            if (uint256(newBalance) > balance1) revert Token1Missing();
            reserve1 = newBalance;
            unchecked {
                reserve0 -= uint128(amountOut);
            }
        }
    }

    function _updateFees(
        bool zeroForOne,
        uint256 feeGrowthGlobal,
        uint128 protocolFee
    ) internal {
        if (zeroForOne) {
            feeGrowthGlobal1 = feeGrowthGlobal;
            token1ProtocolFee += protocolFee;
        } else {
            feeGrowthGlobal0 = feeGrowthGlobal;
            token0ProtocolFee += protocolFee;
        }
    }

    function _updatePosition(
        address owner,
        int24 lower,
        int24 upper,
        int128 amount
    ) internal returns (uint256 amount0Fees, uint256 amount1Fees) {
        Position storage position = positions[owner][lower][upper];

        (uint256 rangeFeeGrowth0, uint256 rangeFeeGrowth1) = rangeFeeGrowth(lower, upper);

        amount0Fees = FullMath.mulDiv(
            rangeFeeGrowth0 - position.feeGrowthInside0Last,
            position.liquidity,
            0x100000000000000000000000000000000
        );

        amount1Fees = FullMath.mulDiv(
            rangeFeeGrowth1 - position.feeGrowthInside1Last,
            position.liquidity,
            0x100000000000000000000000000000000
        );

        if (amount < 0) {
            position.liquidity -= uint128(-amount);
        }

        if (amount > 0) {
            position.liquidity += uint128(amount);
            // Prevents a global liquidity overflow in even if all ticks are initialised.
            if (position.liquidity > MAX_TICK_LIQUIDITY) revert LiquidityOverflow();
        }

        position.feeGrowthInside0Last = rangeFeeGrowth0;
        position.feeGrowthInside1Last = rangeFeeGrowth1;
    }

    function _balance(address token) internal view returns (uint256 balance) {
        balance = bento.balanceOf(token, address(this));
    }

    function _transfer(
        address token,
        uint256 shares,
        address to,
        bool unwrapBento
    ) internal {
        if (unwrapBento) {
            bento.withdraw(token, address(this), to, 0, shares);
        } else {
            bento.transfer(token, address(this), to, shares);
        }
    }

    function _transferBothTokens(
        address to,
        uint256 shares0,
        uint256 shares1
    ) internal {
        bento.transfer(token0, address(this), to, shares0);
        bento.transfer(token1, address(this), to, shares1);
    }

    /// @dev Generic formula for fee growth inside a range: (globalGrowth - growthBelow - growthAbove)
    /// - available counters: global, outside u, outside v.

    ///                  u         ▼         v
    /// ----|----|-------|xxxxxxxxxxxxxxxxxxx|--------|--------- (global - feeGrowthOutside(u) - feeGrowthOutside(v))

    ///             ▼    u                   v
    /// ----|----|-------|xxxxxxxxxxxxxxxxxxx|--------|--------- (global - (global - feeGrowthOutside(u)) - feeGrowthOutside(v))

    ///                  u                   v    ▼
    /// ----|----|-------|xxxxxxxxxxxxxxxxxxx|--------|--------- (global - feeGrowthOutside(u) - (global - feeGrowthOutside(v)))

    /// @notice Calculates the fee growth inside a range (per unit of liquidity).
    /// @dev Multiply `rangeFeeGrowth` delta by the provided liquidity to get accrued fees for some period.
    function rangeFeeGrowth(int24 lowerTick, int24 upperTick) public view returns (uint256 feeGrowthInside0, uint256 feeGrowthInside1) {
        int24 currentTick = nearestTick;

        Tick storage lower = ticks[lowerTick];
        Tick storage upper = ticks[upperTick];

        // Calculate fee growth below & above.
        uint256 _feeGrowthGlobal0 = feeGrowthGlobal0;
        uint256 _feeGrowthGlobal1 = feeGrowthGlobal1;
        uint256 feeGrowthBelow0;
        uint256 feeGrowthBelow1;
        uint256 feeGrowthAbove0;
        uint256 feeGrowthAbove1;

        if (lowerTick <= currentTick) {
            feeGrowthBelow0 = lower.feeGrowthOutside0;
            feeGrowthBelow1 = lower.feeGrowthOutside1;
        } else {
            feeGrowthBelow0 = _feeGrowthGlobal0 - lower.feeGrowthOutside0;
            feeGrowthBelow1 = _feeGrowthGlobal1 - lower.feeGrowthOutside1;
        }

        if (currentTick < upperTick) {
            feeGrowthAbove0 = upper.feeGrowthOutside0;
            feeGrowthAbove1 = upper.feeGrowthOutside1;
        } else {
            feeGrowthAbove0 = _feeGrowthGlobal0 - upper.feeGrowthOutside0;
            feeGrowthAbove1 = _feeGrowthGlobal1 - upper.feeGrowthOutside1;
        }

        feeGrowthInside0 = _feeGrowthGlobal0 - feeGrowthBelow0 - feeGrowthAbove0;
        feeGrowthInside1 = _feeGrowthGlobal1 - feeGrowthBelow1 - feeGrowthAbove1;
    }

    function getAssets() public view returns (address[] memory assets) {
        assets = new address[](2);
        assets[0] = token0;
        assets[1] = token1;
    }

    function getImmutables()
        public
        view
        returns (
            uint128 _MAX_TICK_LIQUIDITY,
            uint24 _tickSpacing,
            uint24 _swapFee,
            address _barFeeTo,
            IBentoBoxMinimal _bento,
            IMasterDeployer _masterDeployer,
            address _token0,
            address _token1
        )
    {
        _MAX_TICK_LIQUIDITY = MAX_TICK_LIQUIDITY;
        _tickSpacing = tickSpacing;
        _swapFee = swapFee; // 1000 corresponds to 0.1% fee.
        _barFeeTo = barFeeTo;
        _bento = bento;
        _masterDeployer = masterDeployer;
        _token0 = token0;
        _token1 = token1;
    }

    function getPriceAndNearestTicks() public view returns (uint160 _price, int24 _nearestTick) {
        _price = price;
        _nearestTick = nearestTick;
    }

    function getTokenProtocolFees() public view returns (uint128 _token0ProtocolFee, uint128 _token1ProtocolFee) {
        _token0ProtocolFee = token0ProtocolFee;
        _token1ProtocolFee = token1ProtocolFee;
    }

    function getReserves() public view returns (uint128 _reserve0, uint128 _reserve1) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
    }

    function getSecondsGrowthAndLastObservation() public view returns (uint160 _secondsGrowthGlobal, uint32 _lastObservation) {
        _secondsGrowthGlobal = secondsGrowthGlobal;
        _lastObservation = lastObservation;
    }
}
