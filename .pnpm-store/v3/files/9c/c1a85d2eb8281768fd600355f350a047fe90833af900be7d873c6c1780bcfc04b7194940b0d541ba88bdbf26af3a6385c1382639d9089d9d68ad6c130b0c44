// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "@rari-capital/solmate/src/tokens/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Intermediary token users who are staked in MasterChef will receive after migration.
/// Can be redeemed for the LP token of the new pool.
contract IntermediaryToken is ERC20 {
    /// @dev Liquidity token of the Trident constant product pool.
    IERC20 public immutable lpToken;

    constructor(
        address _lpToken,
        address _recipient,
        uint256 _amount
    ) ERC20("Sushi LP Token", "SLP", 18) {
        lpToken = IERC20(_lpToken);
        _mint(_recipient, _amount);
    }

    /// @dev Since we might be rewarding the intermediary token for some time we allow users to mint it.
    function deposit(uint256 amount) public returns (uint256 minted) {
        uint256 availableLpTokens = lpToken.balanceOf(address(this));
        if (availableLpTokens != 0) {
            minted = (totalSupply * amount) / availableLpTokens;
        } else {
            minted = amount;
        }
        _mint(msg.sender, minted);
        require(lpToken.transferFrom(msg.sender, address(this), amount), "TRANSFER_FROM_FAILED");
    }

    function redeem(uint256 amount) public returns (uint256 claimed) {
        uint256 availableLpTokens = lpToken.balanceOf(address(this));
        claimed = (availableLpTokens * amount) / totalSupply;
        _burn(msg.sender, amount);
        require(lpToken.transfer(msg.sender, claimed), "TRANSFER_FAILED");
    }
}
