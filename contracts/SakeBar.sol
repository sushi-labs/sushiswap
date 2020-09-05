pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract SakeBar is ERC20("SakeBar", "xSAKE"){
    using SafeMath for uint256;
    IERC20 public sake;

    constructor(IERC20 _sake) public {
        require(address(_sake) != address(0), "invalid address");
        sake = _sake;
    }

    // Enter the bar. Pay some SAKEs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalSake = sake.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalSake == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalSake);
            _mint(msg.sender, what);
        }
        sake.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SAKEs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(sake.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        sake.transfer(msg.sender, what);
    }
}
