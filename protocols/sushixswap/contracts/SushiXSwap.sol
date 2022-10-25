// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "./interfaces/ISushiXSwap.sol";

/// @title SushiXSwap
/// @notice Enables cross chain swap for sushiswap.
/// @dev Supports both BentoBox and Wallet. Supports both Trident and Legacy AMM. Uses Stargate as bridge.
contract SushiXSwap is
    ISushiXSwap,
    BentoAdapter,
    TokenAdapter,
    SushiLegacyAdapter,
    TridentSwapAdapter,
    StargateAdapter
{
    constructor(
        IBentoBoxMinimal _bentoBox,
        IStargateRouter _stargateRouter,
        address _factory,
        bytes32 _pairCodeHash,
        IStargateWidget _stargateWidget
    ) ImmutableState(_bentoBox, _stargateRouter, _factory, _pairCodeHash, _stargateWidget) {
        // Register to BentoBox
        _bentoBox.registerProtocol();
    }

    /// @notice List of ACTIONS supported by the `cook()`.

    // Bento and Token Operations
    uint8 internal constant ACTION_MASTER_CONTRACT_APPROVAL = 0;
    uint8 internal constant ACTION_SRC_DEPOSIT_TO_BENTOBOX = 1;
    uint8 internal constant ACTION_SRC_TRANSFER_FROM_BENTOBOX = 2;
    uint8 internal constant ACTION_DST_DEPOSIT_TO_BENTOBOX = 3;
    uint8 internal constant ACTION_DST_WITHDRAW_TOKEN = 4;
    uint8 internal constant ACTION_DST_WITHDRAW_OR_TRANSFER_FROM_BENTOBOX = 5;
    uint8 internal constant ACTION_UNWRAP_AND_TRANSFER = 6;

    // Swap Operations
    uint8 internal constant ACTION_LEGACY_SWAP = 7;
    uint8 internal constant ACTION_TRIDENT_SWAP = 8;
    uint8 internal constant ACTION_TRIDENT_COMPLEX_PATH_SWAP = 9;

    // Bridge Operations
    uint8 internal constant ACTION_STARGATE_TELEPORT = 10;

    uint8 internal constant ACTION_SRC_TOKEN_TRANSFER = 11;

    uint8 internal constant ACTION_WRAP_TOKEN = 12;

    /// @notice Executes a set of actions and allows composability (contract calls) to other contracts.
    /// @param actions An array with a sequence of actions to execute (see ACTION_ declarations).
    /// @param values A one-to-one mapped array to `actions`. Native token amount to send along action.
    /// @param datas A one-to-one mapped array to `actions`. Contains abi encoded data of function arguments.
    /// @dev The function gets invoked both at the src and dst chain.
    function cook(
        uint8[] memory actions,
        uint256[] memory values,
        bytes[] memory datas
    ) public payable override {
        uint256 actionLength = actions.length;
        for (uint256 i; i < actionLength; i = _increment(i)) {
            uint8 action = actions[i];
            // update for total amounts in contract?
            if (action == ACTION_MASTER_CONTRACT_APPROVAL) {
                (
                    address user,
                    bool approved,
                    uint8 v,
                    bytes32 r,
                    bytes32 s
                ) = abi.decode(
                        datas[i],
                        (address, bool, uint8, bytes32, bytes32)
                    );

                bentoBox.setMasterContractApproval(
                    user,
                    address(this),
                    approved,
                    v,
                    r,
                    s
                );
            } else if (action == ACTION_SRC_DEPOSIT_TO_BENTOBOX) {
                (address token, address to, uint256 amount, uint256 share) = abi
                    .decode(datas[i], (address, address, uint256, uint256));
                _depositToBentoBox(
                    token,
                    msg.sender,
                    to,
                    amount,
                    share,
                    values[i]
                );
            } else if (action == ACTION_SRC_TRANSFER_FROM_BENTOBOX) {
                (
                    address token,
                    address to,
                    uint256 amount,
                    uint256 share,
                    bool unwrapBento
                ) = abi.decode(
                        datas[i],
                        (address, address, uint256, uint256, bool)
                    );
                _transferFromBentoBox(
                    token,
                    msg.sender,
                    to,
                    amount,
                    share,
                    unwrapBento
                );
            } else if (action == ACTION_SRC_TOKEN_TRANSFER) {
                (address token, address to, uint256 amount) = abi.decode(
                    datas[i],
                    (address, address, uint256)
                );

                _transferFromToken(IERC20(token), to, amount);
            } else if (action == ACTION_DST_DEPOSIT_TO_BENTOBOX) {
                (address token, address to, uint256 amount, uint256 share) = abi
                    .decode(datas[i], (address, address, uint256, uint256));

                if (amount == 0) {
                    amount = IERC20(token).balanceOf(address(this));
                    // Stargate Router doesn't support value? Should we update it anyway?
                    // values[i] = address(this).balance;
                }

                _transferTokens(IERC20(token), address(bentoBox), amount);

                _depositToBentoBox(
                    token,
                    address(bentoBox),
                    to,
                    amount,
                    share,
                    values[i]
                );
            } else if (action == ACTION_DST_WITHDRAW_TOKEN) {
                (address token, address to, uint256 amount) = abi.decode(
                    datas[i],
                    (address, address, uint256)
                );
                if (amount == 0) {
                    if (token != address(0)) {
                        amount = IERC20(token).balanceOf(address(this));
                    } else {
                        amount = address(this).balance;
                    }
                }
                _transferTokens(IERC20(token), to, amount);
            } else if (
                action == ACTION_DST_WITHDRAW_OR_TRANSFER_FROM_BENTOBOX
            ) {
                (
                    address token,
                    address to,
                    uint256 amount,
                    uint256 share,
                    bool unwrapBento
                ) = abi.decode(
                        datas[i],
                        (address, address, uint256, uint256, bool)
                    );
                if (amount == 0 && share == 0) {
                    share = bentoBox.balanceOf(token, address(this));
                }
                _transferFromBentoBox(
                    token,
                    address(this),
                    to,
                    amount,
                    share,
                    unwrapBento
                );
            } else if (action == ACTION_UNWRAP_AND_TRANSFER) {
                (address token, address to) = abi.decode(
                    datas[i],
                    (address, address)
                );

                _unwrapTransfer(token, to);
            } else if (action == ACTION_WRAP_TOKEN) {
                (address token, uint256 amount) = abi.decode(
                    datas[i],
                    (address, uint256)
                );

                _wrapToken(token, amount);
            } else if (action == ACTION_LEGACY_SWAP) {
                (
                    uint256 amountIn,
                    uint256 amountOutMin,
                    address[] memory path,
                    address to
                ) = abi.decode(
                        datas[i],
                        (uint256, uint256, address[], address)
                    );
                bool sendTokens;
                if (amountIn == 0) {
                    amountIn = IERC20(path[0]).balanceOf(address(this));
                    sendTokens = true;
                }
                _swapExactTokensForTokens(
                    amountIn,
                    amountOutMin,
                    path,
                    to,
                    sendTokens
                );
            } else if (action == ACTION_TRIDENT_SWAP) {
                ExactInputParams memory params = abi.decode(
                    datas[i],
                    (ExactInputParams)
                );

                _exactInput(params);
            } else if (action == ACTION_TRIDENT_COMPLEX_PATH_SWAP) {
                ComplexPathParams memory params = abi.decode(
                    datas[i],
                    (ComplexPathParams)
                );

                _complexPath(params);
            } else if (action == ACTION_STARGATE_TELEPORT) {
                (
                    StargateTeleportParams memory params,
                    uint8[] memory actionsDST,
                    uint256[] memory valuesDST,
                    bytes[] memory datasDST
                ) = abi.decode(
                        datas[i],
                        (StargateTeleportParams, uint8[], uint256[], bytes[])
                    );

                _stargateTeleport(params, actionsDST, valuesDST, datasDST);
            }
        }
    }

    /// @notice Allows the contract to receive Native tokens
    receive() external payable {}
}