// SPDX-License-Identifier: GPL-3.0
pragma solidity =0.6.12;

import "./libraries/SafeMath.sol";

contract SakeSwapSlippageToken {
    using SafeMath for uint;

    string public constant name = "SakeSwap Slippage Token";
    string public constant symbol = "SST";
    uint8 public constant decimals = 18;
    uint  public totalSupply;
    address private _owner;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    modifier onlyOwner() {
        require(_owner == msg.sender, "SlippageToken: Not Owner");
        _;
    }

    constructor(uint initialSupply) public {
        _owner = msg.sender;
        _mint(msg.sender, initialSupply);
    }

    function _mint(address to, uint value) internal {
        totalSupply = totalSupply.add(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(address(0), to, value);
    }

    function _burn(address from, uint value) internal {
        balanceOf[from] = balanceOf[from].sub(value);
        totalSupply = totalSupply.sub(value);
        emit Transfer(from, address(0), value);
    }

    function _approve(address owner, address spender, uint value) private {
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function _transfer(address from, address to, uint value) private {
        balanceOf[from] = balanceOf[from].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(from, to, value);
    }

    function approve(address spender, uint value) external returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function transfer(address to, uint value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) external returns (bool) {
        if (allowance[from][msg.sender] != uint(-1)) {
            allowance[from][msg.sender] = allowance[from][msg.sender].sub(value);
        }
        _transfer(from, to, value);
        return true;
    }

    function mint(address to, uint value) external onlyOwner returns (bool) {
        _mint(to, value);
        return true;
    }

    function burn(address from, uint value) external onlyOwner returns (bool) {
        _burn(from, value);
        return true;
    }
}
