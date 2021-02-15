// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// SwipeBar is the coolest bar in town. You come in with some Swipe, and leave with more! The longer you stay, the more Swipe you get.
//
// This contract handles swapping to and from xSwipe, SwipeSwap's staking token.
contract SwipeBar is ERC20("SwipeBar", "xSWIPE"){
    using SafeMath for uint256;
    IERC20 public swipe;

    // Define the Swipe token contract
    constructor(IERC20 _swipe) public {
        swipe = _swipe;
    }

    // Enter the bar. Pay some SWIPEs. Earn some shares.
    // Locks Swipe and mints xSwipe
    function enter(uint256 _amount) public {
        // Gets the amount of Swipe locked in the contract
        uint256 totalSwipe = swipe.balanceOf(address(this));
        // Gets the amount of xSwipe in existence
        uint256 totalShares = totalSupply();
        // If no xSwipe exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalSwipe == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xSwipe the Swipe is worth. The ratio will change overtime, as xSwipe is burned/minted and Swipe deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalSwipe);
            _mint(msg.sender, what);
        }
        // Lock the Swipe in the contract
        swipe.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your SWIPEs.
    // Unclocks the staked + gained Swipe and burns xSwipe
    function leave(uint256 _share) public {
        // Gets the amount of xSwipe in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of Swipe the xSwipe is worth
        uint256 what = _share.mul(swipe.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        swipe.transfer(msg.sender, what);
    }
}