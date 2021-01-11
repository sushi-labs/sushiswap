// SPDX-License-Identifier: UNLICENSED

// RevertingERC20 reverts on errors
pragma solidity 0.6.12;

contract RevertingERC20Mock {
	string public symbol;
	string public name;
	uint8 public constant decimals = 18;
	uint256 public totalSupply;
	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) allowance;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);
	event Approval(address indexed _owner, address indexed _spender, uint256 _value);

	constructor(
		string memory name_,
		string memory symbol_,
		uint256 supply
	) public {
		name = name_;
		symbol = symbol_;
		totalSupply = supply;
		balanceOf[msg.sender] = supply;
	}

	function transfer(address to, uint256 amount) public returns (bool success) {
		require(balanceOf[msg.sender] >= amount, "TokenB: balance too low");
		require(amount >= 0, "TokenB: amount should be > 0");
		require(balanceOf[to] + amount >= balanceOf[to], "TokenB: overflow detected");
		balanceOf[msg.sender] -= amount;
		balanceOf[to] += amount;
		emit Transfer(msg.sender, to, amount);
		return true;
	}

	function transferFrom(
		address from,
		address to,
		uint256 amount
	) public returns (bool success) {
		require(balanceOf[from] >= amount, "TokenB: balance too low");
		require(allowance[from][msg.sender] >= amount, "TokenB: allowance too low");
		require(amount >= 0, "TokenB: amount should be >= 0");
		require(balanceOf[to] + amount >= balanceOf[to], "TokenB: overflow detected");
		balanceOf[from] -= amount;
		allowance[from][msg.sender] -= amount;
		balanceOf[to] += amount;
		emit Transfer(from, to, amount);
		return true;
	}

	function approve(address spender, uint256 amount) public returns (bool success) {
		allowance[msg.sender][spender] = amount;
		emit Approval(msg.sender, spender, amount);
		return true;
	}
}