// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

// temp till there is no official v4-core. TODO: substitute to v4-core

type Currency is address;
type IHooks is address;

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
}

library TransientStateLibrary {
  using TransientStateLibrary for IPoolManager;

     /// @notice Get the current delta for a caller in the given currency
    /// @param target The credited account address
    /// @param currency The currency for which to lookup the delta
    function currencyDelta(IPoolManager manager, address target, Currency currency) internal view returns (int256) {
        bytes32 key;
        assembly ("memory-safe") {
            mstore(0, and(target, 0xffffffffffffffffffffffffffffffffffffffff))
            mstore(32, and(currency, 0xffffffffffffffffffffffffffffffffffffffff))
            key := keccak256(0, 64)
        }
        return int256(uint256(manager.exttload(key)));
    }
}