/*
 * This is a specification file for MasterChefV2's formal verification
 * using the Certora prover.
 *
 * Run this file with scripts/_runMasterChefV2Simplified.sh
 */

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
	userLpTokenBalanceOf(uint256 pid, address user) returns (uint256) envfree // NOT USED

	poolInfoAccSushiPerShare(uint256 pid) returns (uint128) envfree
	poolInfoLastRewardBlock(uint256 pid) returns (uint64) envfree
	poolInfoAllocPoint(uint256 pid) returns (uint64) envfree
	totalAllocPoint() returns (uint256) envfree

	lpToken(uint256 pid) returns (address) envfree
	rewarder(uint256 pid) returns (address) envfree

	// overrided methods
	sushiPerBlock() returns (uint256 amount)

	// ERC20 
	balanceOf(address) => DISPATCHER(true) 
	totalSupply() => DISPATCHER(true)
	transferFrom(address from, address to, uint256 amount) => DISPATCHER(true)
	transfer(address to, uint256 amount) => DISPATCHER(true)
	approve(address t, uint256 amount) => NONDET
	permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) => NONDET
	
	// General Helpers
	compare(int256 x, int256 y) returns (bool) envfree // Helper to check <= for int256
	intEquality(int256 x, int256 y) returns (bool) envfree // Helper to check int equality
	compareUint128(uint128 x, uint128 y) returns (bool) envfree // Helper to check >= for uint128 // NOT USED
	intDeltaOne(int256 x, int256 y) returns (bool) envfree // Helper to allow a difference of 1 for int256
	sub(uint256 a, int256 b) returns (int256) envfree // NOT USED
	sub(int256 a, int256 b) returns (int256) envfree // NOT USED
	sub(uint256 a, uint256 b) returns (int256) envfree // NOT USED
	mul(uint256 a, uint256 b) returns (uint256) envfree // NOT USED

	// Helper Invariant Functions
	poolLength() returns (uint256) envfree
	lpTokenLength() returns (uint256) envfree // NOT USED
	rewarderLength() returns (uint256) envfree // NOT USED

	// SUSHI token
	SUSHI() returns (address) envfree // NOT USED
	sushiToken.balanceOf(address) returns (uint256) // NOT USED

	// Dummy ERC20
	tokenA.balanceOf(address) returns (uint256) // NOT USED
	tokenB.balanceOf(address) returns (uint256) // NOT USED

	// Rewarder
	// SIG_ON_SUSHI_REWARD = 0xbb6cc2ef; // onSushiReward(uint256,address,uint256)
	0xbb6cc2ef => NONDET

	// MasterChefV1
	deposit(uint256 pid, uint256 amount) => NONDET

	lpSupply(uint256 pid) returns (uint256) envfree
}

// Constants

definition MAX_UINT64() returns uint64 = 0xFFFFFFFFFFFFFFFF;

definition MAX_UINT256() returns uint256 =
	0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF;

// Rules

// Passing
// https://vaas-stg.certora.com/output/98097/dae7846ec701c26a71f1/?anonymousKey=b93a6af989f37e9a2acae07e373e65fd2355fa2a
rule depositThenWithdraw(uint256 pid, address user, uint256 amount, address to) {
	env e;

	require e.msg.sender == to;

	uint256 _userInfoAmount = userInfoAmount(pid, user);
	int256 _userInfoRewardDebt = userInfoRewardDebt(pid, user);

	deposit(e, pid, amount, to);
	withdraw(e, pid, amount, to);

	uint256 userInfoAmount_ = userInfoAmount(pid, user);
	int256 userInfoRewardDebt_ = userInfoRewardDebt(pid, user);

	assert(_userInfoAmount == userInfoAmount_, "user amount changed");
	assert(intEquality(_userInfoRewardDebt, userInfoRewardDebt_),
		   "user reward debt changed");
}