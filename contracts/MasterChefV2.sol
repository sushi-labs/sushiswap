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
    function deposit(uint256 _pid, uint256 _amount) external;
}

contract MasterChefV2 is BoringOwnable, BoringBatchable {
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

    uint256 private constant MASTERCHEF_SUSHI_PER_BLOCK = 1e20;
    uint256 private constant REWARD_TOKEN_DIVISOR = 1e18;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount, address indexed to);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount, address indexed to);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount, address indexed to);
    event Harvest(address indexed user, uint256 indexed pid, uint256 amount);
    event LogPoolAddition(IERC20 indexed lpToken, uint256 allocPoint, IERC20 indexed rewardToken, uint256 rewardTokenMultiplier);

    /** @param _masterChef the SushiSwap MasterChef contract
     *  @param _sushi the SUSHI Token
     *  @param _MASTER_PID the pool ID of the dummy token on the base contract
     */
    constructor(IMasterChef _masterChef, IERC20 _sushi, uint256 _MASTER_PID) public {
        masterChef = _masterChef;
        sushi = _sushi;
        MASTER_PID = _MASTER_PID;
    }

    function init(IERC20 dummyToken) external {
        uint256 balance = dummyToken.balanceOf(msg.sender);
        require(balance != 0, "Balance must exceed 0");
        dummyToken.safeTransferFrom(msg.sender, address(this), balance);
        IMasterChef _masterChef = masterChef;
        dummyToken.approve(address(_masterChef), balance);
        _masterChef.deposit(MASTER_PID, balance);
    }

    function poolLength() public view returns (uint256) {
        return poolInfo.length;
    }

    /** @dev Add a new lp to the pool. Can only be called by the owner. DO NOT add the same LP token more than once. Rewards will be messed up if you do.
     *  @param allocPoint AP of the new pool
     *  @param _lpToken address of the LP token
     *  @param _rewardToken address of the reward Token
     *  @param _rewardTokenMultiplier multiplier for the reward token
     */
    function add(uint256 allocPoint, IERC20 _lpToken, IERC20 _rewardToken, uint256 _rewardTokenMultiplier) public onlyOwner {
        require(address(_rewardToken) != address(0), "");
        uint256 lastRewardBlock = block.number;
        totalAllocPoint = totalAllocPoint.add(allocPoint);
        lpToken.push(_lpToken);
        rewardToken.push(_rewardToken);
        rewardTokenMultiplier.push(_rewardTokenMultiplier);

        poolInfo.push(PoolInfo({
            allocPoint: allocPoint.to64(),
            lastRewardBlock: lastRewardBlock.to64(),
            accSushiPerShare: 0
        }));
        emit LogPoolAddition(_lpToken, allocPoint, _rewardToken, _rewardTokenMultiplier);
    }


    /** @notice Update the given pool's SUSHI allocation point. Can only be called by the owner.
     *  @param _pid ID of the pool to be changed
     *  @param _allocPoint new AP of the pool
     */
    function set(uint256 _pid, uint256 _allocPoint) public onlyOwner {
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint.to64();
    }


    /** @notice View function to see pending SUSHIs on frontend.
     *  @param _pid ID of the pool
     *  @param _user address of user
     */
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

    /** @notice Update reward variables for all pools. Be careful of gas spending!
     *  @param pids pool IDs of all to be updated, make sure to update all active pools
     */
    function massUpdatePools(uint256[] calldata pids) external {
        uint256 len = pids.length;
        for (uint256 i = 0; i < len; ++i) {
            updatePool(pids[i]);
        }
    }

    /** @notice calculates the amount of SUSHI per block
     *  @param amount pool IDs of all to be updated, make sure to update all active pools
     */
    function sushiPerBlock() public view returns (uint256 amount) {
        amount = uint256(MASTERCHEF_SUSHI_PER_BLOCK)
            .mul(masterChef.poolInfo(MASTER_PID).allocPoint) / masterChef.totalAllocPoint();
    }


    /** @notice Update reward variables of the given pool to be up-to-date.
     *  @param pid pool ID
     *  @return pool returns the Pool that was updated
     */
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
            uint256 pending = (user.amount.mul(pool.accSushiPerShare) / 1e12).sub(user.rewardDebt);
            require(sushi.balanceOf(address(this)) >= pending, "Please Harvest Before");
            _transferSushiAndRewards(pid, to, pending);
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
        require(sushi.balanceOf(address(this)) >= pending, "Please Harvest Before");
        if (pending > 0) {
            _transferSushiAndRewards(pid, to, pending);
        }
        if (amount > 0) {
            user.amount = user.amount.sub(amount);
            lpToken[pid].safeTransfer(to, amount);
        }
        user.rewardDebt = user.amount.mul(pool.accSushiPerShare) / 1e12;
        userInfo[pid][msg.sender] = user;
        emit Withdraw(msg.sender, pid, amount, to);
    }

    function harvest(uint256 pid, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo memory user = userInfo[pid][msg.sender];
        uint256 pending = (user.amount.mul(pool.accSushiPerShare) / 1e12).sub(user.rewardDebt);
        require(sushi.balanceOf(address(this)) >= pending, "Please Harvest Before");
        if (pending > 0) {
            _transferSushiAndRewards(pid, to, pending);
        }
        user.rewardDebt = user.amount.mul(pool.accSushiPerShare) / 1e12;
        userInfo[pid][msg.sender] = user;
        emit Harvest(msg.sender, pid, pending);
    }

    function _transferSushiAndRewards (uint256 pid, address _to, uint256 _amount) internal {
        IERC20 _rewardToken = rewardToken[pid];
        uint256 _rewardTokenMultiplier = rewardTokenMultiplier[pid];
        sushi.safeTransfer(_to, _amount); // TODO: should this be safeSushiTransfer or harvestFromMasterChef be called?
        uint256 pendingReward = _amount.mul(_rewardTokenMultiplier) / REWARD_TOKEN_DIVISOR;
        uint256 rewardBal = _rewardToken.balanceOf(address(this));
        if (pendingReward > rewardBal) {
            _rewardToken.safeTransfer(_to, rewardBal);
        } else {
            _rewardToken.safeTransfer(_to, _amount);
        }
    }

    function harvestFromMasterChef () public {
        masterChef.deposit(MASTER_PID, 0);
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
