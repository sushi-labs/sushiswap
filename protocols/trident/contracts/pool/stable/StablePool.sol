// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import {ERC20} from "@rari-capital/solmate/src/tokens/ERC20.sol";
import {ReentrancyGuard} from "@rari-capital/solmate/src/utils/ReentrancyGuard.sol";
import {IBentoBoxMinimal} from "../../interfaces/IBentoBoxMinimal.sol";
import {IMasterDeployerV2} from "../../interfaces/IMasterDeployerV2.sol";
import {IPool} from "../../interfaces/IPool.sol";
import {IStablePoolFactory} from "../../interfaces/IStablePoolFactory.sol";
import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {TridentMath} from "../../libraries/TridentMath.sol";
import "../../libraries/RebaseLibrary.sol";

/// @dev Custom Errors
error ZeroAddress();
error IdenticalAddress();
error InvalidSwapFee();
error InsufficientLiquidityMinted();
error InvalidAmounts();
error InvalidInputToken();
error PoolUninitialized();
error InvalidOutputToken();

/// @notice Trident exchange pool template with stable swap (solidly exchange) for swapping between tightly correlated assets

contract StablePool is IPool, ERC20, ReentrancyGuard {
    using RebaseLibrary for Rebase;
    using SafeERC20 for IERC20;

    event Mint(address indexed sender, uint256 amount0, uint256 amount1, address indexed recipient);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed recipient);
    event Sync(uint256 reserve0, uint256 reserve1);

    uint256 internal constant MINIMUM_LIQUIDITY = 1000;

    uint256 internal constant MAX_FEE = 10000; // @dev 100%.
    uint256 public immutable swapFee;
    uint256 internal immutable MAX_FEE_MINUS_SWAP_FEE;

    IBentoBoxMinimal public immutable bento;
    IMasterDeployerV2 public immutable masterDeployer;
    address public immutable token0;
    address public immutable token1;

    uint256 public barFee;
    address public barFeeTo;
    uint256 public kLast;

    uint256 internal reserve0;
    uint256 internal reserve1;

    uint256 public immutable decimals0;
    uint256 public immutable decimals1;

    bytes32 public constant poolIdentifier = "Trident:StablePool";

    constructor() ERC20("Sushi Stable LP Token", "SSLP", 18) {
        (bytes memory _deployData, IMasterDeployerV2 _masterDeployer) = IStablePoolFactory(msg.sender).getDeployData();

        (address _token0, address _token1, uint256 _swapFee) = abi.decode(_deployData, (address, address, uint256));

        // Factory ensures that the tokens are sorted.
        if (_token0 == address(0)) revert ZeroAddress();
        if (_token0 == _token1) revert IdenticalAddress();
        if (_swapFee > MAX_FEE) revert InvalidSwapFee();

        token0 = _token0;
        token1 = _token1;
        swapFee = _swapFee;

        // This is safe from underflow - `swapFee` cannot exceed `MAX_FEE` per previous check.
        unchecked {
            MAX_FEE_MINUS_SWAP_FEE = MAX_FEE - _swapFee;
        }

        decimals0 = uint256(10)**(ERC20(_token0).decimals());
        decimals1 = uint256(10)**(ERC20(_token1).decimals());

        barFee = _masterDeployer.barFee();
        barFeeTo = _masterDeployer.barFeeTo();
        bento = IBentoBoxMinimal(_masterDeployer.bento());
        masterDeployer = _masterDeployer;
    }

    /// @dev Mints LP tokens - should be called via the router after transferring `bento` tokens.
    /// The router must ensure that sufficient LP tokens are minted by using the return value.
    function mint(bytes calldata data) public override nonReentrant returns (uint256 liquidity) {
        address recipient = abi.decode(data, (address));
        (uint256 _reserve0, uint256 _reserve1) = _getReserves();
        (uint256 balance0, uint256 balance1) = _balance();

        uint256 newLiq = _computeLiquidity(balance0, balance1);

        uint256 amount0 = balance0 - _reserve0;
        uint256 amount1 = balance1 - _reserve1;

        (uint256 fee0, uint256 fee1) = _nonOptimalMintFee(amount0, amount1, _reserve0, _reserve1);

        _reserve0 += uint112(fee0);
        _reserve1 += uint112(fee1);

        (uint256 _totalSupply, uint256 oldLiq) = _mintFee(_reserve0, _reserve1);

        if (_totalSupply == 0) {
            if (amount0 == 0 || amount1 == 0) revert InvalidAmounts();
            liquidity = newLiq - MINIMUM_LIQUIDITY;
            _mint(address(0), MINIMUM_LIQUIDITY);
        } else {
            liquidity = ((newLiq - oldLiq) * _totalSupply) / oldLiq;
        }

        if (liquidity == 0) revert InsufficientLiquidityMinted();

        _mint(recipient, liquidity);

        _updateReserves();

        kLast = newLiq;
        emit Mint(msg.sender, amount0, amount1, recipient);
    }

    /// @dev Burns LP tokens sent to this contract. The router must ensure that the user gets sufficient output tokens.
    function burn(bytes calldata data) public override nonReentrant returns (IPool.TokenAmount[] memory withdrawnAmounts) {
        (address recipient, bool unwrapBento) = abi.decode(data, (address, bool));
        (uint256 balance0, uint256 balance1) = _balance();
        uint256 liquidity = balanceOf[address(this)];

        (uint256 _totalSupply, ) = _mintFee(balance0, balance1);

        uint256 amount0 = (liquidity * balance0) / _totalSupply;
        uint256 amount1 = (liquidity * balance1) / _totalSupply;

        _burn(address(this), liquidity);
        _transfer(token0, amount0, recipient, unwrapBento);
        _transfer(token1, amount1, recipient, unwrapBento);

        _updateReserves();

        withdrawnAmounts = new TokenAmount[](2);
        withdrawnAmounts[0] = TokenAmount({token: token0, amount: amount0});
        withdrawnAmounts[1] = TokenAmount({token: token1, amount: amount1});

        kLast = _computeLiquidity(balance0 - amount0, balance1 - amount1);

        emit Burn(msg.sender, amount0, amount1, recipient);
    }

    function burnSingle(bytes calldata data) public override nonReentrant returns (uint256 amountOut) {
        (address tokenOut, address recipient, bool unwrapBento) = abi.decode(data, (address, address, bool));
        (uint256 _reserve0, uint256 _reserve1) = _getReserves();
        (uint256 balance0, uint256 balance1) = _balance();
        uint256 liquidity = balanceOf[address(this)];

        (uint256 _totalSupply, ) = _mintFee(balance0, balance1);

        uint256 amount0 = (liquidity * balance0) / _totalSupply;
        uint256 amount1 = (liquidity * balance1) / _totalSupply;

        kLast = _computeLiquidity(balance0 - amount0, balance1 - amount1);
        _burn(address(this), liquidity);

        unchecked {
            if (tokenOut == token1) {
                amount1 += _getAmountOut(amount0, _reserve0 - amount0, _reserve1 - amount1, true);
                _transfer(token1, amount1, recipient, unwrapBento);
                amountOut = amount1;
                amount0 = 0;
            } else {
                if (tokenOut != token0) revert InvalidOutputToken();
                amount0 += _getAmountOut(amount1, _reserve0 - amount0, _reserve1 - amount1, false);
                _transfer(token0, amount0, recipient, unwrapBento);
                amountOut = amount0;
                amount1 = 0;
            }
        }

        _updateReserves();

        emit Burn(msg.sender, amount0, amount1, recipient);
    }

    /// @dev Swaps one token for another. The router must prefund this contract and ensure there isn't too much slippage.
    function swap(bytes calldata data) public override nonReentrant returns (uint256 amountOut) {
        (address tokenIn, address recipient, bool unwrapBento) = abi.decode(data, (address, address, bool));
        (uint256 _reserve0, uint256 _reserve1, uint256 balance0, uint256 balance1) = _getReservesAndBalances();
        uint256 amountIn;
        address tokenOut;

        if (tokenIn == token0) {
            tokenOut = token1;
            unchecked {
                amountIn = balance0 - _reserve0;
            }
            amountOut = _getAmountOut(amountIn, _reserve0, _reserve1, true);
        } else {
            if (tokenIn != token1) revert InvalidInputToken();
            tokenOut = token0;
            unchecked {
                amountIn = balance1 - _reserve1;
            }
            amountOut = _getAmountOut(amountIn, _reserve0, _reserve1, false);
        }
        _transfer(tokenOut, amountOut, recipient, unwrapBento);
        _updateReserves();
        emit Swap(recipient, tokenIn, tokenOut, amountIn, amountOut);
    }

    /// @dev Updates `barFee` and `barFeeTo` for Trident protocol.
    function updateBarParameters() public {
        barFee = masterDeployer.barFee();
        barFeeTo = masterDeployer.barFeeTo();
    }

    function _balance() internal view returns (uint256 balance0, uint256 balance1) {
        balance0 = bento.toAmount(token0, bento.balanceOf(token0, address(this)), false);
        balance1 = bento.toAmount(token1, bento.balanceOf(token1, address(this)), false);
    }

    function _getReservesAndBalances()
        internal
        view
        returns (
            uint256 _reserve0,
            uint256 _reserve1,
            uint256 balance0,
            uint256 balance1
        )
    {
        (_reserve0, _reserve1) = (reserve0, reserve1);
        balance0 = bento.balanceOf(token0, address(this));
        balance1 = bento.balanceOf(token1, address(this));
        Rebase memory total0 = bento.totals(token0);
        Rebase memory total1 = bento.totals(token1);

        balance0 = total0.toElastic(balance0);
        balance1 = total1.toElastic(balance1);
    }

    function _updateReserves() internal {
        (uint256 _reserve0, uint256 _reserve1) = _balance();
        reserve0 = _reserve0;
        reserve1 = _reserve1;
        emit Sync(_reserve0, _reserve1);
    }

    function _computeLiquidity(uint256 _reserve0, uint256 _reserve1) internal view returns (uint256 liquidity) {
        unchecked {
            uint256 adjustedReserve0 = (_reserve0 * 1e12) / decimals0;
            uint256 adjustedReserve1 = (_reserve1 * 1e12) / decimals1;
            liquidity = _computeLiquidityFromAdjustedBalances(adjustedReserve0, adjustedReserve1);
        }
    }

    function _computeLiquidityFromAdjustedBalances(uint256 x, uint256 y) internal pure returns (uint256 computed) {
        return TridentMath.sqrt(TridentMath.sqrt(_k(x, y)));
    }

    function _mintFee(uint256 _reserve0, uint256 _reserve1) internal returns (uint256 _totalSupply, uint256 computed) {
        _totalSupply = totalSupply;
        uint256 _kLast = kLast;
        if (_kLast != 0) {
            computed = _computeLiquidity(_reserve0, _reserve1);
            if (computed > _kLast) {
                // `barFee` % of increase in liquidity.
                uint256 _barFee = barFee;
                uint256 numerator = _totalSupply * (computed - _kLast) * _barFee;
                uint256 denominator = (MAX_FEE - _barFee) * computed + _barFee * _kLast;
                uint256 liquidity = numerator / denominator;

                if (liquidity != 0) {
                    _mint(barFeeTo, liquidity);
                    _totalSupply += liquidity;
                }
            }
        }
    }

    /// @dev This fee is charged to cover for `swapFee` when users add unbalanced liquidity.
    function _nonOptimalMintFee(
        uint256 _amount0,
        uint256 _amount1,
        uint256 _reserve0,
        uint256 _reserve1
    ) internal view returns (uint256 token0Fee, uint256 token1Fee) {
        if (_reserve0 == 0 || _reserve1 == 0) return (0, 0);
        uint256 amount1Optimal = (_amount0 * _reserve1) / _reserve0;

        if (amount1Optimal <= _amount1) {
            token1Fee = (swapFee * (_amount1 - amount1Optimal)) / (2 * MAX_FEE);
        } else {
            uint256 amount0Optimal = (_amount1 * _reserve0) / _reserve1;
            token0Fee = (swapFee * (_amount0 - amount0Optimal)) / (2 * MAX_FEE);
        }
    }

    function _k(uint256 x, uint256 y) internal pure returns (uint256) {
        uint256 _a = (x * y) / 1e12;
        uint256 _b = ((x * x) / 1e12 + (y * y) / 1e12);
        return ((_a * _b) / 1e12); // x3y+y3x >= k
    }

    function _f(uint256 x0, uint256 y) internal pure returns (uint256) {
        return (x0 * ((((y * y) / 1e12) * y) / 1e12)) / 1e12 + (((((x0 * x0) / 1e12) * x0) / 1e12) * y) / 1e12;
    }

    function _d(uint256 x0, uint256 y) internal pure returns (uint256) {
        return (3 * x0 * ((y * y) / 1e12)) / 1e12 + ((((x0 * x0) / 1e12) * x0) / 1e12);
    }

    function _get_y(
        uint256 x0,
        uint256 xy,
        uint256 y
    ) internal pure returns (uint256) {
        for (uint256 i = 0; i < 255; i++) {
            uint256 y_prev = y;
            uint256 k = _f(x0, y);
            if (k < xy) {
                uint256 dy = ((xy - k) * 1e12) / _d(x0, y);
                y = y + dy;
            } else {
                uint256 dy = ((k - xy) * 1e12) / _d(x0, y);
                y = y - dy;
            }
            if (y > y_prev) {
                if (y - y_prev <= 1) {
                    return y;
                }
            } else {
                if (y_prev - y <= 1) {
                    return y;
                }
            }
        }
        return y;
    }

    function _getAmountOut(
        uint256 amountIn,
        uint256 _reserve0,
        uint256 _reserve1,
        bool token0In
    ) internal view returns (uint256 dy) {
        unchecked {
            uint256 adjustedReserve0 = (_reserve0 * 1e12) / decimals0;
            uint256 adjustedReserve1 = (_reserve1 * 1e12) / decimals1;
            uint256 feeDeductedAmountIn = amountIn - (amountIn * swapFee) / MAX_FEE;
            uint256 xy = _k(adjustedReserve0, adjustedReserve1);
            if (token0In) {
                uint256 x0 = adjustedReserve0 + ((feeDeductedAmountIn * 1e12) / decimals0);
                uint256 y = _get_y(x0, xy, adjustedReserve1);
                dy = adjustedReserve1 - y;
                dy = (dy * decimals1) / 1e12;
            } else {
                uint256 x0 = adjustedReserve1 + ((feeDeductedAmountIn * 1e12) / decimals1);
                uint256 y = _get_y(x0, xy, adjustedReserve0);
                dy = adjustedReserve0 - y;
                dy = (dy * decimals0) / 1e12;
            }
        }
    }

    function getAmountOut(bytes calldata data) public view override returns (uint256 finalAmountOut) {
        (address tokenIn, uint256 amountIn) = abi.decode(data, (address, uint256));
        (uint256 _reserve0, uint256 _reserve1) = _getReserves();
        amountIn = bento.toAmount(tokenIn, amountIn, false);

        if (tokenIn == token0) {
            finalAmountOut = bento.toShare(token1, _getAmountOut(amountIn, _reserve0, _reserve1, true), false);
        } else {
            if (tokenIn != token1) revert InvalidInputToken();
            finalAmountOut = bento.toShare(token0, _getAmountOut(amountIn, _reserve0, _reserve1, false), false);
        }
    }

    function _transfer(
        address token,
        uint256 amount,
        address to,
        bool unwrapBento
    ) internal {
        if (unwrapBento) {
            bento.withdraw(token, address(this), to, amount, 0);
        } else {
            uint256 shares = bento.toShare(token, amount, false);
            bento.transfer(token, address(this), to, shares);
        }
    }

    function getAssets() public view returns (address[] memory assets) {
        assets = new address[](2);
        assets[0] = token0;
        assets[1] = token1;
    }

    function skim() public nonReentrant {
        address _token0 = token0;
        address _token1 = token1;
        address receiver = masterDeployer.owner();
        IERC20(_token0).safeTransfer(receiver, IERC20(_token0).balanceOf(address(this)));
        IERC20(_token1).safeTransfer(receiver, IERC20(_token1).balanceOf(address(this)));
    }

    function _getReserves() internal view returns (uint256 _reserve0, uint256 _reserve1) {
        (_reserve0, _reserve1) = (reserve0, reserve1);
    }

    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1) {
        return _getReserves();
    }

    function getNativeReserves() public view returns (uint256 _nativeReserve0, uint256 _nativeReserve1) {
        return _getReserves();
    }

    function flashSwap(bytes calldata) external pure override returns (uint256) {
        revert();
    }

    function getAmountIn(bytes calldata) external pure override returns (uint256) {
        revert();
    }
}
