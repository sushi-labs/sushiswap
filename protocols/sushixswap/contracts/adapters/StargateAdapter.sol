// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "../interfaces/stargate/IStargateAdapter.sol";

abstract contract StargateAdapter is ImmutableState, IStargateReceiver {
    using SafeERC20 for IERC20;

    struct TeleportParams {
        uint16 dstChainId;
        address token;
        uint256 srcPoolId;
        uint256 dstPoolId;
        uint256 amount;
        uint256 amountMin;
        uint256 dustAmount;
        address receiver;
        address to;
        uint256 gas;
    }

    function approveToStargateRouter(IERC20 token) external {
        token.safeApprove(address(stargateRouter), type(uint256).max);
    }

    function _stargateTeleport(
        TeleportParams memory params,
        uint8[] memory actions,
        uint256[] memory values,
        bytes[] memory datas
    ) internal {
        bytes memory payload = abi.encode(params.to, actions, values, datas);

        stargateRouter.swap{value: address(this).balance}(
            params.dstChainId,
            params.srcPoolId,
            params.dstPoolId,
            payable(msg.sender),
            params.amount != 0
                ? params.amount
                : IERC20(params.token).balanceOf(address(this)),
            params.amountMin,
            IStargateRouter.lzTxObj(
                params.gas,
                params.dustAmount,
                abi.encodePacked(params.receiver)
            ),
            abi.encodePacked(params.receiver),
            payload
        );
    }

    function sgReceive(
        uint16,
        bytes memory,
        uint256,
        address _token,
        uint256 amountLD,
        bytes memory payload
    ) external override {
        require(
            msg.sender == address(stargateRouter),
            "Caller not Stargate Router"
        );

        (
            address to,
            uint8[] memory actions,
            uint256[] memory values,
            bytes[] memory datas
        ) = abi.decode(payload, (address, uint8[], uint256[], bytes[]));

        try
            ISushiXSwap(payable(address(this))).cook(actions, values, datas)
        {} catch (bytes memory) {
            IERC20(_token).transfer(to, amountLD);
        }

        if (address(this).balance > 0)
            payable(to).transfer(address(this).balance);
    }
}
