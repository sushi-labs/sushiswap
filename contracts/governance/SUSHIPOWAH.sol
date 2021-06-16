// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "../libraries/SafeMath.sol";
import "../interfaces/IBentoBoxV1.sol";
import "../interfaces/IMasterChef.sol";

interface ICreamRate {
    function exchangeRateStored() external view returns (uint256);
}

contract SUSHIPOWAH {
    using SafeMath for uint256;
  
    IMasterChef chef = IMasterChef(0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd);
    IERC20 pair = IERC20(0x795065dCc9f64b5614C407a6EFDC400DA6221FB0);
    IERC20 bar = IERC20(0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272);
    IERC20 sushi = IERC20(0x6B3595068778DD592e39A122f4f5a5cF09C90fE2);
    IERC20 axSushi = IERC20(0xF256CC7847E919FAc9B808cC216cAc87CCF2f47a); 
    address crxSushi = 0x228619CCa194Fbe3Ebeb2f835eC1eA5080DaFbb2; 
    IBentoBoxV1 bento = IBentoBoxV1(0xF5BCE5077908a1b7370B9ae04AdC565EBd643966);
    
    function name() external pure returns(string memory) { return "SUSHIPOWAH"; }
    function symbol() external pure returns(string memory) { return "SUSHIPOWAH"; }
    function decimals() external pure returns(uint8) { return 18; }
    function allowance(address, address) external pure returns (uint256) { return 0; }
    function approve(address, uint256) external pure returns (bool) { return false; }
    function transfer(address, uint256) external pure returns (bool) { return false; }
    function transferFrom(address, address, uint256) external pure returns (bool) { return false; }

    /// @notice Returns the collective balance for a given `account` of SUSHI staked among protocols with adjustments.
    function balanceOf(address account) external view returns (uint256) {
        uint256 lp_totalSushi = sushi.balanceOf(address(pair));
        uint256 lp_total = pair.totalSupply();
        (uint256 lp_stakedBalance, ) = chef.userInfo(12, account);
        uint256 lp_balance = pair.balanceOf(account).add(lp_stakedBalance);
        uint256 lp_powah = lp_totalSushi.mul(lp_balance) / (lp_total).mul(2); // calculate voting weight adjusted for LP staking
        uint256 collective_xsushi_balance = collectBalances(account); // calculate xSushi staking balances
        uint256 xsushi_powah = sushi.balanceOf(address(bar)).mul(collective_xsushi_balance) / bar.totalSupply(); // calculate xSushi voting weight
        return lp_powah.add(xsushi_powah); // combine xSushi weight with adjusted LP voting weight for 'powah'
    }
    
    /// @dev Internal function to avoid stack 'too deep' errors on calculating {balanceOf}.
    function collectBalances(address account) private view returns (uint256 collective_xsushi_balance) {
        uint256 xsushi_balance = bar.balanceOf(account);
        uint256 axsushi_balance = axSushi.balanceOf(account);
        uint256 crxsushi_balance = IERC20(crxSushi).balanceOf(account).mul(ICreamRate(crxSushi).exchangeRateStored()); // calculate underlying xSushi claim
        uint256 bento_balance = bento.toAmount(bar, bento.balanceOf(bar, account), false);
        collective_xsushi_balance = xsushi_balance.add(axsushi_balance).add(crxsushi_balance).add(bento_balance);
    }
    
    /// @notice Returns the adjusted total supply for LP and xSushi staking.
    function totalSupply() external view returns (uint256) {
        uint256 lp_totalSushi = sushi.balanceOf(address(pair));
        uint256 xsushi_totalSushi = sushi.balanceOf(address(bar));
        return lp_totalSushi.mul(2).add(xsushi_totalSushi);
    }
}
