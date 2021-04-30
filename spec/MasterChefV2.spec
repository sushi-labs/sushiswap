/*
 * This is a specification file for MasterChefV2's formal verification
 * using the Certora prover.
 *
 * Run this file with scripts/_runMasterChefV2.sh
 */

 // All Passing!
 // https://vaas-stg.certora.com/output/98097/c443354e2e1cfb6b8ea9/?anonymousKey=bc4773712edd34794176ca790871bbd8a299e0f4

// Declaration of contracts used in the sepc 
using DummyERC20A as tokenA
using DummyERC20B as tokenB
using DummySUSHI as sushiToken

/*
 * Declaration of methods that are used in the rules.
 * envfree indicate that the method is not dependent on the environment (msg.value, msg.sender).
 * Methods that are not declared here are assumed to be dependent on env.
 */
methods {
	// Getters for the internals
	userInfoAmount(uint256 pid, address user) returns (uint256) envfree 
	userInfoRewardDebt(uint256 pid, address user) returns (int256) envfree 
	userLpTokenBalanceOf(uint256 pid, address user) returns (uint256) envfree

	poolInfoAccSushiPerShare(uint256 pid) returns (uint128) envfree
	poolInfoLastRewardBlock(uint256 pid) returns (uint64) envfree
	poolInfoAllocPoint(uint256 pid) returns (uint64) envfree
	totalAllocPoint() returns (uint256) envfree

	lpToken(uint256 pid) returns (address) envfree
	rewarder(uint256 pid) returns (address) envfree

	// ERC20 
	balanceOf(address) => DISPATCHER(true) 
	totalSupply() => DISPATCHER(true)
	transferFrom(address from, address to, uint256 amount) => DISPATCHER(true)
	transfer(address to, uint256 amount) => DISPATCHER(true)
	approve(address t, uint256 amount) => NONDET
	permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) => NONDET
	
	// General Helpers
	compare(int256 x, int256 y) returns (bool) envfree // Helper to check <= for int256
	compareUint128(uint128 x, uint128 y) returns (bool) envfree // Helper to check >= for uint128

	// Helper Invariant Functions
	poolLength() returns (uint256) envfree
	lpTokenLength() returns (uint256) envfree
	rewarderLength() returns (uint256) envfree

	// SUSHI token
	SUSHI() returns (address) envfree

	// Rewarder
	onSushiReward(uint256, address, address, uint256, uint256) => NONDET

	// MasterChefV1
	deposit(uint256 pid, uint256 amount) => NONDET

	migrate(address _lpToken) => NONDET
}

// Constants

definition MAX_UINT256() returns uint256 =
	0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

// extract allocPoint field form the poolInfo packed struct
definition PoolInfo_allocPoint(uint256 poolInfo) returns uint256 =
	(poolInfo & 0xffffffffffffffff000000000000000000000000000000000000000000000000) >>> 192;

ghost allocPointSum() returns uint256 {
    init_state axiom allocPointSum() == 0;
}

// On an update to poolInfo[pid].allocPoint = newAllocPoint
// where poolInfo[pid].allocPoint == oldAllocPoint before the assignment
// We update allocPointSum() := allocPointSum() + newAllocPoint - oldAllocPoint
hook Sstore poolInfo[INDEX uint pid].(offset 0) uint newPoolInfo (uint oldPoolInfo) STORAGE {
    uint256 oldAllocPoint = PoolInfo_allocPoint(oldPoolInfo);
    uint256 newAllocPoint = PoolInfo_allocPoint(newPoolInfo);
    havoc allocPointSum assuming allocPointSum@new() ==
                                     allocPointSum@old() + newAllocPoint - oldAllocPoint;
}

// Invariants

invariant integrityOfLength() 
	poolLength() == lpTokenLength() && lpTokenLength() == rewarderLength()

invariant validityOfLpToken(uint256 pid, address user)
	(userInfoAmount(pid, user) > 0) => (lpToken(pid) != 0)

// Invariants as Rules

rule integrityOfTotalAllocPoint(method f) {
	env e;
	require allocPointSum() == totalAllocPoint();
	// Since the tool doesn't support ghost with addition as changes, we
	// have to treat add as a special case
	if (f.selector == add(uint256, address, address).selector) {
		uint256 before = totalAllocPoint();
		uint256 allocPoint;
		address _lpToken;
		address _rewarder;
		add(e, allocPoint, _lpToken, _rewarder);
		assert totalAllocPoint() == before + allocPoint;
	}
	else {
		calldataarg args;
		f(e,args);
		assert allocPointSum() == totalAllocPoint();
	}
}

rule monotonicityOfAccSushiPerShare(uint256 pid, method f) {
	env e;

	uint128 _poolInfoAccSushiPerShare = poolInfoAccSushiPerShare(pid);

	calldataarg args;
	f(e, args);

	uint128 poolInfoAccSushiPerShare_ = poolInfoAccSushiPerShare(pid);

	assert compareUint128(poolInfoAccSushiPerShare_, _poolInfoAccSushiPerShare);
}

