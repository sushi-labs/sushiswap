// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import {Multicall} from "./abstract/Multicall.sol";
import {SelfPermit} from "./abstract/SelfPermit.sol";
import {Transfer} from "./libraries/Transfer.sol";
import {IBentoBoxMinimal} from "./interfaces/IBentoBoxMinimal.sol";
import {IMasterDeployer} from "./interfaces/IMasterDeployer.sol";
import {IPool} from "./interfaces/IPool.sol";
import {ITridentRouter} from "./interfaces/ITridentRouter.sol";
import {IWETH9} from "./interfaces/IWETH9.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @dev Custom Errors
error NotWethSender();
error TooLittleReceived();
error NotEnoughLiquidityMinted();
error IncorrectTokenWithdrawn();
error IncorrectSlippageParams();
error InsufficientWETH();
error InvalidPool();

/// @notice Router contract that helps in swapping across Trident pools.
contract TridentRouter is ITridentRouter, SelfPermit, Multicall {
    using Transfer for address;

    /// @notice BentoBox token vault.
    IBentoBoxMinimal public immutable bento;

    /// @notice Master deployer.
    IMasterDeployer public immutable masterDeployer;

    /// @notice ERC-20 token for wrapped ETH (v9).
    address internal immutable wETH;

    /// @notice The user should use 0x0 if they want to use native currency, e.g., ETH.
    address constant USE_NATIVE = address(0);

    constructor(
        IBentoBoxMinimal _bento,
        IMasterDeployer _masterDeployer,
        address _wETH
    ) {
        bento = _bento;
        masterDeployer = _masterDeployer;
        wETH = _wETH;
        _bento.registerProtocol();
    }

    receive() external payable {
        if (msg.sender != wETH) revert NotWethSender();
    }

    /// @notice Swaps token A to token B directly. Swaps are done on `bento` tokens.
    /// @param params This includes the address of token A, pool, amount of token A to swap,
    /// minimum amount of token B after the swap and data required by the pool for the swap.
    /// @dev Ensure that the pool is trusted before calling this function. The pool can steal users' tokens.
    function exactInputSingle(ExactInputSingleParams calldata params) public payable returns (uint256 amountOut) {
        // Prefund the pool with token A.
        bento.transfer(params.tokenIn, msg.sender, params.pool, params.amountIn);
        // Trigger the swap in the pool.
        amountOut = IPool(params.pool).swap(params.data);
        // Ensure that the slippage wasn't too much. This assumes that the pool is honest.
        if (amountOut < params.amountOutMinimum) revert TooLittleReceived();
    }

    /// @notice Swaps token A to token B indirectly by using multiple hops.
    /// @param params This includes the addresses of the tokens, pools, amount of token A to swap,
    /// minimum amount of token B after the swap and data required by the pools for the swaps.
    /// @dev Ensure that the pools are trusted before calling this function. The pools can steal users' tokens.
    function exactInput(ExactInputParams calldata params) public payable returns (uint256 amountOut) {
        // Pay the first pool directly.
        bento.transfer(params.tokenIn, msg.sender, params.path[0].pool, params.amountIn);
        // Call every pool in the path.
        // Pool `N` should transfer its output tokens to pool `N+1` directly.
        // The last pool should transfer its output tokens to the user.
        // If the user wants to unwrap `wETH`, the final destination should be this contract and
        // a batch call should be made to `unwrapWETH`.
        uint256 n = params.path.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            amountOut = IPool(params.path[i].pool).swap(params.path[i].data);
        }
        // Ensure that the slippage wasn't too much. This assumes that the pool is honest.
        if (amountOut < params.amountOutMinimum) revert TooLittleReceived();
    }

    /// @notice Swaps token A to token B directly. It's the same as `exactInputSingle` except
    /// it takes raw ERC-20 tokens from the users and deposits them into `bento`.
    /// @param params This includes the address of token A, pool, amount of token A to swap,
    /// minimum amount of token B after the swap and data required by the pool for the swap.
    /// @dev Ensure that the pool is trusted before calling this function. The pool can steal users' tokens.
    function exactInputSingleWithNativeToken(ExactInputSingleParams calldata params) public payable returns (uint256 amountOut) {
        // Deposits the native ERC-20 token from the user into the pool's `bento`.
        _depositToBentoBox(params.tokenIn, params.pool, params.amountIn);
        // Trigger the swap in the pool.
        amountOut = IPool(params.pool).swap(params.data);
        // Ensure that the slippage wasn't too much. This assumes that the pool is honest.
        if (amountOut < params.amountOutMinimum) revert TooLittleReceived();
    }

    /// @notice Swaps token A to token B indirectly by using multiple hops. It's the same as `exactInput` except
    /// it takes raw ERC-20 tokens from the users and deposits them into `bento`.
    /// @param params This includes the addresses of the tokens, pools, amount of token A to swap,
    /// minimum amount of token B after the swap and data required by the pools for the swaps.
    /// @dev Ensure that the pools are trusted before calling this function. The pools can steal users' tokens.
    function exactInputWithNativeToken(ExactInputParams calldata params) public payable returns (uint256 amountOut) {
        // Deposits the native ERC-20 token from the user into the pool's `bento`.
        _depositToBentoBox(params.tokenIn, params.path[0].pool, params.amountIn);
        // Call every pool in the path.
        // Pool `N` should transfer its output tokens to pool `N+1` directly.
        // The last pool should transfer its output tokens to the user.
        uint256 n = params.path.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            amountOut = IPool(params.path[i].pool).swap(params.path[i].data);
        }
        // Ensure that the slippage wasn't too much. This assumes that the pool is honest.
        if (amountOut < params.amountOutMinimum) revert TooLittleReceived();
    }

    /// @notice Swaps multiple input tokens to multiple output tokens using multiple paths, in different percentages.
    /// For example, you can swap 50 DAI + 100 USDC into 60% ETH and 40% BTC.
    /// @param params This includes everything needed for the swap. Look at the `ComplexPathParams` struct for more details.
    /// @dev This function is not optimized for single swaps and should only be used in complex cases where
    /// the amounts are large enough that minimizing slippage by using multiple paths is worth the extra gas.
    function complexPath(ComplexPathParams calldata params) public payable {
        // Deposit all initial tokens to respective pools and initiate the swaps.
        // Input tokens come from the user - output goes to following pools.
        uint256 n = params.initialPath.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            if (params.initialPath[i].native) {
                _depositToBentoBox(params.initialPath[i].tokenIn, params.initialPath[i].pool, params.initialPath[i].amount);
            } else {
                bento.transfer(params.initialPath[i].tokenIn, msg.sender, params.initialPath[i].pool, params.initialPath[i].amount);
            }
            IPool(params.initialPath[i].pool).swap(params.initialPath[i].data);
        }
        // Do all the middle swaps. Input comes from previous pools.
        n = params.percentagePath.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            uint256 balanceShares = bento.balanceOf(params.percentagePath[i].tokenIn, address(this));
            uint256 transferShares = (balanceShares * params.percentagePath[i].balancePercentage) / uint256(10)**8;
            bento.transfer(params.percentagePath[i].tokenIn, address(this), params.percentagePath[i].pool, transferShares);
            IPool(params.percentagePath[i].pool).swap(params.percentagePath[i].data);
        }
        // Ensure enough was received and transfer the ouput to the recipient.
        n = params.output.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            uint256 balanceShares = bento.balanceOf(params.output[i].token, address(this));
            if (balanceShares < params.output[i].minAmount) revert TooLittleReceived();
            if (params.output[i].unwrapBento) {
                bento.withdraw(params.output[i].token, address(this), params.output[i].to, 0, balanceShares);
            } else {
                bento.transfer(params.output[i].token, address(this), params.output[i].to, balanceShares);
            }
        }
    }

    /// @notice Add liquidity to a pool.
    /// @param tokenInput Token address and amount to add as liquidity.
    /// @param pool Pool address to add liquidity to.
    /// @param minLiquidity Minimum output liquidity - caps slippage.
    /// @param data Data required by the pool to add liquidity.
    function addLiquidity(
        TokenInput[] calldata tokenInput,
        address pool,
        uint256 minLiquidity,
        bytes calldata data
    ) public payable returns (uint256 liquidity) {
        // Send all input tokens to the pool.
        uint256 n = tokenInput.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            if (tokenInput[i].native) {
                _depositToBentoBox(tokenInput[i].token, pool, tokenInput[i].amount);
            } else {
                bento.transfer(tokenInput[i].token, msg.sender, pool, tokenInput[i].amount);
            }
        }
        liquidity = IPool(pool).mint(data);
        if (liquidity < minLiquidity) revert NotEnoughLiquidityMinted();
    }

    /// @notice Burn liquidity tokens to get back `bento` tokens.
    /// @param pool Pool address.
    /// @param liquidity Amount of liquidity tokens to burn.
    /// @param data Data required by the pool to burn liquidity.
    /// @param minWithdrawals Minimum amount of `bento` tokens to be returned.
    function burnLiquidity(
        address pool,
        uint256 liquidity,
        bytes calldata data,
        IPool.TokenAmount[] calldata minWithdrawals
    ) public payable {
        pool.safeTransferFrom(msg.sender, pool, liquidity);
        IPool.TokenAmount[] memory withdrawnLiquidity = IPool(pool).burn(data);
        uint256 n = minWithdrawals.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            if (minWithdrawals[i].token != withdrawnLiquidity[i].token) revert IncorrectSlippageParams();
            if (withdrawnLiquidity[i].amount < minWithdrawals[i].amount) revert TooLittleReceived();
        }
    }

    /// @notice Burn liquidity tokens to get back `bento` tokens.
    /// @dev The tokens are swapped automatically and the output is in a single token.
    /// @param pool Pool address.
    /// @param liquidity Amount of liquidity tokens to burn.
    /// @param data Data required by the pool to burn liquidity.
    /// @param minWithdrawal Minimum amount of tokens to be returned.
    function burnLiquiditySingle(
        address pool,
        uint256 liquidity,
        bytes calldata data,
        uint256 minWithdrawal
    ) public payable {
        // Use 'liquidity = 0' for prefunding.
        pool.safeTransferFrom(msg.sender, pool, liquidity);
        uint256 withdrawn = IPool(pool).burnSingle(data);
        if (withdrawn < minWithdrawal) revert TooLittleReceived();
    }

    /// @notice Recover mistakenly sent tokens.
    function sweep(
        address token,
        address recipient,
        bool fromBento
    ) external payable {
        if (fromBento) {
            uint256 shares = bento.balanceOf(token, address(this));
            bento.transfer(token, address(this), recipient, shares);
        } else {
            uint256 amount = token == USE_NATIVE ? address(this).balance : (IERC20(token).balanceOf(address(this)) - 1);
            token == USE_NATIVE ? recipient.safeTransferETH(amount) : token.safeTransfer(recipient, amount);
        }
    }

    /// @notice Unwrap this contract's wETH into ETH.
    function unwrapWETH(address recipient) external payable {
        uint256 balance = IWETH9(wETH).balanceOf(address(this));
        IWETH9(wETH).withdraw(balance);
        recipient.safeTransferETH(balance);
    }

    /// @notice Wrapper function to allow pool deployment to be batched.
    function deployPool(address factory, bytes calldata deployData) external payable returns (address) {
        return masterDeployer.deployPool(factory, deployData);
    }

    /// @notice Wrapper function to allow bento set master contract approval to be batched, so the first trade can happen in one transaction.
    function approveMasterContract(
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external payable {
        bento.setMasterContractApproval(msg.sender, address(this), true, v, r, s);
    }

    /// @notice Call BentoBox harvest function to rebalance a BentoBox token strategy and ensure there are enough tokens available to withdraw a swap output.
    /// @dev Should be batched in before a swap.
    function harvest(address token, uint256 maxChangeAmount) external payable {
        bento.harvest(token, true, maxChangeAmount);
    }

    /// @notice Deposit from the user's wallet into BentoBox.
    /// @dev Amount is the native token amount. We let BentoBox do the conversion into shares.
    function _depositToBentoBox(
        address token,
        address recipient,
        uint256 amount
    ) internal {
        bento.deposit{value: token == USE_NATIVE ? amount : 0}(token, msg.sender, recipient, amount, 0);
    }

    function _increment(uint256 i) internal pure returns (uint256) {
        unchecked {
            return i + 1;
        }
    }
}
