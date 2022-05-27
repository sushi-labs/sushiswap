// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "./interfaces/ISushiXSwap.sol";

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
        bytes32 _pairCodeHash
    ) ImmutableState(_bentoBox, _stargateRouter, _factory, _pairCodeHash) {
        _bentoBox.registerProtocol();
    }

    // ACTION_LIST
    uint8 constant MASTER_CONTRACT_APPROVAL = 0;
    uint8 constant SRC_DEPOSIT_TO_BENTOBOX = 1;
    uint8 constant SRC_TRANSFER_FROM_BENTOBOX = 2;
    uint8 constant DST_DEPOSIT_TO_BENTOBOX = 3;
    uint8 constant DST_WITHDRAW_TOKEN = 4;
    uint8 constant DST_WITHDRAW_FROM_BENTOBOX = 5;
    uint8 constant UNWRAP_AND_TRANSFER = 6;
    uint8 constant LEGACY_SWAP = 7;
    uint8 constant TRIDENT_SWAP = 8;
    uint8 constant TRIDENT_COMPLEX_PATH_SWAP = 9;
    uint8 constant STARGATE_TELEPORT = 10;

    function cook(
        uint8[] memory actions,
        uint256[] memory values,
        bytes[] memory datas
    ) public payable override {
        for (uint256 i = 0; i < actions.length; i++) {
            uint8 action = actions[i];
            // update for total amounts in contract?
            if (action == MASTER_CONTRACT_APPROVAL) {
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
            } else if (action == SRC_DEPOSIT_TO_BENTOBOX) {
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
            } else if (action == SRC_TRANSFER_FROM_BENTOBOX) {
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
            } else if (action == DST_DEPOSIT_TO_BENTOBOX) {
                (address token, address to, uint256 amount, uint256 share) = abi
                    .decode(datas[i], (address, address, uint256, uint256));

                if (amount == 0) {
                    amount = IERC20(token).balanceOf(address(this));
                    // left values not updates intentionally
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
            } else if (action == DST_WITHDRAW_TOKEN) {
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
            } else if (action == DST_WITHDRAW_FROM_BENTOBOX) {
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
                if (amount == 0) {
                    amount = IERC20(token).balanceOf(address(this));
                }
                _transferFromBentoBox(
                    token,
                    address(this),
                    to,
                    amount,
                    share,
                    unwrapBento
                );
            } else if (action == UNWRAP_AND_TRANSFER) {
                (address token, address to) = abi.decode(
                    datas[i],
                    (address, address)
                );

                _unwrapTransfer(token, to);
            } else if (action == LEGACY_SWAP) {
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
            } else if (action == TRIDENT_SWAP) {
                ExactInputParams memory params = abi.decode(
                    datas[i],
                    (ExactInputParams)
                );

                _exactInput(params);
            } else if (action == TRIDENT_COMPLEX_PATH_SWAP) {
                ComplexPathParams memory params = abi.decode(
                    datas[i],
                    (ComplexPathParams)
                );

                _complexPath(params);
            } else if (action == STARGATE_TELEPORT) {
                (
                    TeleportParams memory params,
                    uint8[] memory actionsDST,
                    uint256[] memory valuesDST,
                    bytes[] memory datasDST
                ) = abi.decode(
                        datas[i],
                        (TeleportParams, uint8[], uint256[], bytes[])
                    );

                _stargateTeleport(params, actionsDST, valuesDST, datasDST);
            }
        }
    }

    receive() external payable {}
}
