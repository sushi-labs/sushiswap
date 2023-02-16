// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import '../interfaces/IUniswapV2Pair.sol';
import '../interfaces/IUniswapV3Pool.sol';
import '../interfaces/IBentoBoxMinimal.sol';
import '../interfaces/IPool.sol';
import '../interfaces/IWETH.sol';
import './InputStream.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

address constant NATIVE_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
address constant IMPOSSIBLE_POOL_ADDRESS = 0x0000000000000000000000000000000000000001;

/// @dev The minimum value that can be returned from #getSqrtRatioAtTick. Equivalent to getSqrtRatioAtTick(MIN_TICK)
uint160 constant MIN_SQRT_RATIO = 4295128739;
/// @dev The maximum value that can be returned from #getSqrtRatioAtTick. Equivalent to getSqrtRatioAtTick(MAX_TICK)
uint160 constant MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342;

/// @title A route processor for the Sushi Aggregator
/// @author Ilya Lyalin
contract RouteProcessor2 {
  using SafeERC20 for IERC20;
  using InputStream for uint256;

  IBentoBoxMinimal public immutable bentoBox;
  address private lastCalledPool;

  uint private unlocked = 1;
  modifier lock() {
      require(unlocked == 1, 'RouteProcessor is locked');
      unlocked = 2;
      _;
      unlocked = 1;
  }

  constructor(address _bentoBox) {
    bentoBox = IBentoBoxMinimal(_bentoBox);
    lastCalledPool = IMPOSSIBLE_POOL_ADDRESS;
  }

  /// @notice For native unwrapping
  receive() external payable {}

  /// @notice Processes the route generated off-chain. Has a lock
  /// @param tokenIn Address of the input token
  /// @param amountIn Amount of the input token
  /// @param tokenOut Address of the output token
  /// @param amountOutMin Minimum amount of the output token
  /// @return amountOut Actual amount of the output token
  function processRoute(
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOutMin,
    address to,
    bytes memory route
  ) external payable lock returns (uint256 amountOut) {
    return processRouteInternal(tokenIn, amountIn, tokenOut, amountOutMin, to, route);
  }

  /// @notice Transfers some value to <transferValueTo> and then processes the route
  /// @param transferValueTo Address where the value should be transferred
  /// @param amountValueTransfer How much value to transfer
  /// @param tokenIn Address of the input token
  /// @param amountIn Amount of the input token
  /// @param tokenOut Address of the output token
  /// @param amountOutMin Minimum amount of the output token
  /// @return amountOut Actual amount of the output token
  function transferValueAndprocessRoute(
    address payable transferValueTo,
    uint256 amountValueTransfer,
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOutMin,
    address to,
    bytes memory route
  ) external payable lock returns (uint256 amountOut) {
    transferValueTo.transfer(amountValueTransfer);
    return processRouteInternal(tokenIn, amountIn, tokenOut, amountOutMin, to, route);
  }

  /// @notice Processes the route generated off-chain
  /// @param tokenIn Address of the input token
  /// @param amountIn Amount of the input token
  /// @param tokenOut Address of the output token
  /// @param amountOutMin Minimum amount of the output token
  /// @return amountOut Actual amount of the output token
  function processRouteInternal(
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOutMin,
    address to,
    bytes memory route
  ) private returns (uint256 amountOut) {
    uint256 balanceInInitial = tokenIn == NATIVE_ADDRESS ? address(this).balance : IERC20(tokenIn).balanceOf(msg.sender);
    uint256 balanceOutInitial = tokenOut == NATIVE_ADDRESS ? address(to).balance : IERC20(tokenOut).balanceOf(to);

    uint256 stream = InputStream.createStream(route);
    while (stream.isNotEmpty()) {
      uint8 commandCode = stream.readUint8();
      if (commandCode == 1) processMyERC20(stream);
      else if (commandCode == 2) processUserERC20(stream, amountIn);
      else if (commandCode == 3) processNative(stream);
      else revert('RouteProcessor: Unknown command code');
    }

    uint256 balanceInFinal = tokenIn == NATIVE_ADDRESS ? address(this).balance : IERC20(tokenIn).balanceOf(msg.sender);
    require(balanceInFinal + amountIn >= balanceInInitial, 'RouteProcessor: Minimal imput balance violation');

    uint256 balanceOutFinal = tokenOut == NATIVE_ADDRESS ? address(to).balance : IERC20(tokenOut).balanceOf(to);
    require(balanceOutFinal >= balanceOutInitial + amountOutMin, 'RouteProcessor: Minimal ouput balance violation');

    amountOut = balanceOutFinal - balanceOutInitial;
  }

  function processNative(uint256 stream) private {
    uint256 amountTotal = address(this).balance;
    distributeAndSwap(stream, address(this), NATIVE_ADDRESS, amountTotal);
  }

  function processMyERC20(uint256 stream) private {
    address token = stream.readAddress();
    uint256 amountTotal = IERC20(token).balanceOf(address(this));
    unchecked {
      if (amountTotal > 0) amountTotal -= 1;     // slot undrain protection
    }
    distributeAndSwap(stream, address(this), token, amountTotal);
  }
  
  function processUserERC20(uint256 stream, uint256 amountTotal) private {
    address token = stream.readAddress();
    distributeAndSwap(stream, msg.sender, token, amountTotal);
  }

  function distributeAndSwap(uint256 stream, address from, address tokenIn, uint256 amountTotal) private {
    uint8 num = stream.readUint8();
    unchecked {
      for (uint256 i = 0; i < num; ++i) {
        uint16 share = stream.readUint16();
        uint256 amount = (amountTotal * share) / 65535;
        amountTotal -= amount;
        swap(stream, from, tokenIn, amount);
      }
    }
  }

  function swap(uint256 stream, address from, address tokenIn, uint256 amountIn) private {
    uint8 poolType = stream.readUint8();
    if (poolType == 0) swapUniV2(stream, from, tokenIn, amountIn);
    //else if (poolType == 1) swapUniV3(stream, tokenIn, amountIn);
    else if (poolType == 2) wrapNative(stream, from, tokenIn, amountIn);
    else revert('RouteProcessor: Unknown pool type');
  }

  function wrapNative(uint256 stream, address from, address tokenIn, uint256 amountIn) private {
    uint8 direction = stream.readUint8();
    address to = stream.readAddress();

    if (direction > 0) {  // wrap native
      address wrapToken = stream.readAddress();
      uint amount = address(this).balance;
      IWETH(wrapToken).deposit{value: amount}();
      if (to != address(this)) IERC20(wrapToken).safeTransfer(to, amount);
    } else { // unwrap native
      if (from != address(this)) IERC20(tokenIn).safeTransferFrom(from, address(this), amountIn);
      IWETH(tokenIn).withdraw(amountIn);
      payable(to).transfer(address(this).balance);
    }
  }

  function swapUniV2(uint256 stream, address from, address tokenIn, uint256 amountIn) private {
    address pool = stream.readAddress();
    uint8 direction = stream.readUint8();
    address to = stream.readAddress();
    uint8 presended = stream.readUint8();   // optimization

    (uint256 r0, uint256 r1, ) = IUniswapV2Pair(pool).getReserves();
    require(r0 > 0 && r1 > 0, 'Wrong pool reserves');
    (uint256 reserveIn, uint256 reserveOut) = direction == 1 ? (r0, r1) : (r1, r0);

    if (presended == 0) IERC20(tokenIn).safeTransferFrom(from, pool, amountIn);
    else amountIn = IERC20(tokenIn).balanceOf(pool) - reserveIn;

    uint256 amountInWithFee = amountIn * 997;
    uint256 amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee);
    (uint256 amount0Out, uint256 amount1Out) = direction == 1 ? (uint256(0), amountOut) : (amountOut, uint256(0));
    IUniswapV2Pair(pool).swap(amount0Out, amount1Out, to, new bytes(0));
  }

  /// @notice Performs a UniV3 pool swap
  /// @param amountIn amount of tokens to swap
  /// @param stream [Pool, TokenIn, Direction, To]
  function swapUniV3(uint256 amountIn, uint256 stream) private {
    address pool = stream.readAddress();
    address tokenIn = stream.readAddress();
    bool zeroForOne = stream.readUint8() > 0;
    address recipient = stream.readAddress();

    lastCalledPool = pool;
    IUniswapV3Pool(pool).swap(
      recipient,
      zeroForOne,
      int256(amountIn),
      zeroForOne ? MIN_SQRT_RATIO + 1 : MAX_SQRT_RATIO - 1,
      abi.encode(tokenIn)
    );
  }

  /// @notice Called to `msg.sender` after executing a swap via IUniswapV3Pool#swap.
  /// @dev In the implementation you must pay the pool tokens owed for the swap.
  /// The caller of this method must be checked to be a UniswapV3Pool deployed by the canonical UniswapV3Factory.
  /// amount0Delta and amount1Delta can both be 0 if no tokens were swapped.
  /// @param amount0Delta The amount of token0 that was sent (negative) or must be received (positive) by the pool by
  /// the end of the swap. If positive, the callback must send that amount of token0 to the pool.
  /// @param amount1Delta The amount of token1 that was sent (negative) or must be received (positive) by the pool by
  /// the end of the swap. If positive, the callback must send that amount of token1 to the pool.
  /// @param data Any data passed through by the caller via the IUniswapV3PoolActions#swap call
  function uniswapV3SwapCallback(
    int256 amount0Delta,
    int256 amount1Delta,
    bytes calldata data
  ) external {
    require(msg.sender == lastCalledPool, 'RouteProcessor.uniswapV3SwapCallback: call from unknown source');
    lastCalledPool = IMPOSSIBLE_POOL_ADDRESS;
    address tokenIn = abi.decode(data, (address));
    int256 amount = amount0Delta > 0 ? amount0Delta : amount1Delta;
    require(amount > 0, 'RouteProcessor.uniswapV3SwapCallback: no positive amount');
    IERC20(tokenIn).safeTransfer(msg.sender, uint256(amount));
  }
}
