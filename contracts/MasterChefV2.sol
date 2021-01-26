// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@boringcrypto/boring-solidity/contracts/BoringBatchable.sol";
import "@boringcrypto/boring-solidity/contracts/BoringOwnable.sol";

interface IMasterChef {
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
    }

    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. SUSHIs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that SUSHIs distribution occurs.
        uint256 accSushiPerShare; // Accumulated SUSHIs per share, times 1e12. See below.
    }

    function poolInfo(uint256 pid) external view returns (IMasterChef.PoolInfo memory);
    function totalAllocPoint() external view returns (uint256);
}

contract MasterChefV2 is BoringOwnable {
    using BoringMath for uint256;
    using BoringMath128 for uint128;
    using BoringERC20 for IERC20;

    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
    }

    struct PoolInfo {
        uint128 accSushiPerShare;
        uint64 lastRewardBlock;
        uint64 allocPoint;
    }

    IMasterChef public immutable masterChef;
    IERC20 public immutable sushi;
    uint256 public immutable MASTER_PID;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    IERC20[] public lpToken;
    IERC20[] public rewardToken;
    uint256[] public rewardTokenMultiplier;

    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 totalAllocPoint;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount, address indexed to);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount, address indexed to);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount, address indexed to);

    constructor(IMasterChef _masterChef, IERC20 _sushi, uint256 MASTER_PID_) public {
        masterChef = _masterChef;
        sushi = _sushi;
        MASTER_PID = MASTER_PID_;
    }
 
    function init() public {
        // Takes DUMMY token
        // Deposits dummy token in MasterChef
        // Sets lastrewarddate
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(uint256 allocPoint, IERC20 lpToken_, IERC20 rewardToken_, uint256 rewardTokenMultiplier_) public onlyOwner {
        uint256 lastRewardBlock = block.number;
        totalAllocPoint = totalAllocPoint.add(allocPoint);
        lpToken.push(lpToken_);
        rewardToken.push(rewardToken_);
        rewardTokenMultiplier.push(rewardTokenMultiplier_);

        poolInfo.push(PoolInfo({
            allocPoint: allocPoint.to64(),
            lastRewardBlock: lastRewardBlock.to64(),
            accSushiPerShare: 0
        }));
    }

    // Update the given pool's SUSHI allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint) public onlyOwner {
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint.to64();
    }

    // Return reward multiplier over the given _from to _to block.
    // View function to see pending SUSHIs on frontend.
    function pendingSushi(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accSushiPerShare = pool.accSushiPerShare;
        uint256 lpSupply = lpToken[_pid].balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 blocks = block.number.sub(pool.lastRewardBlock);
            uint256 sushiReward = blocks.mul(sushiPerBlock()).mul(pool.allocPoint) / totalAllocPoint;
            accSushiPerShare = accSushiPerShare.add(sushiReward.mul(1e12) / lpSupply);
        }
        return (user.amount.mul(accSushiPerShare) / 1e12).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools(uint256[] calldata pids) public {
        uint256 len = pids.length;
        for (uint256 i = 0; i < len; ++i) {
            updatePool(pids[i]);
        }
    }

    uint256 private constant MASTERCHEF_SUSHI_PER_BLOCK = 1e20;
    function sushiPerBlock() public view returns (uint256 amount) {
        amount = uint256(MASTERCHEF_SUSHI_PER_BLOCK)
            .mul(masterChef.poolInfo(MASTER_PID).allocPoint) / masterChef.totalAllocPoint();
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 pid) public returns (PoolInfo memory pool) {
        pool = poolInfo[pid];
        if (block.number > pool.lastRewardBlock) {
            uint256 lpSupply = lpToken[pid].balanceOf(address(this));
            if (lpSupply > 0) {
                uint256 blocks = block.number.sub(pool.lastRewardBlock);
                uint256 sushiReward = blocks.mul(sushiPerBlock()).mul(pool.allocPoint) / totalAllocPoint;
                pool.accSushiPerShare = pool.accSushiPerShare.add((sushiReward.mul(1e12) / lpSupply).to128());
            }
            pool.lastRewardBlock = block.number.to32();
            poolInfo[pid] = pool;
        }
    }

    // Deposit LP tokens to MasterChef for SUSHI allocation.
    function deposit(uint256 pid, uint256 amount, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo memory user = userInfo[pid][to];
        if (user.amount > 0) {
            // Add to rewardDebt
        }
        if(amount > 0) {
            lpToken[pid].safeTransferFrom(address(msg.sender), address(this), amount);
            user.amount = user.amount.add(amount);
        }
        user.rewardDebt = user.amount.mul(pool.accSushiPerShare) / 1e12;
        userInfo[pid][to] = user;
        emit Deposit(msg.sender, pid, amount, to);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 pid, uint256 amount, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo memory user = userInfo[pid][msg.sender];
        require(user.amount >= amount, "withdraw: not good");
        uint256 pending = (user.amount.mul(pool.accSushiPerShare) / 1e12).sub(user.rewardDebt);
        if (pending > 0) {
            //safeSushiTransfer(msg.sender, pending);
        }
        if (amount > 0) {
            user.amount = user.amount.sub(amount);
            lpToken[pid].safeTransfer(to, amount);
        }
        user.rewardDebt = user.amount.mul(pool.accSushiPerShare) / 1e12;
        userInfo[pid][to] = user;
        emit Withdraw(msg.sender, pid, amount, to);
    }

    function harvest(uint256 pid, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo memory user = userInfo[pid][msg.sender];
        uint256 pending = (user.amount.mul(pool.accSushiPerShare) / 1e12).sub(user.rewardDebt);
        if (pending > 0) {
            //safeSushiTransfer(msg.sender, pending);
        }
        user.rewardDebt = user.amount.mul(pool.accSushiPerShare) / 1e12;
        userInfo[pid][to] = user;
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 pid, address to) public {
        UserInfo memory user = userInfo[pid][msg.sender];
        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        userInfo[pid][msg.sender] = user;
        lpToken[pid].safeTransfer(to, amount);
        emit EmergencyWithdraw(msg.sender, pid, amount, to);
    }
}
