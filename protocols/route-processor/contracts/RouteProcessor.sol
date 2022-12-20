// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import '../interfaces/IUniswapV2Pair.sol';
import '../interfaces/IBentoBoxMinimal.sol';
import '../interfaces/IPool.sol';
import '../interfaces/IWETH.sol';
import './StreamReader.sol';
import 'hardhat/console.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

address constant NATIVE_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

contract RouteProcessor is StreamReader {
  using SafeERC20 for IERC20;

  IBentoBoxMinimal immutable bentoBox;
  IWETH public immutable wNATIVE;

  constructor(address _bentoBox, address _wNATIVE) {
    bentoBox = IBentoBoxMinimal(_bentoBox);
    wNATIVE = IWETH(_wNATIVE);
  }

  // for native unwrapping
  receive() external payable {}

  function processRoute(
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 amountOutMin,
    address to,
    bytes memory route
  ) external payable returns (uint256 amountOut) {
    require(tx.origin == msg.sender, 'Call from not EOA'); // Prevents reentrance

    uint256 amountInAcc = 0;
    uint256 balanceInitial = tokenOut == NATIVE_ADDRESS ? 
      address(to).balance : IERC20(tokenOut).balanceOf(to);

    uint256 stream = createStream(route);
    while (isNotEmpty(stream)) {
      uint8 commandCode = readUint8(stream);
      if (commandCode < 20) {
        if (commandCode == 10)
          swapUniswapPool(stream); // Sushi/Uniswap pool swap
        else if (commandCode == 3)
          amountInAcc += distributeERC20Amounts(stream, tokenIn); // initial distribution
        else if (commandCode == 4)
          distributeERC20Shares(stream); // distribute ERC20 tokens from this router to pools
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
        else if (commandCode == 28) amountInAcc += wrapNative();
        else if (commandCode == 29) unwrapNative(to);
        else revert('Unknown command code');
      }
    }

    require(amountInAcc == amountIn, 'Wrong amountIn value');
    uint256 balanceFinal = tokenOut == NATIVE_ADDRESS ? 
      address(to).balance : IERC20(tokenOut).balanceOf(to);
    require(balanceFinal >= balanceInitial + amountOutMin, 'Minimal ouput balance violation');

    amountOut = balanceFinal - balanceInitial;
  }

  // Transfers input tokens from BentoBox to a pool.
  // Expected to be launched for initial liquidity distribution from user to Bento, so we know exact amounts
  function bentoDepositAmountFromBento(uint256 stream, address token) private {
    address to = readAddress(stream);
    uint256 amount = readUint(stream);
    bentoBox.deposit(token, address(bentoBox), to, amount, 0);
  }

  // Transfers all input tokens from BentoBox to a pool
  function bentoDepositAllFromBento(uint256 stream) private {
    address to = readAddress(stream);
    address token = readAddress(stream);

    uint256 amount = IERC20(token).balanceOf(address(bentoBox)) +
      bentoBox.strategyData(token).balance -
      bentoBox.totals(token).elastic;
    bentoBox.deposit(token, address(bentoBox), to, amount, 0);
  }

  // Withdraw Bento tokens from Bento to an address.
  function bentoWithdrawShareFromRP(uint256 stream, address token) private {
    address to = readAddress(stream);
    uint256 amount = readUint(stream);
    bentoBox.withdraw(token, address(this), to, amount, 0);
  }

  // Withdraw all Bento tokens from Bento to an address.
  function bentoWithdrawAllFromRP(uint256 stream) private {
    address token = readAddress(stream);
    address to = readAddress(stream);
    uint256 amount = bentoBox.balanceOf(token, address(this));
    bentoBox.withdraw(token, address(this), to, 0, amount);
  }

  // Trident pool swap
  function swapTrident(uint256 stream) private {
    address pool = readAddress(stream);
    bytes memory swapData = readBytes(stream);
    IPool(pool).swap(swapData);
  }

  // Sushi/Uniswap pool swap
  function swapUniswapPool(uint256 stream) private returns (uint256 amountOut) {
    address pool = readAddress(stream);
    address tokenIn = readAddress(stream);
    uint8 direction = readUint8(stream);
    address to = readAddress(stream);

    (uint256 r0, uint256 r1, ) = IUniswapV2Pair(pool).getReserves();
    require(r0 > 0 && r1 > 0, 'Wrong pool reserves');
    (uint256 reserveIn, uint256 reserveOut) = direction == 1 ? (r0, r1) : (r1, r0);

    uint256 amountIn = IERC20(tokenIn).balanceOf(pool) - reserveIn;
    uint256 amountInWithFee = amountIn * 997;
    amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee);
    (uint256 amount0Out, uint256 amount1Out) = direction == 1 ? (uint256(0), amountOut) : (amountOut, uint256(0));
    IUniswapV2Pair(pool).swap(amount0Out, amount1Out, to, new bytes(0));
  }

  // Distributes input ERC20 tokens from msg.sender to addresses. Tokens should be approved
  // Expected to be launched for initial liquidity distribution from user to pools, so we know exact amounts
  function distributeERC20Amounts(uint256 stream, address token) private returns (uint256 amountTotal) {
    bool wrap = msg.value > 0 && token == address(wNATIVE);
    if (wrap) 
      wNATIVE.deposit{value: msg.value}();
    uint8 num = readUint8(stream);
    amountTotal = 0;
    for (uint256 i = 0; i < num; ++i) {
      address to = readAddress(stream);
      uint256 amount = readUint(stream);
      amountTotal += amount;
      if (wrap) {
        IERC20(token).safeTransfer(to, amount);
      } else {
        IERC20(token).safeTransferFrom(msg.sender, to, amount);
      }
    }
  }

  // Distributes input Bento tokens from msg.sender to addresses. Tokens should be approved
  // Expected to be launched for initial liquidity distribution from user to pools, so we know exact amounts
  function distributeBentoShares(uint256 stream, address token) private returns (uint256 sharesTotal) {
    uint8 num = readUint8(stream);
    sharesTotal = 0;
    for (uint256 i = 0; i < num; ++i) {
      address to = readAddress(stream);
      uint256 share = readUint(stream);
      sharesTotal += share;
      bentoBox.transfer(token, msg.sender, to, share);
    }
  }

  // Distribute ERC20 tokens from this routeProcessor to addresses.
  // Quantity for sending is determined by share in 1/65535.
  // During routing we can't predict in advance the actual value of internal swaps because of slippage,
  // so we have to work with shares - not fixed amounts
  function distributeERC20Shares(uint256 stream) private {
    address token = readAddress(stream);
    uint8 num = readUint8(stream);
    uint256 amountTotal = IERC20(token).balanceOf(address(this));

    for (uint256 i = 0; i < num; ++i) {
      address to = readAddress(stream);
      uint16 share = readUint16(stream);
      unchecked {
        uint256 amount = (amountTotal * share) / 65535;
        amountTotal -= amount;
        IERC20(token).safeTransfer(to, amount);
      }
    }
  }

  // Distribute Bento tokens from this routeProcessor to addresses.
  // Quantity for sending is determined by portions in 1/65535.
  // During routing we can't predict in advance the actual value of internal swaps because of slippage,
  // so we have to work with portions - not fixed amounts
  function distributeBentoPortions(uint256 stream) private {
    address token = readAddress(stream);
    uint8 num = readUint8(stream);
    uint256 amountTotal = bentoBox.balanceOf(token, address(this));

    for (uint256 i = 0; i < num; ++i) {
      address to = readAddress(stream);
      uint16 share = readUint16(stream);
      unchecked {
        uint256 amount = (amountTotal * share) / 65535;
        amountTotal -= amount;
        bentoBox.transfer(token, address(this), to, amount);
      }
    }
  }

  // Wrap the Native Token
  function wrapNative() private returns (uint256 amount) {
    amount = msg.value;
    wNATIVE.deposit{value: amount}();
  }

  // Unwrap the Native Token
  function unwrapNative(address receiver) private {
    wNATIVE.withdraw(IERC20(address(wNATIVE)).balanceOf(address(this)));
    payable(receiver).transfer(address(this).balance);
  }
}
