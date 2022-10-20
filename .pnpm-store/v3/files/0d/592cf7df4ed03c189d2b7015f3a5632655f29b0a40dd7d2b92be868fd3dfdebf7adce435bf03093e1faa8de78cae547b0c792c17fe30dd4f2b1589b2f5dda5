// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >= 0.8.0;

import "../libraries/Transfer.sol";

contract TransferMock {
    function safeApprove(
        address token,
        address to,
        uint256 value
    ) external {
        Transfer.safeApprove(token, to, value);
    }

    function safeTransfer(
        address token,
        address to,
        uint256 value
    ) external {
        Transfer.safeTransfer(token, to, value);
    }

    function safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) external {
        Transfer.safeTransferFrom(token, from, to, value);
    }

    function safeTransferETH(address to, uint256 value) external {
        Transfer.safeTransferETH(to, value);
    }
}