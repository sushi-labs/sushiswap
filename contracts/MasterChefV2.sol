// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@boringcrypto/boring-solidity/contracts/BoringBatchable.sol";
import "@boringcrypto/boring-solidity/contracts/BoringOwnable.sol";
import "./libraries/SignedSafeMath.sol";
import "./interfaces/IRewarder.sol";
import "./interfaces/IMasterChef.sol";

/// @notice The (older) MasterChef contract gives out a constant number of SUSHI per Block.
/// It is the only address with minting rights for the SUSHI token.
/// The idea for this MasterChef V2 (MCV2) contract is therefore to be the owner of a dummy token
/// that is deposited into the MasterChef V1 (MCV1) contract.
/// The allocation point for this pool on MCV1 is the total allocation point for all pools that receive double incentives.
contract MasterChefV2 is BoringOwnable, BoringBatchable {
    using BoringMath for uint256;
    using BoringMath128 for uint128;
    using BoringERC20 for IERC20;
    using SignedSafeMath for int256;

    /// @notice Info of each user.
    /// `amount` of LP tokens the user has provided.
    /// `rewardDebt` the amount of SUSHI entitled to the user.
    struct UserInfo {
        uint256 amount;
        int256 rewardDebt;
    }

    /// @notice Info of each pool.
    /// `allocPoint` The amount of allocation points assigned to the pool.
    /// Also known as the amount of SUSHIs to distribute per Block
    struct PoolInfo {
        uint128 accSushiPerShare;
        uint64 lastRewardBlock;
        uint64 allocPoint;
    }

    /// @notice Address of MasterChef (v1).
    IMasterChef public immutable MASTER_CHEF;
    /// @notice The SUSHI ERC-20 contract.
    IERC20 public immutable SUSHI;
    /// @notice The index of the master pool.
    uint256 public immutable MASTER_PID;

    /// @notice Info of each pool.
    PoolInfo[] public poolInfo;
    /// @notice Address of the ERC-20 for each Pool.
    IERC20[] public lpToken;
    /// @notice Address of each `IRewarder` contract.
    IRewarder[] public rewarder;

    /// @notice Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    /// @dev Total allocation points. Must be the sum of all allocation points in all pools.
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

    /// @param _MASTER_CHEF the SushiSwap MasterChef contract
    /// @param _sushi the SUSHI Token
    /// @param _MASTER_PID the pool ID of the dummy token on the base contract
    constructor(IMasterChef _MASTER_CHEF, IERC20 _sushi, uint256 _MASTER_PID) public {
        MASTER_CHEF = _MASTER_CHEF;
        SUSHI = _sushi;
        MASTER_PID = _MASTER_PID;
    }

    /// @notice Deposits a dummy tokens to `MASTER_CHEF`. This is required because `MASTER_CHEF` holds the minting rights for SUSHI.
    /// Any balance of transaction sender from `dummyToken` is transferred.
    /// The allocation point for the pool on MCV1 is the total allocation point for all pools that receive double incentives.
    function init(IERC20 dummyToken) external {
        uint256 balance = dummyToken.balanceOf(msg.sender);
        require(balance != 0, "Balance must exceed 0");
        dummyToken.safeTransferFrom(msg.sender, address(this), balance);
        dummyToken.approve(address(MASTER_CHEF), balance);
        MASTER_CHEF.deposit(MASTER_PID, balance);
        emit LogInit();
    }

    /// @notice Returns the number of pools.
    function poolLength() public view returns (uint256) {
        return poolInfo.length;
    }

    /// @notice Add a new lp to the pool. Can only be called by the owner.
    /// DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    /// @param allocPoint AP of the new pool
    /// @param _lpToken address of the LP token
    /// @param _rewarder address of the reward Contract
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
        emit LogPoolAddition(lpToken.length.sub(1), allocPoint, _lpToken, _rewarder);
    }


    /// @notice Update the given pool's SUSHI allocation point and `IRewarder` contract. Can only be called by the owner.
    /// @param _pid The index of the pool. See `poolInfo`.
    /// @param _allocPoint new AP of the pool
    /// @param _rewarder Address of the rewarder delegate.
    /// @param overwrite True if _rewarder should be `set`. Otherwise `_rewarder` is ignored.
    function set(uint256 _pid, uint256 _allocPoint, IRewarder _rewarder, bool overwrite) public onlyOwner {
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint.to64();
        if (overwrite) { rewarder[_pid] = _rewarder; }
        emit LogSetPool(_pid, _allocPoint, overwrite ? _rewarder : rewarder[_pid], overwrite);
    }


    /// @notice View function to see pending SUSHIs on frontend.
    /// @param _pid The index of the pool. See `poolInfo`.
    /// @param _user address of user
    function pendingSushi(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo memory pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
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

    /// @notice Update reward variables for all pools. Be careful of gas spending!
    /// @param pids pool IDs of all to be updated, make sure to update all active pools
    function massUpdatePools(uint256[] calldata pids) external {
        uint256 len = pids.length;
        for (uint256 i = 0; i < len; ++i) {
            updatePool(pids[i]);
        }
    }

    /// @notice calculates the `amount` of SUSHI per block
    function sushiPerBlock() public view returns (uint256 amount) {
        amount = uint256(MASTERCHEF_SUSHI_PER_BLOCK)
            .mul(MASTER_CHEF.poolInfo(MASTER_PID).allocPoint) / MASTER_CHEF.totalAllocPoint();
    }


    /// @notice Update reward variables of the given pool.
    /// @param pid The index of the pool. See `poolInfo`.
    /// @return pool returns the Pool that was updated
    function updatePool(uint256 pid) public returns (PoolInfo memory pool) {
        pool = poolInfo[pid];
        if (block.number > pool.lastRewardBlock) {
            uint256 lpSupply = lpToken[pid].balanceOf(address(this));
            if (lpSupply > 0) {
                uint256 blocks = block.number.sub(pool.lastRewardBlock);
                uint256 sushiReward = blocks.mul(sushiPerBlock()).mul(pool.allocPoint) / totalAllocPoint;
                pool.accSushiPerShare = pool.accSushiPerShare.add((sushiReward.mul(ACC_SUSHI_PRECISION) / lpSupply).to128());
            }
            pool.lastRewardBlock = block.number.to64();
            poolInfo[pid] = pool;
            emit LogUpdatePool(pid, pool.lastRewardBlock, lpSupply, pool.accSushiPerShare);
        }
    }

    /// @notice Deposit LP tokens to MasterChef for SUSHI allocation.
    /// @param pid The index of the pool. See `poolInfo`.
    /// @param amount to deposit.
    /// @param to The receiver of `amount`.
    function deposit(uint256 pid, uint256 amount, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo storage user = userInfo[pid][to];

        // Effects
        user.amount = user.amount.add(amount);
        user.rewardDebt = user.rewardDebt.add(int256(amount.mul(pool.accSushiPerShare) / ACC_SUSHI_PRECISION));

        // Interactions
        lpToken[pid].safeTransferFrom(address(msg.sender), address(this), amount);

        emit Deposit(msg.sender, pid, amount, to);
    }

    /// @notice Withdraw LP tokens from MasterChef.
    /// @param pid The index of the pool. See `poolInfo`.
    /// @param amount of lp tokens to withdraw.
    /// @param to Receiver of the lp tokens.
    function withdraw(uint256 pid, uint256 amount, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo storage user = userInfo[pid][msg.sender];

        // Effects
        user.rewardDebt = user.rewardDebt.sub(int256(amount.mul(pool.accSushiPerShare) / ACC_SUSHI_PRECISION));
        user.amount = user.amount.sub(amount);

        // Interactions
        lpToken[pid].safeTransfer(to, amount);

        emit Withdraw(msg.sender, pid, amount, to);
    }

    /// @notice Harvest proceeds for transaction sender to `to`.
    /// @param pid The index of the pool. See `poolInfo`.
    /// @param to Receiver of SUSHI rewards.
    function harvest(uint256 pid, address to) public {
        PoolInfo memory pool = updatePool(pid);
        UserInfo storage user = userInfo[pid][msg.sender];
        int256 accumulatedSushi = int256(user.amount.mul(pool.accSushiPerShare) / ACC_SUSHI_PRECISION);
        uint256 _pendingSushi = accumulatedSushi.sub(user.rewardDebt).toUInt256();
        if (_pendingSushi == 0) { return; }


        // Effects
        user.rewardDebt = accumulatedSushi;

        // Interactions
        SUSHI.safeTransfer(to, _pendingSushi);


        address _rewarder = address(rewarder[pid]);
        if (_rewarder != address(0)){
            // Note: Do it this way because we don't want to fail harvest if only the delegate call fails.
            // Additionally, forward less gas so that we have enough buffer to complete harvest if the call eats up too much gas.
            // Forwarding: (63/64 of gasleft by evm convention) minus 5000
            // solhint-disable-next-line
            _rewarder.call{ gas: gasleft() - 5000 }(abi.encodeWithSelector(SIG_ON_SUSHI_REWARD, pid, msg.sender, _pendingSushi));

        }

        emit Harvest(msg.sender, pid, _pendingSushi);
    }

    /// @notice Harvests SUSHI from `MASTER_CHEF` and pool `MASTER_PID` to this contract.
    function harvestFromMasterChef () public {
        MASTER_CHEF.deposit(MASTER_PID, 0);
    }

    /// @notice Withdraw without caring about rewards. EMERGENCY ONLY.
    /// @param pid The index of the pool. See `poolInfo`.
    /// @param to Receiver of the lp tokens.
    function emergencyWithdraw(uint256 pid, address to) public {
        UserInfo storage user = userInfo[pid][msg.sender];
        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        // Note: transfer can fail or succeed if `amount` is zero.
        lpToken[pid].safeTransfer(to, amount);
        emit EmergencyWithdraw(msg.sender, pid, amount, to);
    }
}
