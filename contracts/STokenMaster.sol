pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SakeToken.sol";

contract STokenMaster is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount; // How many  tokens the user has provided,LP+SToken*multiplier.
        uint256 amountStoken; // How many S tokens the user has provided.
        uint256 amountLPtoken; // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of SAKEs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accSakePerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws S tokens to a pool. Here's what happens:
        //   1. The pool's `accSakePerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken; // Address of LP token contract.
        IERC20 sToken; // Address of S token contract.
        uint256 allocPoint; // How many allocation points assigned to this pool. SAKEs to distribute per block.
        uint256 lastRewardBlock; // Last block number that SAKEs distribution occurs.
        uint256 accSakePerShare; // Accumulated SAKEs per share, times 1e12. See below.
        uint256 burnSakeAmount;
        bool withdrawSwitch; // if true,user can withdraw lp,otherwise can not
    }

    // The SAKE TOKEN!
    SakeToken public sake;
    address public admin;
    // The address to receive LP token fee and S token fee.
    address public tokenFeeReceiver;
    uint256 public sakePerBlock;
    // S token converted to LP token's multiplier
    uint256 public multiplierSToken;
    // Total allocation poitns. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when SAKE mining starts.
    uint256 public startBlock;
    // Block number of distributing bonus SAKE period ends.
    uint256 public bonusEndBlock;
    // The block number when SAKE mining ends.
    uint256 public endBlock;
    // bonus block num, about 30 days.
    uint256 public constant BONUS_BLOCKNUM = 192000;
    // Bonus muliplier.
    uint256 public constant BONUS_MULTIPLIER = 2;
    // The ratio of withdraw lp fee (1%)
    uint8 public feeRatio = 1;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP Tokens and S tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amountLPtoken, uint256 amountStoken);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amountLPtoken, uint256 amountStoken);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amountLPtoken, uint256 amountStoken);
    event BurnSakeForPool(address indexed user, uint256 indexed pid, uint256 amount);

    constructor(
        SakeToken _sake,
        address _admin,
        address _tokenFeeReceiver,
        uint256 _multiplierSToken,
        uint256 _sakePerBlock,
        uint256 _startBlock,
        uint256 _endBlock
    ) public {
        sake = _sake;
        admin = _admin;
        tokenFeeReceiver = _tokenFeeReceiver;
        multiplierSToken = _multiplierSToken;
        sakePerBlock = _sakePerBlock;
        startBlock = _startBlock;
        endBlock = _endBlock;
        bonusEndBlock = startBlock.add(BONUS_BLOCKNUM);
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    function _checkValidity(IERC20 _lpToken, IERC20 _sToken) internal view {
        for (uint256 i = 0; i < poolInfo.length; i++) {
            require(poolInfo[i].lpToken != _lpToken && poolInfo[i].sToken != _sToken, "pool exist");
        }
    }

    // Add a new lp token and S token to the pool. Can only be called by the admin.
    function add(
        uint256 _allocPoint,
        IERC20 _lpToken,
        IERC20 _sToken,
        bool _withUpdate
    ) public {
        require(msg.sender == admin, "add:Call must come from admin.");
        if (_withUpdate) {
            massUpdatePools();
        }
        _checkValidity(_lpToken, _sToken);
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                sToken: _sToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                accSakePerShare: 0,
                burnSakeAmount: 0,
                withdrawSwitch: false
            })
        );
    }

    // Update the given pool's SAKE allocation point. Can only be called by the admin.
    function set(
        uint256 _pid,
        uint256 _allocPoint,
        bool _withUpdate
    ) public {
        require(msg.sender == admin, "set:Call must come from admin.");
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    // set withdraw switch. Can only be called by the admin.
    function setWithdrawSwitch(
        uint256 _pid,
        bool _withdrawSwitch,
        bool _withUpdate
    ) public {
        require(msg.sender == admin, "s:Call must come from admin.");
        if (_withUpdate) {
            massUpdatePools();
        }
        poolInfo[_pid].withdrawSwitch = _withdrawSwitch;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        uint256 _toFinal = _to > endBlock ? endBlock : _to;
        if (_from >= endBlock) {
            return 0;
        } else {
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
    }

    // View function to see pending SAKEs on frontend.
    function pendingSake(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accSakePerShare = pool.accSakePerShare;
        uint256 lpTokenSupply = pool.lpToken.balanceOf(address(this));
        uint256 sTokenSupply = pool.sToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpTokenSupply != 0) {
            uint256 totalSupply = lpTokenSupply.add(sTokenSupply.mul(multiplierSToken));
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 sakeReward = multiplier.mul(sakePerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accSakePerShare = accSakePerShare.add(sakeReward.mul(1e12).div(totalSupply));
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
        uint256 lpTokenSupply = pool.lpToken.balanceOf(address(this));
        uint256 sTokenSupply = pool.sToken.balanceOf(address(this));

        if (lpTokenSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        if (multiplier == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 totalSupply = lpTokenSupply.add(sTokenSupply.mul(multiplierSToken));
        uint256 sakeReward = multiplier.mul(sakePerBlock).mul(pool.allocPoint).div(totalAllocPoint);
        if (sake.owner() == address(this)) {
            sake.mint(address(this), sakeReward);
        }
        pool.accSakePerShare = pool.accSakePerShare.add(sakeReward.mul(1e12).div(totalSupply));
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens and S tokens to STokenMaster for SAKE allocation.
    function deposit(
        uint256 _pid,
        uint256 _amountlpToken,
        uint256 _amountsToken
    ) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        if (_amountlpToken <= 0) {
            require(user.amountLPtoken > 0, "deposit:invalid");
        }
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accSakePerShare).div(1e12).sub(user.rewardDebt);
        user.amountLPtoken = user.amountLPtoken.add(_amountlpToken);
        user.amountStoken = user.amountStoken.add(_amountsToken);
        user.amount = user.amount.add(_amountlpToken.add(_amountsToken.mul(multiplierSToken)));
        user.rewardDebt = user.amount.mul(pool.accSakePerShare).div(1e12);
        if (pending > 0) _safeSakeTransfer(msg.sender, pending);
        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amountlpToken);
        pool.sToken.safeTransferFrom(address(msg.sender), address(this), _amountsToken);
        emit Deposit(msg.sender, _pid, _amountlpToken, _amountsToken);
    }

    // Withdraw LP tokens from STokenMaster.
    function withdraw(
        uint256 _pid,
        uint256 _amountLPtoken,
        uint256 _amountStoken
    ) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(pool.withdrawSwitch, "withdraw: not allow");
        require(
            user.amountLPtoken >= _amountLPtoken && user.amountStoken >= _amountStoken,
            "withdraw: amount not enough"
        );
        updatePool(_pid);
        uint256 pending = user.amount.mul(pool.accSakePerShare).div(1e12).sub(user.rewardDebt);
        user.amount = user.amount.sub(_amountLPtoken).sub(_amountStoken.mul(multiplierSToken));
        user.amountLPtoken = user.amountLPtoken.sub(_amountLPtoken);
        user.amountStoken = user.amountStoken.sub(_amountStoken);
        user.rewardDebt = user.amount.mul(pool.accSakePerShare).div(1e12);
        if (pending > 0) _safeSakeTransfer(msg.sender, pending);
        uint256 lpTokenFee = _amountLPtoken.mul(feeRatio).div(100);
        uint256 lpTokenToUser = _amountLPtoken.sub(lpTokenFee);
        pool.lpToken.safeTransfer(tokenFeeReceiver, lpTokenFee);
        pool.lpToken.safeTransfer(address(msg.sender), lpTokenToUser);
        uint256 sTokenFee = _amountStoken.mul(feeRatio).div(100);
        uint256 sTokenToUser = _amountStoken.sub(sTokenFee);
        pool.sToken.safeTransfer(tokenFeeReceiver, sTokenFee);
        pool.sToken.safeTransfer(address(msg.sender), sTokenToUser);
        emit Withdraw(msg.sender, _pid, lpTokenToUser, sTokenToUser);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(pool.withdrawSwitch, "withdraw: not allow");
        require(user.amountLPtoken > 0 || user.amountStoken > 0, "withdraw: amount not enough");
        uint256 _amountLPtoken = user.amountLPtoken;
        uint256 _amountStoken = user.amountStoken;
        user.amount = 0;
        user.amountLPtoken = 0;
        user.amountStoken = 0;
        user.rewardDebt = 0;
        uint256 lpTokenToUser;
        uint256 sTokenToUser;
        if (_amountLPtoken > 0) {
            uint256 lpTokenFee = _amountLPtoken.mul(feeRatio).div(100);
            lpTokenToUser = _amountLPtoken.sub(lpTokenFee);
            pool.lpToken.safeTransfer(tokenFeeReceiver, lpTokenFee);
            pool.lpToken.safeTransfer(address(msg.sender), lpTokenToUser);
        }
        if (_amountStoken > 0) {
            uint256 sTokenFee = _amountStoken.mul(feeRatio).div(100);
            sTokenToUser = _amountStoken.sub(sTokenFee);
            pool.sToken.safeTransfer(tokenFeeReceiver, sTokenFee);
            pool.sToken.safeTransfer(address(msg.sender), sTokenToUser);
        }
        emit EmergencyWithdraw(msg.sender, _pid, lpTokenToUser, sTokenToUser);
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

    // Update admin address by owner.
    function setAdmin(address _adminaddr) public onlyOwner {
        require(_adminaddr != address(0), "invalid address");
        admin = _adminaddr;
    }

    // update endBlock by owner
    function setEndBlock(uint256 _endBlock) public {
        require(msg.sender == admin, "end:Call must come from admin.");
        require(endBlock > startBlock, "invalid endBlock");
        endBlock = _endBlock;
    }

    // Burn sake increase pool allocpoint
    function burnSakeForPool(uint256 _pid, uint256 _amount) public {
        require(_amount > 0, "invalid amount");
        require(sake.transferFrom(msg.sender, address(2), _amount), "transfer sake fail");
        PoolInfo storage pool = poolInfo[_pid];
        pool.burnSakeAmount = pool.burnSakeAmount.add(_amount);
        emit BurnSakeForPool(msg.sender, _pid, _amount);
    }

    // set multiplier for S token converted to LP token
    function setMultiplierSToken(uint256 _multiplier) public {
        require(msg.sender == admin, "m:Call must come from admin.");
        require(_multiplier > 0, "invalid multiplier");
        multiplierSToken = _multiplier;
    }

    // set sakePerBlock
    function setSakePerBlock(uint256 _sakePerBlock) public {
        require(msg.sender == admin, "p:Call must come from admin.");
        require(_sakePerBlock > 0, "invalid sakePerBlock");
        sakePerBlock = _sakePerBlock;
    }
}
