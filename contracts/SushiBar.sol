pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract SushiBar {
    using SafeMath for uint256;

    IERC20 public sushi;
    mapping (address => uint256) public shares;
    uint256 public totalShares;

    constructor(IERC20 _sushi) public {
        sushi = _sushi;
    }

    // Enter the bar. Pay some SUSHIs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalSushi = sushi.balanceOf(address(this));
        if (totalShares == 0 || totalSushi == 0) {
            shares[msg.sender] = _amount;
            totalShares = _amount;
        } else {
            uint256 what = _amount.mul(totalShares).div(totalSushi);
            shares[msg.sender] = shares[msg.sender].add(what);
            totalShares = totalShares.add(what);
        }
        sushi.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SUSHIs.
    function leave(uint256 _share) public {
        uint256 what = _share.mul(sushi.balanceOf(address(this))).div(totalShares);
        shares[msg.sender] = shares[msg.sender].sub(_share);
        totalShares = totalShares.sub(_share);
        sushi.transfer(msg.sender, what);
    }
}