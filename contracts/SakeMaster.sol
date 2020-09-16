pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SakeToken.sol";
import "./interfaces/IMigratorChef.sol";

// SakeMaster is the master of Sake. He can make Sake and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once SAKE is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract SakeMaster is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
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
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken; // Address of LP token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. SAKEs to distribute per block.
        uint256 lastRewardBlock; // Last block number that SAKEs distribution occurs.
        uint256 accSakePerShare; // Accumulated SAKEs per share, times 1e12. See below.
    }

    // The SAKE TOKEN!
    SakeToken public sake;
    // Dev address.
    address public devaddr;
    // Block number when beta test period ends.
    uint256 public betaTestEndBlock;
    // Block number when bonus SAKE period ends.
    uint256 public bonusEndBlock;
    // Block number when mint SAKE period ends.
    uint256 public mintEndBlock;
    // SAKE tokens created per block.
    uint256 public sakePerBlock;
    // Bonus muliplier for 5~20 days sake makers.
    uint256 public constant BONUSONE_MULTIPLIER = 20;
    // Bonus muliplier for 20~35 sake makers.
    uint256 public constant BONUSTWO_MULTIPLIER = 2;
    // beta test block num,about 5 days.
    uint256 public constant BETATEST_BLOCKNUM = 35000;
    // Bonus block num,about 15 days.
    uint256 public constant BONUS_BLOCKNUM = 100000;
    // mint end block num,about 30 days.
    uint256 public constant MINTEND_BLOCKNUM = 200000;
    // The migrator contract. It has a lot of power. Can only be set through governance (owner).
    IMigratorChef public migrator;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Record whether the pair has been added.
    mapping(address => uint256) public lpTokenPID;
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
        address _devaddr,
        uint256 _sakePerBlock,
        uint256 _startBlock
    ) public {
        sake = _sake;
        devaddr = _devaddr;
        sakePerBlock = _sakePerBlock;
        startBlock = _startBlock;
        betaTestEndBlock = startBlock.add(BETATEST_BLOCKNUM);
        bonusEndBlock = startBlock.add(BONUS_BLOCKNUM).add(BETATEST_BLOCKNUM);
        mintEndBlock = startBlock.add(MINTEND_BLOCKNUM).add(BETATEST_BLOCKNUM);
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(uint256 _allocPoint, IERC20 _lpToken, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        require(lpTokenPID[address(_lpToken)] == 0, "SakeMaster:duplicate add.");
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                accSakePerShare: 0
            })
        );
        lpTokenPID[address(_lpToken)] = poolInfo.length;
    }

    // Update the given pool's SAKE allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // Set the migrator contract. Can only be called by the owner.
    function setMigrator(IMigratorChef _migrator) public onlyOwner {
        migrator = _migrator;
    }

    // Handover the saketoken mintage right.
    function handoverSakeMintage(address newOwner) public onlyOwner {
        sake.transferOwnership(newOwner);
    }

    // Migrate lp token to another lp contract. Can be called by anyone. We trust that migrator contract is good.
    function migrate(uint256 _pid) public {
        require(address(migrator) != address(0), "migrate: no migrator");
        PoolInfo storage pool = poolInfo[_pid];
        IERC20 lpToken = pool.lpToken;
        uint256 bal = lpToken.balanceOf(address(this));
        lpToken.safeApprove(address(migrator), bal);
        IERC20 newLpToken = migrator.migrate(lpToken);
        require(bal == newLpToken.balanceOf(address(this)), "migrate: bad");
        pool.lpToken = newLpToken;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        uint256 _toFinal = _to > mintEndBlock ? mintEndBlock : _to;
        if (_toFinal <= betaTestEndBlock) {
             return _toFinal.sub(_from);
        }else if (_from >= mintEndBlock) {
            return 0;
        } else if (_toFinal <= bonusEndBlock) {
            if (_from < betaTestEndBlock) {
                return betaTestEndBlock.sub(_from).add(_toFinal.sub(betaTestEndBlock).mul(BONUSONE_MULTIPLIER));
            } else {
                return _toFinal.sub(_from).mul(BONUSONE_MULTIPLIER);
            }
        } else {
            if (_from < betaTestEndBlock) {
                return betaTestEndBlock.sub(_from).add(bonusEndBlock.sub(betaTestEndBlock).mul(BONUSONE_MULTIPLIER)).add(
                    (_toFinal.sub(bonusEndBlock).mul(BONUSTWO_MULTIPLIER)));
            } else if (betaTestEndBlock <= _from && _from < bonusEndBlock) {
                return bonusEndBlock.sub(_from).mul(BONUSONE_MULTIPLIER).add(_toFinal.sub(bonusEndBlock).mul(BONUSTWO_MULTIPLIER));
            } else {
                return _toFinal.sub(_from).mul(BONUSTWO_MULTIPLIER);
            }
        } 
    }

    // View function to see pending SAKEs on frontend.
    function pendingSake(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accSakePerShare = pool.accSakePerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 sakeReward = multiplier.mul(sakePerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accSakePerShare = accSakePerShare.add(sakeReward.mul(1e12).div(lpSupply));
        }
        return user.amount.mul(accSakePerShare).div(1e12).sub(user.rewardDebt);
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
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        if (multiplier == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 sakeReward = multiplier.mul(sakePerBlock).mul(pool.allocPoint).div(totalAllocPoint);
        sake.mint(devaddr, sakeReward.div(15));
        sake.mint(address(this), sakeReward);
        pool.accSakePerShare = pool.accSakePerShare.add(sakeReward.mul(1e12).div(lpSupply));
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to SakeMaster for SAKE allocation.
    function deposit(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accSakePerShare).div(1e12).sub(user.rewardDebt);
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(pool.accSakePerShare).div(1e12);
        if (pending > 0) safeSakeTransfer(msg.sender, pending);
        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from SakeMaster.
    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "withdraw: not good");
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accSakePerShare).div(1e12).sub(user.rewardDebt);
        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accSakePerShare).div(1e12);
        safeSakeTransfer(msg.sender, pending);
        pool.lpToken.safeTransfer(address(msg.sender), _amount);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount > 0, "emergencyWithdraw: not good");
        uint256 _amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        pool.lpToken.safeTransfer(address(msg.sender), _amount);
        emit EmergencyWithdraw(msg.sender, _pid, _amount);
    }

    // Safe sake transfer function, just in case if rounding error causes pool to not have enough SAKEs.
    function safeSakeTransfer(address _to, uint256 _amount) internal {
        uint256 sakeBal = sake.balanceOf(address(this));
        if (_amount > sakeBal) {
            sake.transfer(_to, sakeBal);
        } else {
            sake.transfer(_to, _amount);
        }
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "dev: wut?");
        devaddr = _devaddr;
    }
}
