// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// SuwpBar is the coolest bar in town. You come in with some SUWP, and leave with more! The longer you stay, the more SUWP you get.
//
// This contract handles swapping to and from xSuwp, SuwpSwap's staking token.
contract SuwpBar is ERC20("SuwpBar", "xSUWP"){
    using SafeMath for uint256;
    IERC20 public SUWP;

    // Define the SUWP token contract
    constructor(IERC20 _suwp) public {
        SUWP = _suwp;
    }

    // Enter the bar. Pay some SUWPs. Earn some shares.
    // Locks SUWP and mints xSuwp
    function enter(uint256 _amount) public {
        // Gets the amount of SUWP locked in the contract
        uint256 totalSuwp = SUWP.balanceOf(address(this));
        // Gets the amount of xSuwp in existence
        uint256 totalShares = totalSupply();
        // If no xSuwp exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalSuwp == 0) {
            _mint(msg.sender, _amount);
        }
        // Calculate and mint the amount of xSuwp the SUWP is worth. The ratio will change overtime, as xSuwp is burned/minted and SUWP deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalSuwp);
            _mint(msg.sender, what);
        }
        // Lock the SUWP in the contract
        SUWP.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SUWPs.
    // Unlocks the staked + gained SUWP and burns xSuwp
    function leave(uint256 _share) public {
        // Gets the amount of xSuwp in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of SUWP the xSuwp is worth
        uint256 what = _share.mul(SUWP.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        SUWP.transfer(msg.sender, what);
    }
}
