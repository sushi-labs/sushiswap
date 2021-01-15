// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./uniswapv2/libraries/TransferHelper.sol";
import "./uniswapv2/libraries/UniswapV2Library.sol";
import "./uniswapv2/libraries/SafeMath.sol";
import "./uniswapv2/interfaces/IUniswapV2ERC20.sol";
import "./uniswapv2/interfaces/IUniswapV2Router02.sol";
import "./uniswapv2/interfaces/IUniswapV2Factory.sol";
import "./uniswapv2/interfaces/IUniswapV2Pair.sol";
import "./uniswapv2/interfaces/IWETH.sol";
import "./SushiYieldToken.sol";

interface IYieldTokenFactory {
    function getYieldToken(uint256 pid) external view returns (address yieldToken);
}

contract SousChef {
    using TransferHelper for address;
    using SafeMathUniswap for uint;

    event Deposited(address yieldToken, uint256 amount, address to);
    event Withdrawn(address yieldToken, uint256 amount, address to);

    address public yieldTokenFactory;
    address public swapFactory;
    address public weth;

    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'expired');
        _;
    }

    constructor(address _yieldTokenFactory, address _swapFactory, address _weth) public {
        yieldTokenFactory = _yieldTokenFactory;
        swapFactory = _swapFactory;
        weth = _weth;
    }

    /**
     * @notice swap half of one token, add liquidity and then deposit the LP Token into `MasterChef`
     *
     * @param pid pid of `MasterChef`
     * @param token the address of token to be sent
     * @param amountIn the amount of total `token` to be sent
     * @param path an array of tokens to be used when swapping
     * @param amountLPTokenMin minimum amount of LP token to be deposited
     * @param to the receiver of `SushiYieldToken`
     *
     * @return amount the amount of LP Token deposited
     */
    function depositWithOneToken(
        uint256 pid,
        address token,
        uint256 amountIn,
        address[] calldata path,
        uint256 amountLPTokenMin,
        address to,
        uint256 deadline
    ) external payable ensure(deadline) returns (uint256 amount) {
        address yieldToken = _getYieldToken(pid);
        require(token == path[0], "invalid-path");
        require(amountIn > 0, "invalid-amount");
        require(to != address(0), "invalid-to");

        uint[] memory amounts;
        if (token == address(0)) {
            amounts = _swapExactETHForTokens(msg.value / 2, path, address(this));
        } else {
            amounts = _swapExactTokensForTokens(amountIn / 2, path, address(this));
        }

        amount = _addLiquidity(
            token,
            path[path.length - 1],
            amounts[0],
            amounts[amounts.length - 1],
            amountLPTokenMin
        );

        _deposit(yieldToken, amount, to);
    }

    function _swapExactETHForTokens(
        uint256 amountIn,
        address[] calldata path,
        address to
    ) internal returns (uint256[] memory amounts) {
        require(path[0] == weth, "invalid-path");
        amounts = UniswapV2Library.getAmountsOut(swapFactory, amountIn, path);
        IWETH(weth).deposit{value : amounts[0]}();
        assert(IWETH(weth).transfer(UniswapV2Library.pairFor(swapFactory, path[0], path[1]), amounts[0]));
        _swap(amounts, path, to);
    }

    function _swapExactTokensForTokens(
        uint256 amountIn,
        address[] calldata path,
        address to
    ) internal returns (uint256[] memory amounts) {
        amounts = UniswapV2Library.getAmountsOut(swapFactory, amountIn, path);
        TransferHelper.safeTransferFrom(
            path[0], msg.sender, UniswapV2Library.pairFor(swapFactory, path[0], path[1]), amounts[0]
        );
        _swap(amounts, path, to);
    }

    function _swap(uint256[] memory amounts, address[] memory path, address _to) internal {
        for (uint256 i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0,) = UniswapV2Library.sortTokens(input, output);
            uint256 amountOut = amounts[i + 1];
            (uint256 amount0Out, uint256 amount1Out) = input == token0 ? (uint256(0), amountOut) : (amountOut, uint256(0));
            address to = i < path.length - 2 ? UniswapV2Library.pairFor(swapFactory, output, path[i + 2]) : _to;
            IUniswapV2Pair(UniswapV2Library.pairFor(swapFactory, input, output)).swap(
                amount0Out, amount1Out, to, new bytes(0)
            );
        }
    }

    function _addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountLPTokenMin
    ) internal returns (uint256 amount) {
        (uint256 amountA, uint256 amountB) = _getAmountsToAdd(tokenA, tokenB, amountADesired, amountBDesired);
        address pair = UniswapV2Library.pairFor(swapFactory, tokenA, tokenB);
        tokenA.safeTransfer(pair, amountA);
        tokenB.safeTransfer(pair, amountB);
        amount = IUniswapV2Pair(pair).mint(address(this));
        require(amount >= amountLPTokenMin, "insufficient-lp-token-amount");
    }

    function _getAmountsToAdd(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired
    ) internal returns (uint256 amountA, uint256 amountB) {
        if (IUniswapV2Factory(swapFactory).getPair(tokenA, tokenB) == address(0)) {
            IUniswapV2Factory(swapFactory).createPair(tokenA, tokenB);
        }
        (uint256 reserveA, uint256 reserveB) = UniswapV2Library.getReserves(swapFactory, tokenA, tokenB);
        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint256 amountBOptimal = UniswapV2Library.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal = UniswapV2Library.quote(amountBDesired, reserveB, reserveA);
                assert(amountAOptimal <= amountADesired);
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }


    /**
     * @notice withdraw LP token from `MasterChef`, remove liquidity and then swap both tokens
     *
     * @param pid pid of `MasterChef`
     * @param amountLPToken the amount of LP Token to be withdrawn
     * @param path0 an array of tokens to be used when swapping token0 of LP Token
     * @param path1 an array of tokens to be used when swapping token1 of LP Token
     * @param amount0OutMin minimum amount of token0 to be withdrawn
     * @param amount1OutMin minimum amount of token1 to be withdrawn
     * @param to receiver of both tokens
     */
    function withdrawAndSwapWithPermit(
        uint256 pid,
        uint256 amountLPToken,
        address[] calldata path0,
        address[] calldata path1,
        uint256 amount0OutMin,
        uint256 amount1OutMin,
        address to,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external ensure(deadline) {
        address yieldToken = _getYieldToken(pid);
        _permit(yieldToken, amountLPToken, deadline, v, r, s);
        _withdrawAndSwap(yieldToken, amountLPToken, path0, path1, amount0OutMin, amount1OutMin, to);
    }

    /**
     * @notice withdraw LP token from `MasterChef`, remove liquidity and then swap both tokens
     *
     * @param pid pid of `MasterChef`
     * @param amount the amount of LP Token to be withdrawn
     * @param path0 an array of tokens to be used when swapping token0 of LP Token
     * @param path1 an array of tokens to be used when swapping token1 of LP Token
     * @param amount0OutMin minimum amount of token0 to be withdrawn
     * @param amount1OutMin minimum amount of token1 to be withdrawn
     */
    function withdrawAndSwap(
        uint256 pid,
        uint256 amount,
        address[] calldata path0,
        address[] calldata path1,
        uint256 amount0OutMin,
        uint256 amount1OutMin,
        address to,
        uint256 deadline
    ) external ensure(deadline) {
        address yieldToken = _getYieldToken(pid);
        _withdrawAndSwap(yieldToken, amount, path0, path1, amount0OutMin, amount1OutMin, to);
    }

    function _withdrawAndSwap(
        address yieldToken,
        uint256 amount,
        address[] calldata path0,
        address[] calldata path1,
        uint256 amount0OutMin,
        uint256 amount1OutMin,
        address to
    ) internal {
        _withdraw(yieldToken, amount, address(this));

        address lpToken = SushiYieldToken(yieldToken).lpToken();
        address token0 = IUniswapV2Pair(lpToken).token0();
        address token1 = IUniswapV2Pair(lpToken).token1();
        require(path0.length == 0 || path0[0] == token0, "wrong-path-0");
        require(path1.length == 0 || path1[0] == token1, "wrong-path-1");

        (uint256 amount0, uint256 amount1) = _removeLiquidity(token0, token1, amount);
        uint256 amount0Out = _transferOut(path0, token0, amount0, to);
        require(amount0Out >= amount0OutMin, "insufficient-out-amount-0");
        uint256 amount1Out = _transferOut(path1, token1, amount1, to);
        require(amount1Out >= amount1OutMin, "insufficient-out-amount-1");
    }

    function _removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 amount
    ) internal returns (uint256 amountA, uint256 amountB) {
        address pair = UniswapV2Library.pairFor(swapFactory, tokenA, tokenB);
        IUniswapV2Pair(pair).transferFrom(msg.sender, pair, amount);
        (uint256 amount0, uint256 amount1) = IUniswapV2Pair(pair).burn(address(this));
        (address token0,) = UniswapV2Library.sortTokens(tokenA, tokenB);
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
    }

    function _transferOut(address[] calldata path, address token, uint256 amount, address to) internal returns (uint256) {
        if (path.length > 1) {
            uint256[] memory amounts = _swapExactTokensForTokens(amount, path, to);
            return amounts[amounts.length - 1];
        } else {
            token.safeTransfer(to, amount);
            return amount;
        }
    }

    function depositMultipleWithPermit(
        uint256[] calldata pids,
        uint256[] calldata amounts,
        address to,
        uint256 deadline,
        uint8[] calldata v,
        bytes32[] calldata r,
        bytes32[] calldata s
    ) external ensure(deadline) {
        for (uint256 i = 0; i < pids.length; i++) {
            address yieldToken = _getYieldToken(pids[i]);
            _depositWithPermit(yieldToken, amounts[i], to, deadline, v[i], r[i], s[i]);
        }
    }

    function depositWithPermit(
        uint256 pid,
        uint256 amount,
        address to,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external ensure(deadline) {
        address yieldToken = _getYieldToken(pid);
        _depositWithPermit(yieldToken, amount, to, deadline, v, r, s);
    }

    function _depositWithPermit(
        address yieldToken,
        uint256 amount,
        address to,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        address lpToken = SushiYieldToken(yieldToken).lpToken();
        _permit(lpToken, amount, deadline, v, r, s);
        _deposit(yieldToken, amount, to);
    }

    function deposit(
        uint256 pid,
        uint256 amount,
        address to
    ) external {
        address yieldToken = _getYieldToken(pid);
        _deposit(yieldToken, amount, to);
    }

    function _deposit(
        address yieldToken,
        uint256 amount,
        address to
    ) internal {
        address lpToken = SushiYieldToken(yieldToken).lpToken();
        lpToken.safeTransferFrom(msg.sender, yieldToken, amount);
        SushiYieldToken(yieldToken).mint(to);

        emit Deposited(yieldToken, amount, to);
    }

    function withdrawMultipleWithPermit(
        uint256[] calldata pids,
        uint256[] calldata amounts,
        address to,
        uint256 deadline,
        uint8[] calldata v,
        bytes32[] calldata r,
        bytes32[] calldata s
    ) external ensure(deadline) {
        for (uint256 i = 0; i < pids.length; i++) {
            address yieldToken = _getYieldToken(pids[i]);
            _withdrawWithPermit(yieldToken, amounts[i], to, deadline, v[i], r[i], s[i]);
        }
    }

    function withdrawWithPermit(
        uint256 pid,
        uint256 amount,
        address to,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external ensure(deadline) {
        address yieldToken = _getYieldToken(pid);
        _withdrawWithPermit(yieldToken, amount, to, deadline, v, r, s);
    }

    function _withdrawWithPermit(
        address yieldToken,
        uint256 amount,
        address to,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        _permit(yieldToken, amount, deadline, v, r, s);
        _withdraw(yieldToken, amount, to);
    }

    function withdraw(
        uint256 pid,
        uint256 amount,
        address to
    ) external {
        address yieldToken = _getYieldToken(pid);
        _withdraw(yieldToken, amount, to);
    }

    function _withdraw(
        address yieldToken,
        uint256 amount,
        address to
    ) internal {
        yieldToken.safeTransferFrom(msg.sender, yieldToken, amount);
        SushiYieldToken(yieldToken).burn(to);

        emit Withdrawn(yieldToken, amount, to);
    }

    function _getYieldToken(uint256 pid) internal view returns (address) {
        address yieldToken = IYieldTokenFactory(yieldTokenFactory).getYieldToken(pid);
        require(yieldToken != address(0), "invalid-pid");
        return yieldToken;
    }

    function _permit(address token, uint256 amount, uint256 deadline, uint8 v, bytes32 r, bytes32 s) internal {
        IUniswapV2ERC20(token).permit(msg.sender, address(this), amount, deadline, v, r, s);
    }
}
