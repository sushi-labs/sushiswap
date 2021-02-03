// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
interface IRewarder {
    function onSushiReward (uint256 pid, address user, uint256 sushiAmount) external;
}