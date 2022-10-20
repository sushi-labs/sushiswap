// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "../ERC20.sol";

contract MockERC20 is ERC20 {
    uint256 public totalSupply;

    constructor(uint256 _initialAmount) public {
        // Give the creator all initial tokens
        balanceOf[msg.sender] = _initialAmount;
        // Update total supply
        totalSupply = _initialAmount;
    }

    function DOMAIN_SEPARATOR() public view returns (bytes32) {
        return _domainSeparator();
    }
}
