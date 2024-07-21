// SPDX-License-Identifier: UNLICENSED

pragma solidity =0.8.25;

import '../interfaces/IUniswapV2Pair.sol';
import '../interfaces/IBentoBoxMinimal.sol';
import '../interfaces/IPool.sol';
import '../interfaces/IWETH.sol';
import './InputStream.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

address constant NATIVE_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

/// @title A route processor for the Sushi Aggregator
/// @author Okavango
contract RouteProcessor {
  using SafeERC20 for IERC20;
  using InputStream for uint256;

  IBentoBoxMinimal public immutable bentoBox;

  uint private unlocked = 1;
  modifier lock() {
      require(unlocked == 1, 'RouteProcessor is locked');
      unlocked = 2;
      _;
      unlocked = 1;
  }

  constructor(address _bentoBox) {
    bentoBox = IBentoBoxMinimal(_bentoBox);
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
    (bool success, bytes memory returnBytes) = transferValueTo.call{value: amountValueTransfer}('');
    require(success, string(abi.encodePacked(returnBytes)));
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
    uint256 amountInAcc = 0;
    uint256 balanceInitial = tokenOut == NATIVE_ADDRESS ? 
      address(to).balance : IERC20(tokenOut).balanceOf(to);

    uint256 stream = InputStream.createStream(route);
    while (stream.isNotEmpty()) {
      uint8 commandCode = stream.readUint8();
      if (commandCode < 20) {
        if (commandCode == 10)
          swapUniswapPool(stream); // Sushi/Uniswap pool swap
        else if (commandCode == 4)
          distributeERC20Shares(stream); // distribute ERC20 tokens from this router to pools
        else if (commandCode == 3)
          amountInAcc += distributeERC20Amounts(stream, tokenIn); // initial distribution
        else if (commandCode == 5)
          amountInAcc += wrapAndDistributeERC20Amounts(stream); // wrap natives and initial distribution        
        else if (commandCode == 6) 
          unwrapNative(to, stream);
        else if (commandCode == 7)
          amountInAcc += distributeERC20AmountsFromRP(stream, tokenIn); // initial distribution
        else revert('Unknown command code');
      } else if (commandCode < 24) {
        if (commandCode == 20) bentoDepositAmountFromBento(stream, tokenIn);
        else if (commandCode == 21) swapTrident(stream);
        else if (commandCode == 23) bentoWithdrawShareFromRP(stream, tokenIn);
        else revert('Unknown command code');
      } else {
        if (commandCode == 24) amountInAcc += distributeBentoShares(stream, tokenIn);
        else if (commandCode == 25) distributeBentoPortions(stream);
        else if (commandCode == 26) bentoDepositAllFromBento(stream);
        else if (commandCode == 27) bentoWithdrawAllFromRP(stream);
        else revert('Unknown command code');
      }
    }

    require(amountInAcc == amountIn, 'Wrong amountIn value');
    uint256 balanceFinal = tokenOut == NATIVE_ADDRESS ? 
      address(to).balance : IERC20(tokenOut).balanceOf(to);
    require(balanceFinal >= balanceInitial + amountOutMin, 'Minimal ouput balance violation');

    amountOut = balanceFinal - balanceInitial;
  }

  /// @notice Transfers input tokens sent to BentoBox to a pool
  /// @notice Expected to be called for initial liquidity transfer from user to BentoBox, so we know exact amounts
  /// @param stream [Pool, Amount]. Pool into which an amount of tokens will be transferred
  /// @param token Address of the token to transfer
  function bentoDepositAmountFromBento(uint256 stream, address token) private {
    address to = stream.readAddress();
    uint256 amount = stream.readUint();
    bentoBox.deposit(token, address(bentoBox), to, amount, 0);
  }

  /// @notice Transfers all available input tokens from BentoBox to a pool
  /// @param stream [Pool, Token]. Pool into which all tokens will be transferred 
  function bentoDepositAllFromBento(uint256 stream) private {
    address to = stream.readAddress();
    address token = stream.readAddress();

    uint256 amount = IERC20(token).balanceOf(address(bentoBox)) +
      bentoBox.strategyData(token).balance -
      bentoBox.totals(token).elastic;
    bentoBox.deposit(token, address(bentoBox), to, amount, 0);
  }

  /// @notice Withdraws BentoBox tokens from BentoBox to an address
  /// @param stream [To, Amount]. Destination where an amount of token will be transferred
  /// @param token Token to transfer
  function bentoWithdrawShareFromRP(uint256 stream, address token) private {
    address to = stream.readAddress();
    uint256 amount = stream.readUint();
    bentoBox.withdraw(token, address(this), to, amount, 0);
  }

  /// @notice Withdraws all available BentoBox tokens from BentoBox to an address
  /// @param stream [Token, To]. Token which will be transferred to a destination
  function bentoWithdrawAllFromRP(uint256 stream) private {
    address token = stream.readAddress();
    address to = stream.readAddress();
    uint256 amount = bentoBox.balanceOf(token, address(this));
    bentoBox.withdraw(token, address(this), to, 0, amount);
  }

  /// @notice Performs a Trident pool swap
  /// @param stream [Pool, SwapData]. Pool against a swap defined by SwapData will be executed
  function swapTrident(uint256 stream) private {
    address pool = stream.readAddress();
    bytes memory swapData = stream.readBytes();
    IPool(pool).swap(swapData);
  }

  /// @notice Performs a Sushi/UniswapV2 pool swap
  /// @param stream [Pool, TokenIn, Direction, To]
  /// @return amountOut Amount of the output token
  function swapUniswapPool(uint256 stream) private returns (uint256 amountOut) {
    address pool = stream.readAddress();
    address tokenIn = stream.readAddress();
    uint8 direction = stream.readUint8();
    address to = stream.readAddress();

    (uint256 r0, uint256 r1, ) = IUniswapV2Pair(pool).getReserves();
    require(r0 > 0 && r1 > 0, 'Wrong pool reserves');
    (uint256 reserveIn, uint256 reserveOut) = direction == 1 ? (r0, r1) : (r1, r0);

    uint256 amountIn = IERC20(tokenIn).balanceOf(pool) - reserveIn;
    uint256 amountInWithFee = amountIn * 997;
    amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee);
    (uint256 amount0Out, uint256 amount1Out) = direction == 1 ? (uint256(0), amountOut) : (amountOut, uint256(0));
    IUniswapV2Pair(pool).swap(amount0Out, amount1Out, to, new bytes(0));
  }

  /// @notice Distributes input ERC20 tokens from msg.sender to addresses. Tokens should be approved
  /// @notice Expected to be called for initial liquidity transfer from the user to pools, so we know exact amounts
  /// @param stream [ArrayLength, ...[To, Amount][]]. An array of destinations and token amounts
  /// @param token Token to distribute
  /// @return amountTotal Total amount distributed
  function distributeERC20Amounts(uint256 stream, address token) private returns (uint256 amountTotal) {
    uint8 num = stream.readUint8();
    amountTotal = 0;
    for (uint256 i = 0; i < num; ++i) {
      address to = stream.readAddress();
      uint256 amount = stream.readUint();
      amountTotal += amount;
      IERC20(token).safeTransferFrom(msg.sender, to, amount);
    }
  }

  /// @notice Distributes input ERC20 tokens from this contract to addresses. Tokens should be approved
  /// @notice Expected to be called for initial liquidity transfer from the user to pools, so we know exact amounts
  /// @param stream [ArrayLength, ...[To, Amount][]]. An array of destinations and token amounts
  /// @param token Token to distribute
  /// @return amountTotal Total amount distributed
  function distributeERC20AmountsFromRP(uint256 stream, address token) private returns (uint256 amountTotal) {
    uint8 num = stream.readUint8();
    amountTotal = 0;
    for (uint256 i = 0; i < num; ++i) {
      address to = stream.readAddress();
      uint256 amount = stream.readUint();
      amountTotal += amount;
      IERC20(token).safeTransfer(to, amount);
    }
  }

  /// @notice Wraps all native inputs and distributes wrapped ERC20 tokens from RouteProcessor to addresses
  /// @notice Expected to be called for initial liquidity transfer from the user to pools, so we know exact amounts
  /// @param stream [WrapToken, ArrayLength, ...[To, Amount][]]. An array of destinations and token amounts
  /// @return amountTotal Total amount distributed
  function wrapAndDistributeERC20Amounts(uint256 stream) private returns (uint256 amountTotal) {
    address token = stream.readAddress();
    IWETH(token).deposit{value: address(this).balance}();
    uint8 num = stream.readUint8();
    amountTotal = 0;
    for (uint256 i = 0; i < num; ++i) {
      address to = stream.readAddress();
      uint256 amount = stream.readUint();
      amountTotal += amount;
      IERC20(token).safeTransfer(to, amount);
    }
    require(address(this).balance == 0, "RouteProcessor: invalid input amount");
  }

  /// @notice Distributes input BentoBox tokens from msg.sender to addresses. Tokens should be approved
  /// @notice Expected to be called for initial liquidity transfer from the user to pools, so we know exact amounts
  /// @param stream [ArrayLength, ...[To, ShareAmount][]]. An array of destinations and token share amounts
  /// @param token Token to distribute
  /// @return sharesTotal Total shares distributed
  function distributeBentoShares(uint256 stream, address token) private returns (uint256 sharesTotal) {
    uint8 num = stream.readUint8();
    sharesTotal = 0;
    for (uint256 i = 0; i < num; ++i) {
      address to = stream.readAddress();
      uint256 share = stream.readUint();
      sharesTotal += share;
      bentoBox.transfer(token, msg.sender, to, share);
    }
  }

  /// @notice Distributes ERC20 tokens from RouteProcessor to addresses
  /// @notice Quantity for sending is determined by share in 1/65535
  /// @notice During routing we can't predict in advance the actual value of internal swaps because of slippage,
  /// @notice so we have to work with shares - not fixed amounts
  /// @param stream [Token, ArrayLength, ...[To, ShareAmount][]]. Token to distribute. An array of destinations and token share amounts
  function distributeERC20Shares(uint256 stream) private {
    address token = stream.readAddress();
    uint8 num = stream.readUint8();
    uint256 amountTotal = IERC20(token).balanceOf(address(this))
      - 1;     // slot undrain protection

    unchecked {
      for (uint256 i = 0; i < num; ++i) {
        address to = stream.readAddress();
        uint16 share = stream.readUint16();
        uint256 amount = (amountTotal * share) / 65535;
        amountTotal -= amount;
        IERC20(token).safeTransfer(to, amount);
      }
    }
  }

  /// @notice Distributes BentoBox tokens from RouteProcessor to addresses
  /// @notice Quantity for sending is determined by portions in 1/65535.
  /// @notice During routing we can't predict in advance the actual value of internal swaps because of slippage,
  /// @notice so we have to work with portions - not fixed amounts
  /// @param stream [Token, ArrayLength, ...[To, ShareAmount][]]. Token to distribute. An array of destinations and token share amounts
  function distributeBentoPortions(uint256 stream) private {
    address token = stream.readAddress();
    uint8 num = stream.readUint8();
    uint256 amountTotal = bentoBox.balanceOf(token, address(this))
      - 1;     // slot undrain protection

    unchecked {
      for (uint256 i = 0; i < num; ++i) {
        address to = stream.readAddress();
        uint16 share = stream.readUint16();
        uint256 amount = (amountTotal * share) / 65535;
        amountTotal -= amount;
        bentoBox.transfer(token, address(this), to, amount);
      }
    }
  }

  /// @notice Unwraps the Native Token
  /// @param receiver Destination of the unwrapped token
  /// @param stream [Token]. Token to unwrap native
  function unwrapNative(address receiver, uint256 stream) private {
    address token = stream.readAddress();
    IWETH(token).withdraw( IERC20(token).balanceOf(address(this))
      - 1);     // slot undrain protection
    payable(receiver).transfer(address(this).balance);
  }
}
