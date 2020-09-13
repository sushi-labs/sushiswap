pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./SakeToken.sol";

contract DevFunds {
    using SafeMath for uint;

    // the sake token
    SakeToken public sake;
    // dev address to receive sake
    address public devaddr;
    // last withdraw block, use sakeswap online block as default
    uint public lastWithdrawBlock = 10821000;
    // withdraw interval ~ 2 weeks
    uint public constant WITHDRAW_INTERVAL = 89600;
    // current total amount bigger than the threshold, withdraw half, otherwise withdraw all
    uint public constant WITHDRAW_HALF_THRESHOLD = 89600*10**18;

    constructor(SakeToken _sake, address _devaddr) public {
        require(address(_sake) != address(0) && _devaddr != address(0), "invalid address");
        sake = _sake;
        devaddr = _devaddr;
    }

    function withdraw() public {
        uint unlockBlock = lastWithdrawBlock.add(WITHDRAW_INTERVAL);
        require(block.number >= unlockBlock, "sake locked");
        uint _amount = sake.balanceOf(address(this));
        require(_amount > 0, "zero sake amount");
        uint amountReal = _amount;
        if (_amount > WITHDRAW_HALF_THRESHOLD) amountReal = _amount.div(2);
        lastWithdrawBlock = block.number;
        sake.transfer(devaddr, amountReal);
    }
}