rule monotonicityOfLastRewardBlock(uint256 pid, method f) {
	env e;

	uint64 _poolInfoLastRewardBlock = poolInfoLastRewardBlock(pid);

	calldataarg args;
	f(e, args);

	uint64 poolInfoLastRewardBlock_ = poolInfoLastRewardBlock(pid);

	assert(poolInfoLastRewardBlock_ >= _poolInfoLastRewardBlock, 
		   "poolInfo lastRewardBlock not monotonic");
}

// Rules

// rule sanity(method f) {
// 	env e;
// 	calldataarg args;
// 	f(e, args);
// 	assert(false);
// }

rule noChangeToOtherUsersAmount(method f, uint256 pid, uint256 amount,
								address other, address to) {
	env e;

	require other != e.msg.sender;

	uint256 _userInfoAmount = userInfoAmount(pid, other);

	if (f.selector == deposit(uint256, uint256, address).selector) {
		deposit(e, pid, amount, to);
	} else {
		calldataarg args;
		f(e, args);
	}

	uint256 userInfoAmount_ = userInfoAmount(pid, other);

	 // to should only be limited in deposit
	if (f.selector == deposit(uint256, uint256, address).selector && other == to) {
		assert(_userInfoAmount <= userInfoAmount_, "other's user amount changed");
	} else {
		assert(_userInfoAmount == userInfoAmount_, "other's user amount changed");
	}
}

rule noChangeToOtherUsersRewardDebt(method f, uint256 pid, uint256 amount,
								address other, address to) {
	env e;

	require other != e.msg.sender;

	int256 _userInfoRewardDebt = userInfoRewardDebt(pid, other);

	if (f.selector == deposit(uint256, uint256, address).selector) {
		deposit(e, pid, amount, to);
	} else {
		calldataarg args;
		f(e, args);
	}

	int256 userInfoRewardDebt_ = userInfoRewardDebt(pid, other);

	// to should only be limited in deposit
	if (f.selector == deposit(uint256, uint256, address).selector && other == to) {
		assert(compare(_userInfoRewardDebt, userInfoRewardDebt_), "other's user rewardDebt changed");
	} else {
		assert(_userInfoRewardDebt == userInfoRewardDebt_, "other's user rewardDebt changed");
	}
}

rule noChangeToOtherPool(uint256 pid, uint256 otherPid) {
	require pid != otherPid;

	uint128 _otherAccSushiPerShare = poolInfoAccSushiPerShare(otherPid);
	uint64 _otherLastRewardBlock = poolInfoLastRewardBlock(otherPid);
	uint64 _otherAllocPoint = poolInfoAllocPoint(otherPid);

	method f;
	address msgSender;
	require f.selector != massUpdatePools(uint256[]).selector;
	address to;

	callFunctionWithParams(f, pid, msgSender, to);

	uint128 otherAccSushiPerShare_ = poolInfoAccSushiPerShare(otherPid);
	uint64 otherLastRewardBlock_ = poolInfoLastRewardBlock(otherPid);
	uint64 otherAllocPoint_ = poolInfoAllocPoint(otherPid);

	assert(_otherAccSushiPerShare == otherAccSushiPerShare_, "accSushiPerShare changed");

	assert(_otherLastRewardBlock == otherLastRewardBlock_, "lastRewardBlock changed");

	assert(_otherAllocPoint == otherAllocPoint_, "allocPoint changed");
}

rule preserveTotalAssetOfUser(method f, uint256 pid, address user,
					          address to, uint256 amount) {
	require f.selector != init(address).selector;
	env e;

	require lpToken(pid) == tokenA;

	require user == e.msg.sender && user == to && user != currentContract;
	require SUSHI() != lpToken(pid); // <-- check this again (Nurit)

	uint256 _totalUserAssets = tokenA.balanceOf(e, user) + userInfoAmount(pid, user);

	if (f.selector == deposit(uint256, uint256, address).selector) {
		deposit(e, pid, amount, to);
	} else if (f.selector == withdraw(uint256, uint256, address).selector) {
		withdraw(e, pid, amount, to);
	} else if (f.selector == emergencyWithdraw(uint256, address).selector) {
		emergencyWithdraw(e, pid, to);
	} else if (f.selector == withdrawAndHarvest(uint256,uint256,address).selector) {
		withdrawAndHarvest(e, pid, amount, to);
	} else {
		calldataarg args;
		f(e, args);
	}

	uint256 totalUserAssets_ = tokenA.balanceOf(e, user) + userInfoAmount(pid, user);

	assert(_totalUserAssets == totalUserAssets_,
		   "total user balance is not preserved");
}

rule changeToAtmostOneUserAmount(uint256 pid, address u, address v, method f) {
	env e;
	require u != v;
	require u != currentContract && v != currentContract;
	require lpToken(pid) == tokenA;

	uint256 _balanceU = tokenA.balanceOf(e, u);
	uint256 _balanceV = tokenA.balanceOf(e, v);

	calldataarg args;
	f(e,args);

	uint256 balanceU_ = tokenA.balanceOf(e, u);
	uint256 balanceV_ = tokenA.balanceOf(e, v);

	assert !(balanceV_ != _balanceV && balanceU_ != _balanceU);
}

