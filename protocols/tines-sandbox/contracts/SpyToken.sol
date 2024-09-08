// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Special token for tests. Logs all balanceOf, transfer and transferfrom tokens
// Allowance is always max
contract SpyToken {
    mapping(address => uint256) private _balance;
    address[] public unknownBalances;

    constructor() {}

    function name() public pure returns (string memory) {
        return "Test";
    }
    function symbol() public pure returns (string memory) {
        return "TEST";
    }
    function decimals() public pure returns (uint8) {
        return 18;
    }
    function totalSupply() public pure returns (uint256) {
        return 1<<250;
    }
    function transfer(address to, uint256 amount) public virtual returns (bool) {
        return transferFrom(msg.sender, to, amount);
    }
    function allowance() public pure returns (uint256) {
        return 1<<250;
    }
    function approve() public pure returns (bool) {
        return true;
    }

    function balanceOf(address account) public returns (uint256) {
        if (_balance[account] == 0) unknownBalances.push(account);
        return _balance[account];
    }
    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        if (amount > _balance[from]) unknownBalances.push(from);
        else _balance[from] -= amount;
        _balance[to] += amount;
        return true;
    }
    function mint(address to, uint256 amount) public {
        _balance[to] += amount;
    }
}