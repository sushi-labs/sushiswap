pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SakeToken.sol";
import "./interfaces/IMigratorChef.sol";

// Uniswap Liquidity Mining
interface IStakingRewards {
    function earned(address account) external view returns (uint256);
    function stake(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function getReward() external;
    function exit() external;
    function balanceOf(address account) external view returns (uint256);
}

contract SakeUni is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 sakeRewardDebt; // Sake reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of SAKEs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accSakePerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accSakePerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
        uint256 uniRewardDebt;  // similar with sakeRewardDebt
        uint256 firstDepositTime;
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken; // Address of LP token contract.
        IStakingRewards uniStaking; // Contract address of staking LP token on uniswap.
        uint256 allocPoint; // How many allocation points assigned to this pool. SAKEs to distribute per block.
        uint256 lastRewardBlock; // Last block number that SAKEs distribution occurs.
        uint256 accSakePerShare; // Accumulated SAKEs per share, times 1e12. See below.
        uint256 accUniPerShare; // Accumulated UNIs per share, times 1e12. See below.
    }

    // The UNI Token.
    IERC20 public uniToken;
    // The SAKE TOKEN!
    SakeToken public sake;
    // Block number of distributing SAKE period ends.
    uint256 public endBlock;
    // Block number of distributing bonus SAKE period ends.
    uint256 public bonusEndBlock;
    // SAKE tokens created per block.
    uint256 public sakePerBlock;
    // end block num, about 20 days.
    uint256 public constant END_BLOCKNUM = 128000;
    // bonus block num, about 10 days.
    uint256 public constant BONUS_BLOCKNUM = 64000;
    // min withdraw interval without LP fee, about a week.
    uint256 public constant MIN_WITHDRAW_INTERVAL = 44800;
    // Bonus muliplier.
    uint256 public constant BONUS_MULTIPLIER = 2;
    // The migrator contract. It has a lot of power. Can only be set through governance (owner).
    IMigratorChef public migrator;
    // The address to receive UNI token fee.
    address public uniTokenFeeReceiver;
    // The address to receive LP token fee.
    address public lpTokenFeeReceiver;
    // The ratio of UNI token fee (10%).
    uint8 public uniFeeRatio = 10;
    // The ratio of Lp token fee (1%).
    uint8 public lpTokenFeeRatio = 1;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when SAKE mining starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    constructor(
        SakeToken _sake,
        address _uniToken,
        address _uniTokenFeeReceiver,
        address _lpTokenFeeReceiver,
        uint256 _sakePerBlock,
        uint256 _startBlock
    ) public {
        sake = _sake;
        uniToken = IERC20(_uniToken);
        uniTokenFeeReceiver = _uniTokenFeeReceiver;
        lpTokenFeeReceiver = _lpTokenFeeReceiver;
        sakePerBlock = _sakePerBlock;
        startBlock = _startBlock;
        endBlock = startBlock.add(END_BLOCKNUM);
        bonusEndBlock = startBlock.add(BONUS_BLOCKNUM);
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    function _checkValidity(IERC20 _lpToken) internal view {
        for (uint i = 0; i < poolInfo.length; i++) {
            require(poolInfo[i].lpToken != _lpToken, "lpToken exist");
        }
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(uint256 _allocPoint, IERC20 _lpToken, IStakingRewards _uniStaking, bool _withUpdate) public onlyOwner {
        if (_withUpdate) massUpdatePools();
        _checkValidity(_lpToken);
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                uniStaking: _uniStaking,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                accSakePerShare: 0,
                accUniPerShare: 0
            })
        );
    }

    // Update the given pool's SAKE allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {
        if (_withUpdate) massUpdatePools();
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // Set the migrator contract. Can only be called by the owner.
    function setMigrator(IMigratorChef _migrator) public onlyOwner {
        migrator = _migrator;
    }

    // Migrate lp token to another lp contract. Can be called by anyone. We trust that migrator contract is good.
    function migrate(uint256 _pid) public {
        require(address(migrator) != address(0), "migrate: no migrator");
        PoolInfo storage pool = poolInfo[_pid];
        pool.uniStaking.exit();
        IERC20 lpToken = pool.lpToken;
        uint256 bal = lpToken.balanceOf(address(this));
        lpToken.safeApprove(address(migrator), bal);
        IERC20 newLpToken = migrator.migrate(lpToken);
        require(bal == newLpToken.balanceOf(address(this)), "migrate: bad");
        pool.lpToken = newLpToken;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        uint256 _toFinal = _to > endBlock ? endBlock : _to;
        if (_toFinal <= bonusEndBlock) {
            return _toFinal.sub(_from).mul(BONUS_MULTIPLIER);
        } else {
            if (_from < bonusEndBlock) {
                return bonusEndBlock.sub(_from).mul(BONUS_MULTIPLIER).add(_toFinal.sub(bonusEndBlock));
            } else {
                return _toFinal.sub(_from);
            }
        }
    }

    // View function to see pending SAKEs and UNIs on frontend.
    function pending(uint256 _pid, address _user) external view returns (uint256 _sake, uint256 _uni) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accSakePerShare = pool.accSakePerShare;
        uint256 accUniPerShare = pool.accUniPerShare;
        uint256 lpSupply = pool.uniStaking.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 sakeReward = multiplier.mul(sakePerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accSakePerShare = accSakePerShare.add(sakeReward.mul(1e12).div(lpSupply));
            uint256 uniReward = pool.uniStaking.earned(address(this));
            accUniPerShare = accUniPerShare.add(uniReward.mul(1e12).div(lpSupply));
        }
        _sake = user.amount.mul(accSakePerShare).div(1e12).sub(user.sakeRewardDebt);
        _uni = user.amount.mul(accUniPerShare).div(1e12).sub(user.uniRewardDebt);
    }

    // Update reward vairables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.uniStaking.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        if (multiplier > 0) {
            uint256 sakeReward = multiplier.mul(sakePerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            pool.accSakePerShare = pool.accSakePerShare.add(sakeReward.mul(1e12).div(lpSupply));
        }
        uint256 uniReward = pool.uniStaking.earned(address(this));
        if (uniReward > 0) {
            pool.uniStaking.getReward();
            pool.accUniPerShare = pool.accUniPerShare.add(uniReward.mul(1e12).div(lpSupply));
        } 
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to SakeMaster for SAKE allocation.
    function deposit(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        if (_amount > 0 && user.firstDepositTime == 0) user.firstDepositTime = block.number;
        uint256 pendingSake = user.amount.mul(pool.accSakePerShare).div(1e12).sub(user.sakeRewardDebt);
        uint256 pendingUni = user.amount.mul(pool.accUniPerShare).div(1e12).sub(user.uniRewardDebt);
        user.amount = user.amount.add(_amount);
        user.sakeRewardDebt = user.amount.mul(pool.accSakePerShare).div(1e12);
        user.uniRewardDebt = user.amount.mul(pool.accUniPerShare).div(1e12);
        if (pendingSake > 0) _safeSakeTransfer(msg.sender, pendingSake);
        if (pendingUni > 0) {
            uint256 uniFee = pendingUni.mul(uniFeeRatio).div(100);
            uint256 uniToUser = pendingUni.sub(uniFee);
            _safeUniTransfer(uniTokenFeeReceiver, uniFee);
            _safeUniTransfer(msg.sender, uniToUser);
        }
        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
            pool.lpToken.approve(address(pool.uniStaking), _amount);
            pool.uniStaking.stake(_amount);
        }
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from SakeUni.
    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool(_pid);
        uint256 pendingSake = user.amount.mul(pool.accSakePerShare).div(1e12).sub(user.sakeRewardDebt);
        uint256 pendingUni = user.amount.mul(pool.accUniPerShare).div(1e12).sub(user.uniRewardDebt);
        user.amount = user.amount.sub(_amount);
        user.sakeRewardDebt = user.amount.mul(pool.accSakePerShare).div(1e12);
        user.uniRewardDebt = user.amount.mul(pool.accUniPerShare).div(1e12);
        if (pendingSake > 0) _safeSakeTransfer(msg.sender, pendingSake);
        if (pendingUni > 0) {
            uint256 uniFee = pendingUni.mul(uniFeeRatio).div(100);
            uint256 uniToUser = pendingUni.sub(uniFee);
            _safeUniTransfer(uniTokenFeeReceiver, uniFee);
            _safeUniTransfer(msg.sender, uniToUser);
        }
        {
            pool.uniStaking.withdraw(_amount);
            if (block.number.sub(user.firstDepositTime) < MIN_WITHDRAW_INTERVAL) {
                uint256 lpTokenFee = _amount.mul(lpTokenFeeRatio).div(100);
                uint256 lpTokenToUser = _amount.sub(lpTokenFee);
                pool.lpToken.safeTransfer(lpTokenFeeReceiver, lpTokenFee);
                pool.lpToken.safeTransfer(address(msg.sender), lpTokenToUser);
            } else {
                pool.lpToken.safeTransfer(address(msg.sender), _amount);
            }
        }
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount > 0, "emergencyWithdraw: not good");
        uint256 _amount = user.amount;
        user.amount = 0;
        user.sakeRewardDebt = 0;
        user.uniRewardDebt = 0;
        {
            pool.uniStaking.withdraw(_amount);
            if (block.number.sub(user.firstDepositTime) < MIN_WITHDRAW_INTERVAL) {
                uint256 lpTokenFee = _amount.mul(lpTokenFeeRatio).div(100);
                uint256 lpTokenToUser = _amount.sub(lpTokenFee);
                pool.lpToken.safeTransfer(lpTokenFeeReceiver, lpTokenFee);
                pool.lpToken.safeTransfer(address(msg.sender), lpTokenToUser);
            } else {
                pool.lpToken.safeTransfer(address(msg.sender), _amount);
            }
        }
        emit EmergencyWithdraw(msg.sender, _pid, _amount);
    }

    // Safe sake transfer function, just in case if rounding error causes pool to not have enough SAKEs.
    function _safeSakeTransfer(address _to, uint256 _amount) internal {
        uint256 sakeBal = sake.balanceOf(address(this));
        if (_amount > sakeBal) {
            sake.transfer(_to, sakeBal);
        } else {
            sake.transfer(_to, _amount);
        }
    }

    // Safe uni transfer function
    function _safeUniTransfer(address _to, uint256 _amount) internal {
        uint256 uniBal = uniToken.balanceOf(address(this));
        if (_amount > uniBal) {
            uniToken.transfer(_to, uniBal);
        } else {
            uniToken.transfer(_to, _amount);
        }
    }
}
