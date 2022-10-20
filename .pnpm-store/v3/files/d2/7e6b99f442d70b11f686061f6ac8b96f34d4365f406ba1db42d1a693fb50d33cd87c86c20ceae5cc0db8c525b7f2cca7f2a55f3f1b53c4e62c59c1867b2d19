// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >= 0.8.0;

contract ERC20Fallback {
    bool public shouldRevert;

    function setup(bool shouldRevert_) external {
        shouldRevert = shouldRevert_;
    }

    receive() external payable {
        require(!shouldRevert);
    }

    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}