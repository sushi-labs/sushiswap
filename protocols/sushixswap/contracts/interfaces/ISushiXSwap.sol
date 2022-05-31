// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "../adapters/BentoAdapter.sol";
import "../adapters/TokenAdapter.sol";
import "../adapters/SushiLegacyAdapter.sol";
import "../adapters/TridentSwapAdapter.sol";
import "../adapters/StargateAdapter.sol";

interface ISushiXSwap {
    function cook(
        uint8[] memory actions,
        uint256[] memory values,
        bytes[] memory datas
    ) external payable;
}