// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "../abstract/Multicall.sol";

contract MulticallMock is Multicall {
    function functionThatRevertsWithError(string memory error) external pure {
        revert(error);
    }

    function functionThatRevertsWithoutError() external pure {
        revert();
    }

    struct Tuple {
        uint256 a;
        uint256 b;
    }

    function functionThatReturnsTuple(uint256 a, uint256 b) external pure returns (Tuple memory tuple) {
        tuple = Tuple({b: a, a: b});
    }

    uint256 public paid;

    function pays() external payable {
        paid += msg.value;
    }

    function returnSender() external view returns (address) {
        return msg.sender;
    }
}
