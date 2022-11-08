// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "../interfaces/IERC20.sol";
import "../interfaces/IUniswapV2Pair.sol";
import "../interfaces/IBentoBoxMinimal.sol";
import "../interfaces/IPool.sol";
import "hardhat/console.sol";

contract RouteProcessor {
  IBentoBoxMinimal immutable BentoBox;

  constructor(address _BentoBox) {
    BentoBox = IBentoBoxMinimal(_BentoBox);
  }

  // To be used in UI. For External Owner Accounts only
  function processRoute(
    address tokenIn,
    uint amountIn,
    address tokenOut,
    uint amountOutMin,
    address to,
    bytes memory route
  ) external payable  returns (uint amountOut){
    require(tx.origin == msg.sender, "Call from not EOA");      // Prevents reentrance

    uint amountInAcc = 0;
    uint balanceInitial = IERC20(tokenOut).balanceOf(to);

    uint stream = createStream(route);
    while(isNotEmpty(stream)) {
      uint8 commandCode = readUint8(stream);
      if (commandCode < 20) {
        if (commandCode == 10) swapUniswapPool(stream); // Sushi/Uniswap pool swap
        else if (commandCode == 3) amountInAcc += distributeERC20Amounts(stream, tokenIn); // initial distribution
        else if (commandCode == 4) distributeERC20Shares(stream);  // distribute ERC20 tokens from this router to pools
        else revert("Unknown command code");
      } else if (commandCode < 24) {
        if (commandCode == 20) bentoDepositAmountFromBento(stream, tokenIn);
        else if (commandCode == 21) swapTrident(stream);
        else if (commandCode == 23) bentoWithdrawShareFromRP(stream, tokenIn);
        else revert("Unknown command code");
      } else {
        if (commandCode == 24) amountInAcc += distributeBentoShares(stream, tokenIn);
        else if (commandCode == 25) distributeBentoPortions(stream);
        else if (commandCode == 26) bentoDepositAllFromBento(stream);
        else if (commandCode == 27) bentoWithdrawAllFromRP(stream);
        else revert("Unknown command code");
      }
    }

    require(amountInAcc == amountIn, "Wrong amountIn value");
    uint balanceFinal = IERC20(tokenOut).balanceOf(to);
    require(balanceFinal >= balanceInitial + amountOutMin, "Minimal ouput balance violation");

    amountOut = balanceFinal - balanceInitial;
  }

  // Transfers input tokens from BentoBox to a pool.
  // Expected to be launched for initial liquidity distribution from user to Bento, so we know exact amounts
  function bentoDepositAmountFromBento(uint stream, address token) private {
    address to = readAddress(stream);
    uint amount = readUint(stream);
    BentoBox.deposit(token, address(BentoBox), to, amount, 0);
  }

  // Transfers all input tokens from BentoBox to a pool
  function bentoDepositAllFromBento(uint stream) private {
    address to = readAddress(stream);
    address token = readAddress(stream);

    uint amount = IERC20(token).balanceOf(address(BentoBox))
      + BentoBox.strategyData(token).balance
      - BentoBox.totals(token).elastic;
    BentoBox.deposit(token, address(BentoBox), to, amount, 0);
  }

  // Withdraw Bento tokens from Bento to an address.
  function bentoWithdrawShareFromRP(uint stream, address token) private {
    address to = readAddress(stream);
    uint amount = readUint(stream);
    BentoBox.withdraw(token, address(this), to, amount, 0);
  }

  // Withdraw all Bento tokens from Bento to an address.
  function bentoWithdrawAllFromRP(uint stream) private {
    address token = readAddress(stream);
    address to = readAddress(stream);
    uint amount = BentoBox.balanceOf(token, address(this));
    BentoBox.withdraw(token, address(this), to, 0, amount);
  }

  // Trident pool swap
  function swapTrident(uint stream) private {
    address pool = readAddress(stream);
    bytes memory swapData = readBytes(stream);
    IPool(pool).swap(swapData);
  }

  // Sushi/Uniswap pool swap
  function swapUniswapPool(uint stream) private returns (uint amountOut) {
    address pool = readAddress(stream);
    address tokenIn = readAddress(stream);
    uint8 direction = readUint8(stream);
    address to = readAddress(stream);

    (uint r0, uint r1,) = IUniswapV2Pair(pool).getReserves();
    require(r0 > 0 && r1 > 0, 'Wrong pool reserves');
    (uint reserveIn, uint reserveOut) = direction == 1 ? (r0, r1) : (r1, r0);
    
    uint amountIn = IERC20(tokenIn).balanceOf(pool) - reserveIn;
    uint amountInWithFee = amountIn * 997;
    amountOut = amountInWithFee * reserveOut / (reserveIn * 1000 + amountInWithFee);
    (uint amount0Out, uint amount1Out) = direction == 1 ? (uint(0), amountOut) : (amountOut, uint(0));
    IUniswapV2Pair(pool).swap(amount0Out, amount1Out, to, new bytes(0));
  }

  // Distributes input ERC20 tokens from msg.sender to addresses. Tokens should be approved
  // Expected to be launched for initial liquidity distribution from user to pools, so we know exact amounts
  function distributeERC20Amounts(uint stream, address token) private returns (uint amountTotal) {
    uint8 num = readUint8(stream);
    amountTotal = 0;
    for (uint i = 0; i < num; ++i) {
      address to = readAddress(stream);
      uint amount = readUint(stream);
      amountTotal += amount;
      IERC20(token).transferFrom(msg.sender, to, amount);
    }
  }

  // Distributes input Bento tokens from msg.sender to addresses. Tokens should be approved
  // Expected to be launched for initial liquidity distribution from user to pools, so we know exact amounts
  function distributeBentoShares(uint stream, address token) private returns (uint sharesTotal) {
    uint8 num = readUint8(stream);
    sharesTotal = 0;
    for (uint i = 0; i < num; ++i) {
      address to = readAddress(stream);
      uint share = readUint(stream);
      sharesTotal += share;
      BentoBox.transfer(token, msg.sender, to, share);
    }
  }

  // Distribute ERC20 tokens from this routeProcessor to addresses. 
  // Quantity for sending is determined by share in 1/65535.
  // During routing we can't predict in advance the actual value of internal swaps because of slippage,
  // so we have to work with shares - not fixed amounts
  function distributeERC20Shares(uint stream) private {
    address token = readAddress(stream);
    uint8 num = readUint8(stream);
    uint amountTotal = IERC20(token).balanceOf(address(this));

    for (uint i = 0; i < num; ++i) {
      address to = readAddress(stream); 
      uint16 share = readUint16(stream);
      unchecked {
        uint amount = amountTotal * share / 65535;
        amountTotal -= amount;
        IERC20(token).transfer(to, amount);
      }
    }
  }

  // Distribute Bento tokens from this routeProcessor to addresses. 
  // Quantity for sending is determined by portions in 1/65535.
  // During routing we can't predict in advance the actual value of internal swaps because of slippage,
  // so we have to work with portions - not fixed amounts
  function distributeBentoPortions(uint stream) private {
    address token = readAddress(stream);
    uint8 num = readUint8(stream);
    uint amountTotal = BentoBox.balanceOf(token, address(this));

    for (uint i = 0; i < num; ++i) {
      address to = readAddress(stream);
      uint16 share = readUint16(stream);
      unchecked {
        uint amount = amountTotal * share / 65535;
        amountTotal -= amount;
        BentoBox.transfer(token, address(this), to, amount);
      }
    }
  }


// ===================== Stream operations ======================

  function createStream(bytes memory data) private pure returns (uint stream) {
    assembly {
      stream := mload(0x40)
      mstore(0x40, add(stream, 64))
      mstore(stream, data)
      let length := mload(data)
      mstore(add(stream, 32), add(data, length))
    }
  }

  function isNotEmpty(uint stream) private pure returns (bool) {
    uint pos;
    uint finish;
    assembly {
      pos := mload(stream)
      finish := mload(add(stream, 32))
    }
    return pos < finish;
  }

  function readUint8(uint stream) private pure returns (uint8 res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 1)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readUint16(uint stream) private pure returns (uint16 res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 2)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readUint32(uint stream) private pure returns (uint32 res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 4)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readUint(uint stream) private pure returns (uint res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 32)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readAddress(uint stream) public pure returns (address res) {
    assembly {
      let pos := mload(stream)
      pos := add(pos, 20)
      res := mload(pos)
      mstore(stream, pos)
    }
  }

  function readBytes(uint stream) public pure returns (bytes memory res) {
    assembly {
      let pos := mload(stream)
      res := add(pos, 32)
      let length := mload(res)
      mstore(stream, add(res, length))
    }
  }

}
