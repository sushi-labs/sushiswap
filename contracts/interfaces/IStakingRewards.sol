pragma solidity 0.6.12;

// Uniswap Liquidity Mining
interface IStakingRewards {
    function earned(address account) external view returns (uint256);

    function stake(uint256 amount) external;

    function withdraw(uint256 amount) external;

    function getReward() external;

    function exit() external;

    function balanceOf(address account) external view returns (uint256);
}