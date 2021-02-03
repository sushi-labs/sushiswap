// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@boringcrypto/boring-solidity/contracts/BoringBatchable.sol";
import "@boringcrypto/boring-solidity/contracts/BoringOwnable.sol";
import "./libraries/SignedSafeMath.sol";
import "./interfaces/IRewarder.sol";

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
    using SignedSafeMath for int256;

    struct UserInfo {
        uint256 amount;
        int256 rewardDebt;
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
    IRewarder[] public rewarder;

    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 totalAllocPoint;

    uint256 private constant MASTERCHEF_SUSHI_PER_BLOCK = 1e20;
    uint256 private constant ACC_SUSHI_PRECISION = 1e12;
    bytes4 private constant SIG_ON_SUSHI_REWARD = 0xbb6cc2ef; // onSushiReward(uint256,address,uint256)

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount, address indexed to);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount, address indexed to);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount, address indexed to);
    event Harvest(address indexed user, uint256 indexed pid, uint256 amount);
    event LogPoolAddition(uint256 indexed pid, uint256 allocPoint, IERC20 indexed lpToken,  IRewarder indexed rewarder);
    event LogSetPool(uint256 indexed pid, uint256 allocPoint, IRewarder rewarder, bool overwrite);
    event LogUpdatePool(uint256 indexed pid, uint64 lastRewardBlock, uint256 lpSupply, uint256 accSushiPerShare);
    event LogInit();

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
        emit LogInit();
    }

    function poolLength() public view returns (uint256) {
        return poolInfo.length;
    }

    /** @dev Add a new lp to the pool. Can only be called by the owner. DO NOT add the same LP token more than once. Rewards will be messed up if you do.
     *  @param allocPoint AP of the new pool
     *  @param _lpToken address of the LP token
     *  @param _rewarder address of the reward Contract
     */
    function add(uint256 allocPoint, IERC20 _lpToken, IRewarder _rewarder) public onlyOwner {
        uint256 lastRewardBlock = block.number;
        totalAllocPoint = totalAllocPoint.add(allocPoint);
        lpToken.push(_lpToken);
        rewarder.push(_rewarder);

        poolInfo.push(PoolInfo({
            allocPoint: allocPoint.to64(),
            lastRewardBlock: lastRewardBlock.to64(),
            accSushiPerShare: 0
        }));
        emit LogPoolAddition( lpToken.length.sub(1), allocPoint, _lpToken, _rewarder);
    }


    /** @notice Update the given pool's SUSHI allocation point. Can only be called by the owner.
     *  @param _pid ID of the pool to be changed
     *  @param _allocPoint new AP of the pool
     */
    function set(uint256 _pid, uint256 _allocPoint, IRewarder _rewarder, bool overwrite) public onlyOwner {
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint.to64(); 
        if(overwrite) { rewarder[_pid] = _rewarder; }
        emit LogSetPool(_pid, _allocPoint, _rewarder, overwrite);
    }


    /** @notice View function to see pending SUSHIs on frontend.
     *  @param _pid ID of the pool
     *  @param _user address of user
     */
    function pendingSushi(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo memory pool = poolInfo[_pid];
        UserInfo memory user = userInfo[_pid][_user];
        uint256 accSushiPerShare = pool.accSushiPerShare;
        uint256 lpSupply = lpToken[_pid].balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 blocks = block.number.sub(pool.lastRewardBlock);
            uint256 sushiReward = blocks.mul(sushiPerBlock()).mul(pool.allocPoint) / totalAllocPoint;
            accSushiPerShare = accSushiPerShare.add(sushiReward.mul(ACC_SUSHI_PRECISION) / lpSupply);
        }
        uint256 _pendingSushi = int256(user.amount.mul(accSushiPerShare) / ACC_SUSHI_PRECISION).sub(user.rewardDebt).toUInt256();
        return _pendingSushi;
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
                pool.accSushiPerShare = pool.accSushiPerShare.add((sushiReward.mul(ACC_SUSHI_PRECISION) / lpSupply).to128());
            }
            pool.lastRewardBlock = block.number.to32();
            poolInfo[pid] = pool;
            emit LogUpdatePool(pid, pool.lastRewardBlock, lpSupply, pool.accSushiPerShare);
        }
    }

    // Deposit LP tokens to MasterChef for SUSHI allocation.
    function deposit(uint256 pid, uint256 amount, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo memory user = userInfo[pid][to];
        if(amount > 0) {
            lpToken[pid].safeTransferFrom(address(msg.sender), address(this), amount);
            user.amount = user.amount.add(amount);
        }
        user.rewardDebt = user.rewardDebt.add(int256(amount.mul(pool.accSushiPerShare) / ACC_SUSHI_PRECISION));
        userInfo[pid][to] = user;
        emit Deposit(msg.sender, pid, amount, to);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 pid, uint256 amount, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo memory user = userInfo[pid][msg.sender];
        if (amount > 0) {
            user.amount = user.amount.sub(amount);
            lpToken[pid].safeTransfer(to, amount);
        }
        user.rewardDebt = user.rewardDebt.sub(int256(amount.mul(pool.accSushiPerShare) / ACC_SUSHI_PRECISION));
        userInfo[pid][msg.sender] = user;
        emit Withdraw(msg.sender, pid, amount, to);
    }

    function harvest(uint256 pid, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo memory user = userInfo[pid][msg.sender];
        uint256 _pendingSushi = int256(user.amount.mul(pool.accSushiPerShare) / ACC_SUSHI_PRECISION).sub(user.rewardDebt).toUInt256();
        if (_pendingSushi == 0) { return; }
            
        IRewarder _rewarder = rewarder[pid];
        sushi.safeTransfer(to, _pendingSushi); 
        
        user.rewardDebt = int256(user.amount.mul(pool.accSushiPerShare) / ACC_SUSHI_PRECISION);
        userInfo[pid][msg.sender] = user;
        emit Harvest(msg.sender, pid, _pendingSushi);

        if(address(_rewarder) != address(0)){
            // solhint-disable-next-line
            address(_rewarder).call(abi.encodeWithSelector(SIG_ON_SUSHI_REWARD, pid, msg.sender, _pendingSushi));
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
