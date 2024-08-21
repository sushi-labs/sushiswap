// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

// temp till there is no official v4-core. TODO: substitute to v4-core

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

type Currency is address;
type IHooks is address;
type BalanceDelta is int256;

/// @notice Library for getting the amount0 and amount1 deltas from the BalanceDelta type
library BalanceDeltaLibrary {
  using BalanceDeltaLibrary for BalanceDelta;

  /// @notice A BalanceDelta of 0
  BalanceDelta public constant ZERO_DELTA = BalanceDelta.wrap(0);

  function amount0(BalanceDelta balanceDelta) internal pure returns (int128 _amount0) {
      assembly {
          _amount0 := sar(128, balanceDelta)
      }
  }

  function amount1(BalanceDelta balanceDelta) internal pure returns (int128 _amount1) {
      assembly {
          _amount1 := signextend(15, balanceDelta)
      }
  }
}

/// @notice Returns the key for identifying a pool
struct PoolKey {
    /// @notice The lower currency of the pool, sorted numerically
    Currency currency0;
    /// @notice The higher currency of the pool, sorted numerically
    Currency currency1;
    /// @notice The pool swap fee, capped at 1_000_000. If the highest bit is 1, the pool has a dynamic fee and must be exactly equal to 0x800000
    uint24 fee;
    /// @notice Ticks that involve positions must be a multiple of tick spacing
    int24 tickSpacing;
    /// @notice The hooks of the pool
    IHooks hooks;
}

interface IPoolManager {
  struct SwapParams {
    bool zeroForOne;
    int256 amountSpecified;
    uint160 sqrtPriceLimitX96;
  }

  /// @notice Called by external contracts to access transient storage of the contract
  /// @param slot Key of slot to tload
  /// @return value The value of the slot as bytes32
  function exttload(bytes32 slot) external view returns (bytes32 value);

  /// @notice All interactions on the contract that account deltas require unlocking. A caller that calls `unlock` must implement
  /// `IUnlockCallback(msg.sender).unlockCallback(data)`, where they interact with the remaining functions on this contract.
  /// @dev The only functions callable without an unlocking are `initialize` and `updateDynamicLPFee`
  /// @param data Any data to pass to the callback, via `IUnlockCallback(msg.sender).unlockCallback(data)`
  /// @return The data returned by the call to `IUnlockCallback(msg.sender).unlockCallback(data)`
  function unlock(bytes calldata data) external returns (bytes memory);

  /// @notice Called by the user to net out some value owed to the user
  /// @dev Can also be used as a mechanism for _free_ flash loans
  /// @param currency The currency to withdraw from the pool manager
  /// @param to The address to withdraw to
  /// @param amount The amount of currency to withdraw
  function take(Currency currency, address to, uint256 amount) external;

  /// @notice Swap against the given pool
  /// @param key The pool to swap in
  /// @param params The parameters for swapping
  /// @param hookData The data to pass through to the swap hooks
  /// @return swapDelta The balance delta of the address swapping
  /// @dev Swapping on low liquidity pools may cause unexpected swap amounts when liquidity available is less than amountSpecified.
  /// Additionally note that if interacting with hooks that have the BEFORE_SWAP_RETURNS_DELTA_FLAG or AFTER_SWAP_RETURNS_DELTA_FLAG
  /// the hook may alter the swap input/output. Integrators should perform checks on the returned swapDelta.
  function swap(PoolKey memory key, SwapParams memory params, bytes calldata hookData)
      external
      returns (BalanceDelta swapDelta);

  /// @notice Called by the user to pay what is owed
  /// @return paid The amount of currency settled
  function settle() external payable returns (uint256 paid);

  /// @notice Writes the current ERC20 balance of the specified currency to transient storage
  /// This is used to checkpoint balances for the manager and derive deltas for the caller.
  /// @dev This MUST be called before any ERC20 tokens are sent into the contract, but can be skipped
  /// for native tokens because the amount to settle is determined by the sent value.
  /// @param currency The currency whose balance to sync
  function sync(Currency currency) external;
}

library PoolManagerAdditionalLibrary {
  using PoolManagerAdditionalLibrary for IPoolManager;

    /// @notice Get the current delta for a caller in the given currency
    /// @param target The credited account address
    /// @param currency The currency for which to lookup the delta
    function currencyDelta(IPoolManager manager, Currency currency, address target) internal view returns (int256) {
        bytes32 key;
        assembly {
            mstore(0, and(target, 0xffffffffffffffffffffffffffffffffffffffff))
            mstore(32, and(currency, 0xffffffffffffffffffffffffffffffffffffffff))
            key := keccak256(0, 64)
        }
        return int256(uint256(manager.exttload(key)));
    }

    function settle(IPoolManager manager, Currency currency, uint256 amount) internal {
      if (Currency.unwrap(currency) == address(0)) {
        // This is native for UniV4
        manager.settle{value: amount}();
      } else {
          manager.sync(currency);
          // if (payer != address(this)) {
          //   // TODO: Dangerous!!! To use transient storage? Or send to RP first
          //     IERC20Minimal(Currency.unwrap(currency)).transferFrom(payer, address(manager), amount);
          // } else {
            // TODO: possible optimization - 1 transfer instead of 2
              IERC20(Currency.unwrap(currency)).transfer(address(manager), amount);
          // }
          manager.settle();
      }
    }
}