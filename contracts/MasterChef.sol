pragma solidity 0.6.12;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SushiToken.sol";


interface Migrator {
    // Perform LP token migration from legacy UniswapV2 to SushiSwap.
    // Take the current LP token address and return the new LP token address.
    // Migrator should have full access to the caller's LP token.
    // Return the new LP token address.
    //
    // XXX Migrator must have allowance access to UniswapV2 LP tokens.
    // SushiSwap must mint EXACTLY the same amount of SushiSwap LP tokens or
    // else something bad will happen. Traditional UniswapV2 does not
    // do that so be careful!
    function migrate(IERC20 token) external returns (IERC20);
}

// MasterChef is the master of Sushi. He can make Sushi and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once SUSHI is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract MasterChef is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 howmany;          // How many SUSHIs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that SUSHIs distribution occurs.
        uint256 accSushiPerShare; // Accumulated SUSHIs per share, times 1e9. See below.
    }

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        //
        // We do some fancy math here. Basically, any point in time, the amount of SUSHIs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accSushiPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accSushiPerShare` (and `lastRewardBlock`) gets updated.
        //
        //   accSushiPerShare += howmany * (block.number - lastRewardBlock) / pool.lpToken.balanceOf(this)
        //   lastRewardBlock = block.number
        //
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated using the following formula:
        //
        //   reward debt = user.amount * pool.accSushiPerShare
    }

    // The SUSHI TOKEN!
    SushiToken public sushi;
    // Dev share ratio, multiplied by the usual 1e9.
    uint256 public devshare = 0.1 * 1e9;
    // Dev address.
    address public devaddr;
    // Block number when bonus SUSHI period ends.
    uint256 public bonusEndBlock;
    // Bonus muliplier for early sushi makers.
    uint256 public constant BONUS_MULTIPLIER = 10;

    // Info of each user that stakes LP tokens.
    mapping (IERC20 => mapping (address => UserInfo)) public userInfo;
    // Info of each pool.
    mapping (IERC20 => PoolInfo) public poolInfo;

    constructor(SushiToken _sushi, address _devaddr, uint256 _bonusEndBlock) public {
        sushi = _sushi;
        devaddr = _devaddr;
        bonusEndBlock = _bonusEndBlock;
    }

    // Add a new token + lp to the pool. Can only be called by the owner.
    function add(IERC20 _token, uint256 _howmany, IERC20 _lpToken, uint256 rewardAt) public onlyOwner {
        require(poolInfo[_token].lpToken == IERC20(address(0)), "add: already there");
        poolInfo[_token] = PoolInfo({
            lpToken: _lpToken,
            howmany: _howmany,
            lastRewardBlock: rewardAt,
            accSushiPerShare: 0
        });
    }

    // Update the given pool's SUSHI per block. Can only be called by the owner.
    function set(IERC20 _token, uint256 _howmany) public onlyOwner {
        require(poolInfo[_token].lpToken != IERC20(address(0)), "set: not there");
        poolInfo[_token].howmany = _howmany;
    }

    // Migrate lp token to another lp contract. Can only be called by the owner.
    function migrate(IERC20 _token, Migrator _migrator) public onlyOwner {
        PoolInfo storage pool = poolInfo[_token];
        IERC20 lpToken = pool.lpToken;
        require(lpToken != IERC20(address(0)), "migrate: wut?");
        uint256 bal = lpToken.balanceOf(address(this));
        lpToken.safeApprove(address(_migrator), bal);
        IERC20 newLpToken = _migrator.migrate(lpToken);
        require(bal == newLpToken.balanceOf(address(this)), "migrate: bad");
        pool.lpToken = newLpToken;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        if (_to <= bonusEndBlock) {
            return _to.sub(_from).mul(BONUS_MULTIPLIER);
        } else if (_from >= bonusEndBlock) {
            return _to.sub(_from);
        } else {
            return bonusEndBlock.sub(_from).mul(BONUS_MULTIPLIER).add(
                _to.sub(bonusEndBlock)
            );
        }
    }

    // View function to see pending SUSHIs on frontend.
    function pendingSushi(IERC20 _token, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_token];
        UserInfo storage user = userInfo[_token][_user];
        require(pool.lpToken != IERC20(address(0)), "pendingSushi: wut?");
        uint256 accSushiPerShare = pool.accSushiPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 sushiReward = multiplier.mul(pool.howmany);
            accSushiPerShare = accSushiPerShare.add(sushiReward.mul(1e9).div(lpSupply));
        }
        return user.amount.mul(accSushiPerShare).div(1e9).sub(user.rewardDebt);
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(PoolInfo storage _pool) internal {
        if (block.number <= _pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = _pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            _pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(_pool.lastRewardBlock, block.number);
        uint256 sushiReward = multiplier.mul(_pool.howmany);
        sushi.mint(devaddr, sushiReward.mul(devshare).div(1e9));
        sushi.mint(address(this), sushiReward);
        _pool.accSushiPerShare = _pool.accSushiPerShare.add(sushiReward.mul(1e9).div(lpSupply));
        _pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for SUSHI allocation.
    function deposit(IERC20 _token, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_token];
        UserInfo storage user = userInfo[_token][msg.sender];
        require(pool.lpToken != IERC20(address(0)), "deposit: wut?");
        updatePool(pool);
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accSushiPerShare).div(1e9).sub(user.rewardDebt);
            safeSushiTransfer(msg.sender, pending);
        }
        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(pool.accSushiPerShare).div(1e9);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(IERC20 _token, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_token];
        UserInfo storage user = userInfo[_token][msg.sender];
        require(pool.lpToken != IERC20(address(0)), "withdraw: wut?");
        require(user.amount >= _amount, "withdraw: not good");
        updatePool(pool);
        uint256 pending = user.amount.mul(pool.accSushiPerShare).div(1e9).sub(user.rewardDebt);
        safeSushiTransfer(msg.sender, pending);
        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accSushiPerShare).div(1e9);
        pool.lpToken.safeTransfer(address(msg.sender), _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(IERC20 _token) public {
        PoolInfo storage pool = poolInfo[_token];
        UserInfo storage user = userInfo[_token][msg.sender];
        require(pool.lpToken != IERC20(address(0)), "emergencyWithdraw: wut?");
        user.amount = 0;
        user.rewardDebt = 0;
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
    }

    // Safe sushi transfer function, just in case if rounding error causes pool to not have enough SUSHIs.
    function safeSushiTransfer(address _to, uint256 _amount) internal {
        uint256 sushiBal = sushi.balanceOf(address(this));
        if (_amount > sushiBal) {
            sushi.transfer(_to, sushiBal);
        } else {
            sushi.transfer(_to, _amount);
        }
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "dev: wut?");
        devaddr = _devaddr;
    }
}