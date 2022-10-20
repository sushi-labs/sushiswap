// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >= 0.8.0;

contract ERC20Noncompliant {
    bool public shouldRevert;

    function setup(bool shouldRevert_) external {
        shouldRevert = shouldRevert_;
    }

    function transfer(address, uint256) external view {
        require(!shouldRevert);
    }

    function transferFrom(
        address,
        address,
        uint256
    ) external view {
        require(!shouldRevert);
    }

    function approve(address, uint256) external view {
        require(!shouldRevert);
    }
}