rule solvency(uint256 pid, address u, address lptoken, method f) {
	require lptoken == lpToken(pid);
	require lptoken != SUSHI();

	uint256 _balance = userLpTokenBalanceOf(pid, currentContract); // TODO - maybe rename this to LpTokenBalanceOf
	uint256 _userAmount = userInfoAmount(pid, u); 

	address sender;
	require sender != currentContract;

	address to;
	require to != currentContract;

	callFunctionWithParams(f, pid, sender, to);

	uint256 userAmount_ = userInfoAmount(pid, u); 
	uint256 balance_ = userLpTokenBalanceOf(pid, currentContract); 

	assert userAmount_ != _userAmount => (userAmount_ - _userAmount == balance_ - _balance);
}

rule sushiGivenInHarvestEqualsPendingSushi(uint256 pid, address user, address to) {
	env e;

	require to == user && user != currentContract && e.msg.sender == user;
	require sushiToken == SUSHI();

	uint256 userSushiBalance = sushiToken.balanceOf(e, user);
	uint256 userPendingSushi = pendingSushi(e, pid, user);

	// Does success return value matters? Check with Nurit
	harvest(e, pid, to);

	uint256 userSushiBalance_ = sushiToken.balanceOf(e, user);

	assert(userSushiBalance_ == (userSushiBalance + userPendingSushi),
		   "pending sushi not equal to the sushi given in harvest");
}

rule additivityOfDepositOnAmount(uint256 pid, uint256 x, uint256 y, address to) {
	env e;
	storage initStorage = lastStorage;

	deposit(e, pid, x, to);
	deposit(e, pid, y, to);

	uint256 splitScenarioToAmount = userInfoAmount(pid, to);
	uint256 splitScenarioSenderBalanceOf = userLpTokenBalanceOf(pid, e.msg.sender);

	require x + y <= MAX_UINT256();
	uint256 sum = x + y;
	deposit(e, pid, sum, to) at initStorage;
	
	uint256 sumScenarioToAmount = userInfoAmount(pid, to);
	uint256 sumScenarioSenderBalanceOf = userLpTokenBalanceOf(pid, e.msg.sender);

	assert(splitScenarioToAmount == sumScenarioToAmount, 
		   "deposit is not additive on amount");

	assert(splitScenarioSenderBalanceOf == sumScenarioSenderBalanceOf, 
		   "deposit is not additive on amount");
}

rule additivityOfWithdrawOnAmount(uint256 pid, uint256 x, uint256 y, address to) {
	env e;
	storage initStorage = lastStorage;

	withdraw(e, pid, x, to);
	withdraw(e, pid, y, to);

	uint256 splitScenarioSenderAmount = userInfoAmount(pid, e.msg.sender);
	uint256 splitScenarioToBalanceOf = userLpTokenBalanceOf(pid, to);

	require x + y <= MAX_UINT256();
	uint256 sum = x + y;
	withdraw(e, pid, sum, to) at initStorage;
	
	uint256 sumScenarioSenderAmount = userInfoAmount(pid, e.msg.sender);
	uint256 sumScenarioToBalanceOf = userLpTokenBalanceOf(pid, to);

	assert(splitScenarioSenderAmount == sumScenarioSenderAmount, 
		   "withdraw is not additive on amount");

	assert(splitScenarioToBalanceOf == sumScenarioToBalanceOf, 
		   "withdraw is not additive on amount");
}

// Helper Functions

// easy to use dispatcher (to call all methods with the same pid)
function callFunctionWithParams(method f, uint256 pid, address sender, address to) {
	env e;
	uint256 allocPoint;
	bool overwrite;
	uint256 amount;
	address rewarder;

	require e.msg.sender == sender;

	if (f.selector == set(uint256, uint256, address, bool).selector) {
		set(e, pid, allocPoint, rewarder, overwrite);
	} else if (f.selector == pendingSushi(uint256, address).selector) {
		pendingSushi(e, pid, to);
	} else if (f.selector == updatePool(uint256).selector) {
		updatePool(e, pid);
	} else if (f.selector == deposit(uint256, uint256, address).selector) {
		deposit(e, pid, amount, to);
	} else if (f.selector == withdraw(uint256, uint256, address).selector) {
		withdraw(e, pid, amount, to); 
	} else if (f.selector == harvest(uint256, address).selector) {
		harvest(e, pid, to);
	} else if (f.selector == emergencyWithdraw(uint256, address).selector) {
		emergencyWithdraw(e, pid, to);
	} else if (f.selector == withdrawAndHarvest(uint256,uint256,address).selector) {
		withdrawAndHarvest(e, pid, amount, to);
	}
	else {
		calldataarg args;
		f(e,args);
	}
}