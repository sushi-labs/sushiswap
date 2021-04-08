// SPDX-License-Identifier: agpl-3.0
pragma solidity ^0.6.8;

contract DummySUSHI {
    uint256 t;
    mapping (address => uint256) b;
    mapping (address => mapping (address => uint256)) a;

    string public name;
    string public symbol;
    uint public decimals;

    function myAddress() public view returns (address) {
        return address(this);
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint c = a + b;

        require (c >= a);

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require (a >= b);

        return a - b;
    }

    function totalSupply() external view returns (uint256) {
        return t;
    }

    function balanceOf(address account) external view returns (uint256) {
        return b[account];
    }

    function transfer(address recipient, uint256 amount) external returns (bool) {
        b[msg.sender] = sub(b[msg.sender], amount);
        b[recipient] = add(b[recipient], amount);

        return true;
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return a[owner][spender];
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        a[msg.sender][spender] = amount;

        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        b[sender] = sub(b[sender], amount);
        b[recipient] = add(b[recipient], amount);
        a[sender][msg.sender] = sub(a[sender][msg.sender], amount);
        
        return true;
    }
}