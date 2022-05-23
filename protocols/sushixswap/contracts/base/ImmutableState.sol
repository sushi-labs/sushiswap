// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "../interfaces/IImmutableState.sol";

abstract contract ImmutableState is IImmutableState {
    IBentoBoxMinimal public immutable override bentoBox;
    IStargateRouter public immutable override stargateRouter;
    address public immutable override factory;
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
