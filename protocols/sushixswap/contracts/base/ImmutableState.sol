// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "../interfaces/IImmutableState.sol";

/// @title ImmutableState
/// @notice Stores the immutable state
abstract contract ImmutableState is IImmutableState {
    /// @notice BentoBox token vault
    IBentoBoxMinimal public immutable override bentoBox;

    /// @notice Stargate Router for cross chain interaction
    IStargateRouter public immutable override stargateRouter;

    /// @notice Sushiswap Legacy AMM Factory
    address public immutable override factory;

    /// @notice Sushiswap Legacy AMM PairCodeHash
    bytes32 public immutable override pairCodeHash;

    constructor(
        IBentoBoxMinimal _bentoBox,
        IStargateRouter _stargateRouter,
        address _factory,
        bytes32 _pairCodeHash
    ) {
        bentoBox = _bentoBox;
        stargateRouter = _stargateRouter;
        factory = _factory;
        pairCodeHash = _pairCodeHash;
    }
}