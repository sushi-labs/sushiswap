// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../interfaces/IMasterContract.sol";
import "./MockERC20.sol";

contract MockMasterContract is MockERC20(10000), IMasterContract {
    function init(bytes calldata data) public payable override {
        uint256 extraAmount = abi.decode(data, (uint256));

        // Give the caller some extra tokens
        balanceOf[msg.sender] += extraAmount;
        // Update total supply
        totalSupply += extraAmount;
    }

    function getInitData(uint256 extraAmount) public pure returns (bytes memory data) {
        return abi.encode(extraAmount);
    }
}
