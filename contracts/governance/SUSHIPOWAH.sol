// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IMasterChefUserInfo {
    function userInfo(uint256 pid, address account) external view returns (uint256, uint256);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

interface IBentoBoxV1BalanceAmount {
    function balanceOf(IERC20, address) external view returns (uint256);
    function toAmount(IERC20 token, uint256 share, bool roundUp) external view returns (uint256 amount);
}

interface CauldronV2 {
    function userCollateralShare(address account) external view returns (uint256 collateral);
}

contract SUSHIPOWAH {
    IMasterChefUserInfo chef = IMasterChefUserInfo(0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd);
    IERC20 pair = IERC20(0x795065dCc9f64b5614C407a6EFDC400DA6221FB0);
    IERC20 bar = IERC20(0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272);
    IERC20 sushi = IERC20(0x6B3595068778DD592e39A122f4f5a5cF09C90fE2);
    IERC20 axSushi = IERC20(0xF256CC7847E919FAc9B808cC216cAc87CCF2f47a);
    IBentoBoxV1BalanceAmount bento = IBentoBoxV1BalanceAmount(0xF5BCE5077908a1b7370B9ae04AdC565EBd643966);
    IERC20 crxSushi = IERC20(0x228619CCa194Fbe3Ebeb2f835eC1eA5080DaFbb2); 
    IERC20 meow = IERC20(0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D);
    IERC20 tSushi = IERC20(0xf49764c9C5d644ece6aE2d18Ffd9F1E902629777);
    CauldronV2 xsushiCauldron = CauldronV2(0x98a84EfF6e008c5ed0289655CcdCa899bcb6B99F);

    function name() external pure returns (string memory) { return "SUSHIPOWAH"; }
    function symbol() external pure returns (string memory) { return "SUSHIPOWAH"; }
    function decimals() external pure returns (uint8) { return 18; }

    // Dummy functions
    function allowance(address, address) external pure returns (uint256) { return 0; }
    function approve(address, uint256) external pure returns (bool) { return false; }
    function transfer(address, uint256) external pure returns (bool) { return false; }
    function transferFrom(address, address, uint256) external pure returns (bool) { return false; }

    // Delegation

    // Packed into a single storage slot for gas efficiency
    struct Delegation {
        address delegate;
        uint32 index;
    }

    // Mapping from account to Delegation struct (delegate and index of 
    // this account in the voters array for the delegate)
    mapping(address => Delegation) public delegatedTo;
    // Mapping from account to an array of voters that have delegated to them
    mapping(address => address[]) public voters;

    // Number of voters that have delegated to this account
    function voterCount(address account) public view returns(uint256 count) {
        return voters[account].length;
    }

    // Internal function to remove a voter from the array by replacing it 
    // with the last item and then removing the last item
    function _removeVoter(address delegatee, uint256 index) internal {
        uint256 last = voters[delegatee].length - 1;
        if (index != last) {
            voters[delegatee][index] = voters[delegatee][last];
        }
        voters[delegatee].pop();
    }

    // Delegates your SushiPowah to a delegate
    function delegate(address to) public {
        if (delegatedTo[msg.sender].delegate != address(0)) {
            _removeVoter(to, delegatedTo[msg.sender].index);
        }
        delegatedTo[msg.sender].index = uint32(voters[to].length);
        voters[to].push(msg.sender);
    }

    // The delegate can use this function to remove voters that delegate to them
    // This can be useful if someone tried to spam the voter list to become too 
    // large to cause an out of gas in the balanceOf view.
    function removeVoter(uint256 index) public {
        // Remove the delegation
        delegatedTo[voters[msg.sender][index]] = Delegation(address(0), 0);
        // Remove the voter from the list
        _removeVoter(msg.sender, index);
    }

    // Calculation of SushiPowah

    function _balanceOf(address voter) internal view returns (uint256 powah) {
        // get tally for aToken
        uint256 axsushi_balance = axSushi.balanceOf(voter) * bar.balanceOf(address(axSushi)) / axSushi.totalSupply();
        uint256 abra_xsushi_collateral_share = xsushiCauldron.userCollateralShare(voter);
        uint256 bento_shares = bento.balanceOf(bar, voter);
        // get BENTO xSushi balance 'amount' (not shares)
        uint256 bento_collective_balance = bento.toAmount(bar, bento_shares + abra_xsushi_collateral_share, false);
        // get tally for cToken
        uint256 crxsushi_balance = crxSushi.balanceOf(voter)
            * bar.balanceOf(address(crxSushi))
            / crxSushi.totalSupply();
        // get tally for MEOW
        uint256 meow_balance = meow.balanceOf(voter)
            * bento.toAmount(bar, bento.balanceOf(bar, address(meow)), false)
            / meow.totalSupply();
        // get collective xSushi staking balances
        uint256 collective_xsushi_balance = 
            axsushi_balance
            + bento_collective_balance
            + crxsushi_balance
            + meow_balance
            + bar.balanceOf(voter);

        // calculate xSushi weight
        uint256 xsushi_powah = collective_xsushi_balance
            * sushi.balanceOf(address(bar))
            / bar.totalSupply();
        
        // get LP balance staked in MasterChef
        (uint256 lp_stakedBalance, ) = chef.userInfo(12, voter);
        // add staked LP balance & those held by `account`
        uint256 lp_balance = lp_stakedBalance + pair.balanceOf(voter);
        // calculate adjusted LP weight
        uint256 lp_powah = lp_balance * sushi.balanceOf(address(pair)) / pair.totalSupply() * 2;
        // tally tokemak staked sushi
        uint256 toke_powah = tSushi.balanceOf(voter);
        
        // add xSushi & LP weights for 'powah'
        powah = xsushi_powah + lp_powah + toke_powah;
    }

    /// @notice Returns SUSHI voting 'powah' for `account`.
    function balanceOf(address account) public view returns (uint256 powah) {
        // Count the account's SushiPowah if it's not delegated
        powah = delegatedTo[account].delegate == address(0) ? _balanceOf(account) : 0;

        // Add all the SushiPowah from voters that have delegated to this account
        uint256 len = voters[account].length;
        for (uint256 i=0; i < len; i++) {
            powah += _balanceOf(voters[account][i]);
        }
    }

    // Shows some powah info about your account
    function myBalance() external view returns (uint256 powah, uint256 count, uint256 delegatedPowah) {
        powah = _balanceOf(msg.sender);

        // Add all the SushiPowah from voters that have delegated to this account
        count = voters[msg.sender].length;
        for (uint256 i=0; i < count; i++) {
            delegatedPowah += _balanceOf(voters[msg.sender][i]);
        }        
    }

    /// @notice Returns total 'powah' supply.
    function totalSupply() external view returns (uint256 total) {
        total = sushi.balanceOf(address(bar)) + sushi.balanceOf(address(pair)) * 2;
    }
}