// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "../interfaces/stargate/IStargateAdapter.sol";

/// @title StargateAdapter
/// @notice Adapter for function used by Stargate Bridge
abstract contract StargateAdapter is ImmutableState, IStargateReceiver {
    using SafeERC20 for IERC20;

    // Custom Error
    error NotStargateRouter();
    error InsufficientGas();

    // events
    event StargateSushiXSwapSrc(bytes32 indexed srcContext);
    event StargateSushiXSwapDst(bytes32 indexed srcContext, bool failed);

    struct StargateTeleportParams {
        uint16 dstChainId; // stargate dst chain id
        address token; // token getting bridged
        uint256 srcPoolId; // stargate src pool id
        uint256 dstPoolId; // stargate dst pool id
        uint256 amount; // amount to bridge
        uint256 amountMin; // amount to bridge minimum
        uint256 dustAmount; // native token to be received on dst chain
        address receiver; // sushiXswap on dst chain
        address to; // receiver bridge token incase of transaction reverts on dst chain
        uint256 gas; // extra gas to be sent for dst chain operations
        bytes32 srcContext; // random bytes32 as source context
    }

    /// @notice Approves token to the Stargate Router
    /// @param token token to approve
    function approveToStargateRouter(IERC20 token) external {
        token.safeApprove(address(stargateRouter), type(uint256).max);
    }

    /// @notice Bridges the token to dst chain using Stargate Router
    /// @dev It is hardcoded to use all the contract balance. Only call this as the last step.
    /// The refund address for extra fees sent it msg.sender.
    /// @param params required by the Stargate, can be found at StargateTeleportParams struct.
    /// @param actions An array with a sequence of actions to execute (see ACTION_ declarations).
    /// @param values A one-to-one mapped array to `actions`. Native token amount to send along action.
    /// @param datas A one-to-one mapped array to `actions`. Contains abi encoded data of function arguments.
    function _stargateTeleport(
        StargateTeleportParams memory params,
        uint8[] memory actions,
        uint256[] memory values,
        bytes[] memory datas
    ) internal {
        bytes memory payload = abi.encode(params.to, actions, values, datas, params.srcContext);

        /// @dev dst gas should be more than 100k
        if(params.gas < 100000) revert InsufficientGas();

        stargateRouter.swap{value: address(this).balance}(
            params.dstChainId,
            params.srcPoolId,
            params.dstPoolId,
            payable(msg.sender), // refund address
            params.amount != 0
                ? params.amount
                : IERC20(params.token).balanceOf(address(this)),
            params.amountMin,
            IStargateRouter.lzTxObj(
                params.gas, // extra gas to be sent for dst execution
                params.dustAmount,
                abi.encodePacked(params.receiver)
            ),
            abi.encodePacked(params.receiver), // sushiXswap on the dst chain
            payload
        );

        stargateWidget.partnerSwap(0x0001);

        emit StargateSushiXSwapSrc(params.srcContext);
    }

    /// @notice Get the fees to be paid in native token for the swap
    /// @param _dstChainId stargate dst chainId
    /// @param _functionType stargate Function type 1 for swap.
    /// See more at https://stargateprotocol.gitbook.io/stargate/developers/function-types
    /// @param _receiver sushiXswap on the dst chain
    /// @param _gas extra gas being sent
    /// @param _dustAmount dust amount to be received at the dst chain
    /// @param _payload payload being sent at the dst chain
    function getFee(
        uint16 _dstChainId,
        uint8 _functionType,
        address _receiver,
        uint256 _gas,
        uint256 _dustAmount,
        bytes memory _payload
    ) external view returns (uint256 a, uint256 b) {
        (a, b) = stargateRouter.quoteLayerZeroFee(
            _dstChainId,
            _functionType,
            abi.encodePacked(_receiver),
            abi.encode(_payload),
            IStargateRouter.lzTxObj(
                _gas,
                _dustAmount,
                abi.encodePacked(_receiver)
            )
        );
    }

    /// @notice Receiver function on dst chain
    /// @param _token bridge token received
    /// @param amountLD amount received
    /// @param payload ABI-Encoded data received from src chain
    function sgReceive(
        uint16,
        bytes memory,
        uint256,
        address _token,
        uint256 amountLD,
        bytes memory payload
    ) external override {
        if (msg.sender != address(stargateRouter)) revert NotStargateRouter();

        (
            address to,
            uint8[] memory actions,
            uint256[] memory values,
            bytes[] memory datas,
            bytes32 srcContext
        ) = abi.decode(payload, (address, uint8[], uint256[], bytes[], bytes32));

        uint256 reserveGas = 100000;
        bool failed;

        if(gasleft() < reserveGas) {
            IERC20(_token).safeTransfer(to, amountLD);
            failed = true;
            emit StargateSushiXSwapDst(srcContext, failed);
            return;
        }

        // 100000 -> exit gas
        uint256 limit = gasleft() - reserveGas;

        /// @dev incase the actions fail, transfer bridge token to the to address
        try
            ISushiXSwap(payable(address(this))).cook{gas: limit}(
                actions,
                values,
                datas
            )
        {} catch (bytes memory) {
            IERC20(_token).safeTransfer(to, amountLD);
            failed = true;
        }

        /// @dev transfer any native token received as dust to the to address
        if (address(this).balance > 0)
            to.call{value: (address(this).balance)}("");

        emit StargateSushiXSwapDst(srcContext, failed);

    }
}