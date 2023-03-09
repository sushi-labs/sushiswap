// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.10;

import "../interfaces/ITasker.sol";

contract TaskReceiverMock is ITasker {

    function onTaskReceived(bytes memory taskData) external override {
        
    }

}