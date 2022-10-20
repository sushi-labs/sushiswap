// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >= 0.8.0;

contract ERC20Compliant {
    bool public success;
    bool public shouldRevert;

    function setup(bool success_, bool shouldRevert_) external {
        success = success_;
        shouldRevert = shouldRevert_;
    }

    function transfer(address, uint256) external view returns (bool) {
        require(!shouldRevert, "REVERT");
        return success;
    }

    function transferFrom(
        address,
        address,
        uint256
    ) external view returns (bool) {
        require(!shouldRevert, "REVERT");
        return success;
    }

    function approve(address, uint256) external view returns (bool) {
        require(!shouldRevert, "REVERT");
        return success;
    }
}