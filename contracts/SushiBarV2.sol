// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

// a library for performing overflow-safe math, updated with awesomeness from of DappHub (https://github.com/dapphub/ds-math)
library BoringMath {
    function add(uint a, uint b) internal pure returns (uint c) {require((c = a + b) >= b, "BoringMath: Add Overflow");}
    function sub(uint a, uint b) internal pure returns (uint c) {require((c = a - b) <= a, "BoringMath: Underflow");}
    function mul(uint a, uint b) internal pure returns (uint c) {require(a == 0 || (c = a * b)/b == a, "BoringMath: Mul Overflow");}
}

// Source: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
// Edited by BoringCrypto
// - removed GSN context
// - removed comments (we all know this contract)
// - updated solidity version
// - made _owner public and renamed to owner
// - simplified code
// TODO: Consider using the version that requires acceptance from new owner

contract Ownable {
    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () internal {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function renounceOwnership() public virtual {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        emit OwnershipTransferred(owner, address(0));
        owner = address(0);
    }

    function transferOwnership(address newOwner) public virtual {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
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
    mapping(address => uint256) public nonces;
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

    function DOMAIN_SEPARATOR() public view returns (bytes32){
      uint256 chainId;
      assembly {chainId := chainid()}
      return keccak256(abi.encode(keccak256("EIP712Domain(uint256 chainId,address verifyingContract)"), chainId, address(this)));
    }

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external {
        require(block.timestamp < deadline, 'xSUSHI2: Expired');
        bytes32 digest = keccak256(abi.encodePacked(
            '\x19\x01', DOMAIN_SEPARATOR(),
            keccak256(abi.encode(0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9, owner, spender, value, nonces[owner]++, deadline))
        ));
        address recoveredAddress = ecrecover(digest, v, r, s);
        require(recoveredAddress == owner, 'xSUSHI2: Invalid Signature');
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }
}

contract SushiBar is ERC20, Ownable {
    using BoringMath for uint256;
    
    string public name = "SushiBar V2";
    string public symbol = "xSUSHI2";
    uint8 public decimals = 18;
    IERC20 public sushi = IERC20(0x6B3595068778DD592e39A122f4f5a5cF09C90fE2);
    IERC20 public dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public claimed;
    
    mapping(address => uint256) public bonus;

    event Enter(address indexed owner, address indexed to, uint256 amount);
    event Leave(address indexed owner, address indexed to, uint256 amount);
    event Claim(address indexed owner, address indexed to, uint256 amount);

    function setBonus(address sender, uint256 newBonus) public onlyOwner {
        require(newBonus <= 365 days, "SushiBar: Bonus too large");
        bonus[sender] = newBonus;
    }

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
        uint256 balanceCurrent = balanceOf[to];
        if (balanceCurrent == 0) {
            // If there is no balance, startTime is now
            startTime[to] = block.timestamp.sub(bonus[msg.sender]);
        } else {
            // If there is already a balance:
            // Increase startTime by: amount / (balance + amount) * (now - startTime)
            // If you added 100 SUSHI 3 momnths ago and you add 200 SUSHI now, startTime should become 1 month ago
            uint256 startTimeCurrent = startTime[to];
            uint256 durationCurrent = block.timestamp.sub(startTimeCurrent);
            uint256 bonusTime = bonus[msg.sender];
            if (durationCurrent >= bonusTime) {
                startTime[to] = startTimeCurrent.add(amount.mul(durationCurrent.sub(bonusTime) / (balanceCurrent.add(amount))));
            } else {
                startTime[to] = startTimeCurrent.sub(amount.mul(bonusTime.sub(durationCurrent) / (balanceCurrent.add(amount))));
            }
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
