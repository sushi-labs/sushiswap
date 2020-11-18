// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

// a library for performing overflow-safe math, updated with awesomeness from of DappHub (https://github.com/dapphub/ds-math)
library BoringMath {
    function add(uint a, uint b) internal pure returns (uint c) {require((c = a + b) >= b, "BoringMath: Add Overflow");}
    function sub(uint a, uint b) internal pure returns (uint c) {require((c = a - b) <= a, "BoringMath: Underflow");}
    function mul(uint a, uint b) internal pure returns (uint c) {require(a == 0 || (c = a * b)/b == a, "BoringMath: Mul Overflow");}
}

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

// Data part taken out for building of contracts that receive delegate calls
contract ERC20Data {
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping (address => uint256)) allowance;
}

contract ERC20 is ERC20Data {
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function transfer(address to, uint256 amount) public returns (bool success) {
        if (balanceOf[msg.sender] >= amount && amount > 0 && balanceOf[to] + amount > balanceOf[to]) {
            balanceOf[msg.sender] -= amount;
            balanceOf[to] += amount;
            emit Transfer(msg.sender, to, amount);
            return true;
        } else {
            return false;
        }
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool success) {
        if (balanceOf[from] >= amount && allowance[from][msg.sender] >= amount && amount > 0 && balanceOf[to] + amount > balanceOf[to]) {
            balanceOf[from] -= amount;
            allowance[from][msg.sender] -= amount;
            balanceOf[to] += amount;
            emit Transfer(from, to, amount);
            return true;
        } else {
            return false;
        }
    }

    function approve(address spender, uint256 amount) public returns (bool success) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
}

contract SushiBar is ERC20 {
    using BoringMath for uint256;
    
    string public name = "SushiBar V2";
    string public symbol = "xSUSHI2";
    uint8 public decimals = 18;
    IERC20 public sushi = IERC20(0x6B3595068778DD592e39A122f4f5a5cF09C90fE2);
    IERC20 public dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public claimed;

    event Enter(address indexed owner, address indexed to, uint256 amount);
    event Leave(address indexed owner, address indexed to, uint256 amount);
    event Claim(address indexed owner, address indexed to, uint256 amount);

    function pending(address owner) public view returns(uint256) {
        // Reward calculation:
        //    amount     now - startTime   
        // ----------- * --------------- * total extra SUSHI
        // totalSupply       356 days
        uint256 duration = block.timestamp.sub(startTime[owner]);
        if (duration < 365 days) {
            return balanceOf[owner].mul(duration).mul(dai.totalSupply()) / 365 days / totalSupply;
        } else {
            return balanceOf[owner].mul(dai.totalSupply()) / totalSupply;
        }
    }

    function enter(uint256 amount, address to) public {
        uint256 startTimeCurrent = startTime[to];
        uint256 balanceCurrent = balanceOf[to];
        if (balanceCurrent == 0) {
            // If there is no balance, startTime is now
            startTime[to] = block.timestamp;
        } else {
            // If there is already a balance:
            // Increase startTime by: amount / (balance + amount) * (now - startTime)
            // If you added 100 SUSHI 3 momnths ago and you add 200 SUSHI now, startTime should become 1 month ago
            startTime[to] = startTimeCurrent.add(amount.mul(block.timestamp.sub(startTimeCurrent) / (balanceCurrent.add(amount))));
        }
        
        totalSupply = totalSupply.add(amount);
        balanceOf[to] = balanceCurrent.add(amount);
        emit Transfer(address(0), to, amount);

        sushi.transferFrom(msg.sender, address(this), amount);
        emit Enter(msg.sender, to, amount);
    }

    function claim(address to) public {
        uint256 claimedCurrent = claimed[msg.sender];
        uint256 amount = pending(msg.sender).sub(claimedCurrent);
        claimed[msg.sender] = claimedCurrent.add(amount);

        dai.transfer(to, amount);
        emit Claim(msg.sender, to, amount);
    }

    function leave(uint256 amount, address to) public {
        claim(to);

        balanceOf[msg.sender] = balanceOf[msg.sender].sub(amount);
        totalSupply = totalSupply.sub(amount);
        emit Transfer(to, address(0), amount);
        
        claimed[msg.sender] = pending(msg.sender);

        sushi.transfer(to, amount);
        emit Leave(msg.sender, to, amount);
    }
}
