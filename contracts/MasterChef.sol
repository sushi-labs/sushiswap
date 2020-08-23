pragma solidity 0.6.12;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/EnumerableSet.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./SushiToken.sol";


interface Migrator {
    // Perform LP token migration from legacy UniswapV2 to SushiSwap.
    // Take ERC20 token address and return the new LP token address.
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
        uint256 accSushiPerShare; // Accumulated SUSHIs per share, times 1e18. See below.
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
        //   accSushiPerShare += howmany(+bonus?) * (block.number - lastRewardBlock) / pool.lpToken.balanceOf(this)
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
    // List of ERC20 tokens available for cooking.
    IERC20[] public tokens;
    // Dev share ratio, multiplied by the usual 1e18.
    uint256 public devshare = 0.1 * 1e18;
    // Dev address.
    address public devaddr;
    // The bonus multiplier before pool migration is complete. 
    uint256 public bonusMultiplier = 10;
    // Whether the migration has happened.
    bool public migrated;

    // Info of each user that stakes LP tokens.
    mapping (IERC20 => mapping (address => UserInfo)) public userInfo;
    // Info of each pool.
    mapping (IERC20 => PoolInfo) public poolInfo;

    constructor(
        SushiToken _sushi,
        IERC20[] memory _tokens, 
        uint256[] memory _howmany,
        IERC20[] memory _lpTokens,
        uint256 startRewardBlock
    ) public {
        sushi = _sushi;
        for (uint256 idx = 0; idx < _tokens.length; ++idx) {
            tokens.push(_tokens[idx]);
            poolInfo[_tokens[idx]] = PoolInfo({
                lpToken: _lpTokens[idx],
                howmany: _howmany[idx],
                lastRewardBlock: startRewardBlock,
                accSushiPerShare: 0
            });
        }
        devaddr = msg.sender;
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(PoolInfo storage _pool) internal {
        if (block.number <= _pool.lastRewardBlock) {
            return;
        }
        uint256 blockCount = _pool.lastRewardBlock.sub(block.number);
        uint256 sushiReward = blockCount.mul(_pool.howmany);
        if (!migrated) {
            sushiReward = sushiReward.mul(bonusMultiplier);
        }
        sushi.mint(devaddr, sushiReward.mul(devshare).div(1e18));
        sushi.mint(address(this), sushiReward);
        _pool.accSushiPerShare = _pool.accSushiPerShare.add(
            sushiReward.mul(1e18).div(_pool.lpToken.balanceOf(address(this)))
        );
        _pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for SUSHI allocation.
    function deposit(IERC20 _token, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_token];
        UserInfo storage user = userInfo[_token][msg.sender];
        require(pool.lpToken != IERC20(address(0)), "deposit: wut?");
        updatePool(pool);
        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accSushiPerShare).div(1e18).sub(user.rewardDebt);
            sushi.transfer(msg.sender, pending);
        }
        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(pool.accSushiPerShare).div(1e18);
    }

    // Withdraw LP tokens from MasterChel.
    function withdraw(IERC20 _token, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_token];
        UserInfo storage user = userInfo[_token][msg.sender];
        require(pool.lpToken != IERC20(address(0)), "withdraw: wut?");
        require(user.amount > _amount, "withdraw: not good");
        updatePool(pool);
        uint256 pending = user.amount.mul(pool.accSushiPerShare).div(1e18).sub(user.rewardDebt);
        sushi.transfer(msg.sender, pending);
        pool.lpToken.safeTransfer(address(msg.sender), _amount);
        user.amount = user.amount.sub(_amount);
        user.rewardDebt = user.amount.mul(pool.accSushiPerShare).div(1e18);
    }
}