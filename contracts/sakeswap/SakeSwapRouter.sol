// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.6.12;

import "./interfaces/ISakeSwapFactory.sol";
import "./libraries/TransferHelper.sol";
import "./interfaces/ISakeSwapRouter.sol";
import "./libraries/SakeSwapLibrary.sol";
import "./libraries/SafeMath.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IWETH.sol";

contract SakeSwapRouter is ISakeSwapRouter {
    using SafeMath for uint256;

    address public immutable override factory;
    address public immutable override WETH;

    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "SakeSwapRouter: EXPIRED");
        _;
    }

    constructor(address _factory, address _WETH) public {
        factory = _factory;
        WETH = _WETH;
    }

    receive() external payable {
        assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
    }

    // **** ADD LIQUIDITY ****
    function _addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) internal virtual returns (uint256 amountA, uint256 amountB) {
        // create the pair if it doesn"t exist yet
        if (ISakeSwapFactory(factory).getPair(tokenA, tokenB) == address(0)) {
            ISakeSwapFactory(factory).createPair(tokenA, tokenB);
        }
        (uint256 reserveA, uint256 reserveB) = SakeSwapLibrary.getReserves(factory, tokenA, tokenB);
        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint256 amountBOptimal = SakeSwapLibrary.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "SakeSwapRouter: INSUFFICIENT_B_AMOUNT");
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal = SakeSwapLibrary.quote(amountBDesired, reserveB, reserveA);
                assert(amountAOptimal <= amountADesired);
                require(amountAOptimal >= amountAMin, "SakeSwapRouter: INSUFFICIENT_A_AMOUNT");
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        virtual
        override
        ensure(deadline)
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        )
    {
        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);
        address pair = SakeSwapLibrary.pairFor(factory, tokenA, tokenB);
        TransferHelper.safeTransferFrom(tokenA, msg.sender, pair, amountA);
        TransferHelper.safeTransferFrom(tokenB, msg.sender, pair, amountB);
        liquidity = ISakeSwapPair(pair).mint(to);
    }

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        virtual
        override
        payable
        ensure(deadline)
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        )
    {
        (amountToken, amountETH) = _addLiquidity(
            token,
            WETH,
            amountTokenDesired,
            msg.value,
            amountTokenMin,
            amountETHMin
        );
        address pair = SakeSwapLibrary.pairFor(factory, token, WETH);
        TransferHelper.safeTransferFrom(token, msg.sender, pair, amountToken);
        IWETH(WETH).deposit{value: amountETH}();
        assert(IWETH(WETH).transfer(pair, amountETH));
        liquidity = ISakeSwapPair(pair).mint(to);
        // refund dust eth, if any
        if (msg.value > amountETH) TransferHelper.safeTransferETH(msg.sender, msg.value - amountETH);
    }

    // **** REMOVE LIQUIDITY ****
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        public
        virtual
        override
        ensure(deadline)
        returns (
            uint256 amountA,
            uint256 amountB
        )
    {
        address pair = SakeSwapLibrary.pairFor(factory, tokenA, tokenB);
        ISakeSwapPair(pair).transferFrom(msg.sender, pair, liquidity); // send liquidity to pair
        (address token0, ) = SakeSwapLibrary.sortTokens(tokenA, tokenB);
        if (tokenA == token0) {
            (amountA, amountB) = ISakeSwapPair(pair).burn(to);
        } else {
            (amountB, amountA) = ISakeSwapPair(pair).burn(to);
        }
        require(amountA >= amountAMin, "SakeSwappRouter: INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "SakeSwapRouter: INSUFFICIENT_B_AMOUNT");
    }

    function removeLiquidityETH(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        public
        virtual
        override
        ensure(deadline)
        returns (
            uint256 amountToken,
            uint256 amountETH
        )
    {
        (amountToken, amountETH) = removeLiquidity(
            token,
            WETH,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline
        );
        TransferHelper.safeTransfer(token, to, amountToken);
        IWETH(WETH).withdraw(amountETH);
        TransferHelper.safeTransferETH(to, amountETH);
    }

    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
        external
        virtual
        override
        returns (
            uint256 amountA,
            uint256 amountB
        )
    {
        ISakeSwapPair(SakeSwapLibrary.pairFor(factory, tokenA, tokenB)).permit(
            msg.sender,
            address(this),
            approveMax ? uint256(-1) : liquidity,
            deadline,
            v,
            r,
            s
        );
        (amountA, amountB) = removeLiquidity(
            tokenA,
            tokenB,
            liquidity,
            amountAMin,
            amountBMin,
            to,
            deadline
        );
    }

    function removeLiquidityETHWithPermit(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    )
        external
        virtual
        override
        returns (
            uint256 amountToken,
            uint256 amountETH
        )
    {
        address pair = SakeSwapLibrary.pairFor(factory, token, WETH);
        uint256 value = approveMax ? uint256(-1) : liquidity;
        ISakeSwapPair(pair).permit(msg.sender, address(this), value, deadline, v, r, s);
        (amountToken, amountETH) = removeLiquidityETH(
            token,
            liquidity,
            amountTokenMin,
            amountETHMin,
            to,
            deadline
        );
    }

    // **** REMOVE LIQUIDITY (supporting fee-on-transfer tokens) ****
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) public virtual override ensure(deadline) returns (uint256 amountETH) {
        (, amountETH) = removeLiquidity(
            token,
            WETH,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline
        );
        TransferHelper.safeTransfer(token, to, IERC20(token).balanceOf(address(this)));
        IWETH(WETH).withdraw(amountETH);
        TransferHelper.safeTransferETH(to, amountETH);
    }

    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external virtual override returns (uint256 amountETH) {
        address pair = SakeSwapLibrary.pairFor(factory, token, WETH);
        uint256 value = approveMax ? uint256(-1) : liquidity;
        ISakeSwapPair(pair).permit(msg.sender, address(this), value, deadline, v, r, s);
        (amountETH) = removeLiquidityETHSupportingFeeOnTransferTokens(
            token,
            liquidity,
            amountTokenMin,
            amountETHMin,
            to,
            deadline
        );
    }

    // **** SWAP ****
    // requires the initial amount to have already been sent to the first pair
    function _swap(
        uint256[] memory amounts,
        address[] memory path,
        address _to
    ) internal virtual {
        for (uint256 i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = SakeSwapLibrary.sortTokens(input, output);
            uint256 amountOut = amounts[i + 1];
            (uint256 amount0Out, uint256 amount1Out) = input == token0
                ? (uint256(0), amountOut)
                : (amountOut, uint256(0));
            address to = i < path.length - 2 ? SakeSwapLibrary.pairFor(factory, output, path[i + 2]) : _to;
            ISakeSwapPair(SakeSwapLibrary.pairFor(factory, input, output)).swap(
                amount0Out,
                amount1Out,
                to,
                new bytes(0)
            );
        }
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline,
        bool ifmint
    ) external virtual override ensure(deadline) returns (uint256[] memory amounts) {
        amounts = SakeSwapLibrary.getAmountsOut(factory, amountIn, path);
        address pair = SakeSwapLibrary.pairFor(factory, path[0], path[1]);
        TransferHelper.safeTransferFrom(path[0], msg.sender, pair, amounts[0]);
        if (path.length == 2) {
            amounts[1] = ISakeSwapPair(pair).dealSlippageWithIn(path, amounts[0], to, ifmint);
        }
        require(amounts[amounts.length - 1] >= amountOutMin, "SakeSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        _swap(amounts, path, to);
    }

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline,
        bool ifmint
    ) external virtual override ensure(deadline) returns (uint256[] memory amounts) {
        amounts = SakeSwapLibrary.getAmountsIn(factory, amountOut, path);
        address pair = SakeSwapLibrary.pairFor(factory, path[0], path[1]);
        if (path.length == 2) {
            uint256 extra = ISakeSwapPair(pair).dealSlippageWithOut(path, amountOut, to, ifmint);
            amounts[0] = amounts[0].add(extra);
        }
        require(amounts[0] <= amountInMax, "SakeSwapRouter: EXCESSIVE_INPUT_AMOUNT");
        TransferHelper.safeTransferFrom(path[0], msg.sender, pair, amounts[0]);
        _swap(amounts, path, to);
    }

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline,
        bool ifmint
    ) external virtual override payable ensure(deadline) returns (uint256[] memory amounts) {
        require(path[0] == WETH, "SakeSwapRouter: INVALID_PATH");
        amounts = SakeSwapLibrary.getAmountsOut(factory, msg.value, path);
        address pair = SakeSwapLibrary.pairFor(factory, path[0], path[1]);
        IWETH(WETH).deposit{value: amounts[0]}();
        assert(IWETH(WETH).transfer(pair, amounts[0]));
        if (path.length == 2) {
            amounts[1] = ISakeSwapPair(pair).dealSlippageWithIn(path, amounts[0], to, ifmint);
        }
        require(amounts[amounts.length - 1] >= amountOutMin, "SakeSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        _swap(amounts, path, to);
    }

    function swapTokensForExactETH(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline,
        bool ifmint
    ) external virtual override ensure(deadline) returns (uint256[] memory amounts) {
        require(path[path.length - 1] == WETH, "SakeSwapRouter: INVALID_PATH");
        amounts = SakeSwapLibrary.getAmountsIn(factory, amountOut, path);
        address pair = SakeSwapLibrary.pairFor(factory, path[0], path[1]);
        if (path.length == 2) {
            uint256 extra = ISakeSwapPair(pair).dealSlippageWithOut(path, amountOut, to, ifmint);
            amounts[0] = amounts[0].add(extra);
        }
        require(amounts[0] <= amountInMax, "SakeSwapRouter: EXCESSIVE_INPUT_AMOUNT");
        TransferHelper.safeTransferFrom(path[0], msg.sender, pair, amounts[0]);
        _swap(amounts, path, address(this));
        IWETH(WETH).withdraw(amounts[amounts.length - 1]);
        TransferHelper.safeTransferETH(to, amounts[amounts.length - 1]);
    }

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline,
        bool ifmint
    ) external virtual override ensure(deadline) returns (uint256[] memory amounts) {
        require(path[path.length - 1] == WETH, "SakeSwapRouter: INVALID_PATH");
        amounts = SakeSwapLibrary.getAmountsOut(factory, amountIn, path);
        address pair = SakeSwapLibrary.pairFor(factory, path[0], path[1]);
        TransferHelper.safeTransferFrom(path[0], msg.sender, pair, amounts[0]);
        if (path.length == 2) {
            amounts[1] = ISakeSwapPair(pair).dealSlippageWithIn(path, amounts[0], to, ifmint);
        }
        require(amounts[amounts.length - 1] >= amountOutMin, "SakeSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        _swap(amounts, path, address(this));
        IWETH(WETH).withdraw(amounts[amounts.length - 1]);
        TransferHelper.safeTransferETH(to, amounts[amounts.length - 1]);
    }

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline,
        bool ifmint
    ) external virtual override payable ensure(deadline) returns (uint256[] memory amounts) {
        require(path[0] == WETH, "SakeSwapRouter: INVALID_PATH");
        amounts = SakeSwapLibrary.getAmountsIn(factory, amountOut, path);
        address pair = SakeSwapLibrary.pairFor(factory, path[0], path[1]);
        if (path.length == 2) {
            uint256 extra = ISakeSwapPair(pair).dealSlippageWithOut(path, amountOut, to, ifmint);
            amounts[0] = amounts[0].add(extra);
        }
        IWETH(WETH).deposit{value: amounts[0]}();
        assert(IWETH(WETH).transfer(pair, amounts[0]));
        _swap(amounts, path, to);
        // refund dust eth, if any
        if (msg.value > amounts[0]) TransferHelper.safeTransferETH(msg.sender, msg.value - amounts[0]);
    }

    // **** SWAP (supporting fee-on-transfer tokens) ****
    // requires the initial amount to have already been sent to the first pair
    function _swapSupportingFeeOnTransferTokens(
        address[] memory path,
        address _to,
        bool ifmint
    ) internal virtual {
        for (uint256 i; i < path.length - 1; i++) {
            (address token0, ) = SakeSwapLibrary.sortTokens(path[i], path[i + 1]);
            ISakeSwapPair pair = ISakeSwapPair(SakeSwapLibrary.pairFor(factory, path[i], path[i + 1]));
            uint256 amountOutput;
            {
                // scope to avoid stack too deep errors
                (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
                (uint256 reserveInput, uint256 reserveOutput) = path[i] == token0
                    ? (reserve0, reserve1)
                    : (reserve1, reserve0);
                uint256 amountInput = IERC20(path[i]).balanceOf(address(pair)).sub(reserveInput);
                if (path.length == 2) {
                    amountOutput = pair.dealSlippageWithIn(path, amountInput, _to, ifmint);
                } else {
                    amountOutput = SakeSwapLibrary.getAmountOut(amountInput, reserveInput, reserveOutput);
                }
            }
            (uint256 amount0Out, uint256 amount1Out) = path[i] == token0
                ? (uint256(0), amountOutput)
                : (amountOutput, uint256(0));
            address to = i < path.length - 2 ? SakeSwapLibrary.pairFor(factory, path[i + 1], path[i + 2]) : _to;
            pair.swap(amount0Out, amount1Out, to, new bytes(0));
        }
    }

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline,
        bool ifmint
    ) external virtual override ensure(deadline) {
        TransferHelper.safeTransferFrom(
            path[0],
            msg.sender,
            SakeSwapLibrary.pairFor(factory, path[0], path[1]),
            amountIn
        );
        uint256 balanceBefore = IERC20(path[path.length - 1]).balanceOf(to);
        _swapSupportingFeeOnTransferTokens(path, to, ifmint);
        require(
            IERC20(path[path.length - 1]).balanceOf(to).sub(balanceBefore) >= amountOutMin,
            "SakeSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT"
        );
    }

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline,
        bool ifmint
    ) external virtual override payable ensure(deadline) {
        require(path[0] == WETH, "SakeSwapRouter: INVALID_PATH");
        uint256 amountIn = msg.value;
        IWETH(WETH).deposit{value: amountIn}();
        assert(IWETH(WETH).transfer(SakeSwapLibrary.pairFor(factory, path[0], path[1]), amountIn));
        uint256 balanceBefore = IERC20(path[path.length - 1]).balanceOf(to);
        _swapSupportingFeeOnTransferTokens(path, to, ifmint);
        require(
            IERC20(path[path.length - 1]).balanceOf(to).sub(balanceBefore) >= amountOutMin,
            "SakeSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT"
        );
    }

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline,
        bool ifmint
    ) external virtual override ensure(deadline) {
        require(path[path.length - 1] == WETH, "SakeSwapRouter: INVALID_PATH");
        TransferHelper.safeTransferFrom(
            path[0],
            msg.sender,
            SakeSwapLibrary.pairFor(factory, path[0], path[1]),
            amountIn
        );
        _swapSupportingFeeOnTransferTokens(path, address(this), ifmint);
        uint256 amountOut = IERC20(WETH).balanceOf(address(this));
        require(amountOut >= amountOutMin, "SakeSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        IWETH(WETH).withdraw(amountOut);
        TransferHelper.safeTransferETH(to, amountOut);
    }

    // **** LIBRARY FUNCTIONS ****
    function quote(
        uint256 amountA,
        uint256 reserveA,
        uint256 reserveB
    ) public virtual override pure returns (uint256 amountB) {
        return SakeSwapLibrary.quote(amountA, reserveA, reserveB);
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public virtual override pure returns (uint256 amountOut) {
        return SakeSwapLibrary.getAmountOut(amountIn, reserveIn, reserveOut);
    }

    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) public virtual override pure returns (uint256 amountIn) {
        return SakeSwapLibrary.getAmountIn(amountOut, reserveIn, reserveOut);
    }

    function getAmountsOut(uint256 amountIn, address[] memory path)
        public
        virtual
        override
        view
        returns (uint256[] memory amounts)
    {
        return SakeSwapLibrary.getAmountsOut(factory, amountIn, path);
    }

    function getAmountsIn(uint256 amountOut, address[] memory path)
        public
        virtual
        override
        view
        returns (uint256[] memory amounts)
    {
        return SakeSwapLibrary.getAmountsIn(factory, amountOut, path);
    }
}
