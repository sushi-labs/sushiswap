pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./SakeToken.sol";

contract DevFunds {
    using SafeMath for uint;

    // the sake token
    SakeToken public sake;
    // dev address to receive sake
    address public devaddr;
    // last withdraw block
    uint public lastWithdrawBlock;
    // withdraw interval about 1 month
    uint public constant WITHDRAW_INTERVAL = 194800;
    // max amount of sake per withdraw
    uint public constant WITHDRAW_MAX = 68*10**22;

    constructor(SakeToken _sake, address _devaddr) public {
        require(address(_sake) != address(0) && _devaddr != address(0), "invalid address");
        sake = _sake;
        devaddr = _devaddr;
        lastWithdrawBlock = block.number;
    }

    function withdraw() public {
        uint unlockBlock = lastWithdrawBlock.add(WITHDRAW_INTERVAL);
        require(block.number >= unlockBlock, "sake locked");
        uint _amount = sake.balanceOf(address(this));
        uint amountReal = _amount > WITHDRAW_MAX ? WITHDRAW_MAX : _amount;
        require(amountReal > 0, "zero sake amount");
        lastWithdrawBlock = block.number;
        sake.transfer(devaddr, amountReal);
    }
}