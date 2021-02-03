// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
interface IRewarder {
    function onSushiReward (address user, uint256 sushiAmount) external;
}