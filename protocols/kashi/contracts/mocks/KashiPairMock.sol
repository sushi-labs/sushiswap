// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import "@sushiswap/bentobox-sdk/contracts/IBentoBoxV1.sol";
import "../KashiPair.sol";

contract KashiPairMock is KashiPair {
    constructor(IBentoBoxV1 bentoBox) public KashiPair(bentoBox) {
        return;
    }

    function accrueTwice() public {
        accrue();
        accrue();
    }
}
