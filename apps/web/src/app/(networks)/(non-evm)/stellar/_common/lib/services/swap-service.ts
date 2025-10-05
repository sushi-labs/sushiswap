import StellarSdk, { 
  TransactionBuilder, 
  Operation, 
  Account,
  Address as StellarAddress,
  xdr
} from '@stellar/stellar-sdk';
import { NETWORK_CONFIG, CONTRACT_ADDRESSES } from '../soroban/contract-addresses';
import type { Token } from '../types/token.type';

/**
 * Parameters for adding liquidity
 */
export interface AddLiquidityParams {
  poolAddress: string;
  token0Amount: string;
  token1Amount: string;
  tickLower: number;
  tickUpper: number;
  recipient?: string;
  deadline?: number;
}

/**
 * Parameters for single-hop swap
 */
export interface SwapExactInputSingleParams {
  tokenIn: string;
  tokenOut: string;
  fee: number;
  recipient: string;
  deadline: number;
  amountIn: bigint;
  amountOutMinimum: bigint;
  sqrtPriceLimitX96?: bigint;
}

/**
 * Parameters for multi-hop swap
 */
export interface SwapExactInputParams {
  path: string[];
  fees: number[];
  recipient: string;
  deadline: number;
  amountIn: bigint;
  amountOutMinimum: bigint;
}

/**
 * Swap quote result
 */
export interface SwapQuote {
  amountOut: bigint;
  path: string[];
  fees: number[];
  priceImpact: number;
  routeType: 'direct' | 'multihop';
}

/**
 * Service for executing swaps and liquidity operations on Stellar
 */
export class SwapService {
  private networkPassphrase: string;
  private horizonUrl: string;
  private sorobanRpcUrl: string;

  constructor() {
    this.networkPassphrase = NETWORK_CONFIG.PASSPHRASE;
    this.horizonUrl = NETWORK_CONFIG.HORIZON_URL;
    this.sorobanRpcUrl = NETWORK_CONFIG.SOROBAN_URL;
  }

  /**
   * Add liquidity to a pool (exactly like stellar-auth-test)
   */
  async addLiquidity(
    userAddress: string,
    params: AddLiquidityParams
  ): Promise<{ txHash: string; liquidity: bigint }> {
    // Get pool configuration to log token symbols
    const config = this.getPoolConfig(params.poolAddress);
    if (config) {
      console.log(`💧 Adding liquidity: ${params.token0Amount} ${config.token0.symbol}, ${params.token1Amount} ${config.token1.symbol}`);
      console.log('No approvals needed — your signature authorizes pool.mint() to pull tokens.');
    }

    const soroban = new StellarSdk.SorobanRpc.Server(this.sorobanRpcUrl);
    const horizon = new StellarSdk.Horizon.Server(this.horizonUrl);
    const account = await horizon.loadAccount(userAddress);

    // Calculate liquidity amount using proper Uniswap V3 math
    // We need to reverse-engineer the liquidity value from desired token amounts
    const liquidityAmount = await this.calculateLiquidityFromAmounts(
      params.poolAddress,
      parseFloat(params.token0Amount),
      parseFloat(params.token1Amount),
      params.tickLower,
      params.tickUpper
    );

    if (!liquidityAmount || liquidityAmount === '0') {
      throw new Error('Failed to calculate liquidity amount. Please check your inputs.');
    }

    console.log(`Requesting liquidity units: ${liquidityAmount}`);

    // Convert liquidity amount to U128 (hi and lo parts)
    const liquidityBigInt = BigInt(liquidityAmount);
    const lo = liquidityBigInt & ((BigInt(1) << BigInt(64)) - BigInt(1)); // Lower 64 bits
    const hi = liquidityBigInt >> BigInt(64); // Upper 64 bits

    const operation = StellarSdk.Operation.invokeContractFunction({
      contract: params.poolAddress,
      function: 'mint',
      args: [
        new StellarAddress(userAddress).toScVal(), // recipient
        StellarSdk.xdr.ScVal.scvI32(params.tickLower),
        StellarSdk.xdr.ScVal.scvI32(params.tickUpper),
        StellarSdk.xdr.ScVal.scvU128(
          new StellarSdk.xdr.UInt128Parts({
            hi: StellarSdk.xdr.Uint64.fromString(hi.toString()),
            lo: StellarSdk.xdr.Uint64.fromString(lo.toString())
          })
        )
      ]
    });

    const transaction = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: this.networkPassphrase
    })
      .addOperation(operation)
      .setTimeout(180)
      .build();

    console.log('Simulating transaction to calculate resources and auth...');

    const prepared = await soroban.prepareTransaction(transaction);

    console.log('Transaction prepared. Waiting for wallet signature...');
    console.log('Prepared transaction for mint');

    // Sign the transaction with Freighter (like stellar-auth-test)
    const signed = await (window as any).freighterApi.signTransaction(
      prepared.toXDR(),
      { network: 'TESTNET', networkPassphrase: this.networkPassphrase }
    );

    const signedXdr = signed.signedTxXdr || signed;
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, this.networkPassphrase);

    console.log('Transaction signed. Submitting to network...');

    // Submit the signed transaction via raw RPC
    const txHash = await this.submitViaRawRPC(signedTx);

    console.log(`Transaction submitted: ${txHash}`);

    return {
      txHash,
      liquidity: BigInt(liquidityAmount)
    };
  }

  /**
   * Execute a single-hop swap
   */
  async swapExactInputSingle(
    userAddress: string,
    params: SwapExactInputSingleParams
  ): Promise<{ txHash: string; amountOut: bigint }> {
    const soroban = new StellarSdk.SorobanRpc.Server(this.sorobanRpcUrl);
    const horizon = new StellarSdk.Horizon.Server(this.horizonUrl);
    const account = await horizon.loadAccount(userAddress);

    const swapParams = StellarSdk.xdr.ScVal.scvMap([
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('sender'),
        val: new StellarAddress(userAddress).toScVal()
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('recipient'),
        val: new StellarAddress(params.recipient).toScVal()
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('token_in'),
        val: new StellarAddress(params.tokenIn).toScVal()
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('token_out'),
        val: new StellarAddress(params.tokenOut).toScVal()
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('fee'),
        val: StellarSdk.xdr.ScVal.scvU32(params.fee)
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('amount_in'),
        val: StellarSdk.nativeToScVal(params.amountIn.toString(), { type: 'i128' })
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('amount_out_minimum'),
        val: StellarSdk.nativeToScVal(params.amountOutMinimum.toString(), { type: 'i128' })
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('sqrt_price_limit_x96'),
        val: params.sqrtPriceLimitX96 
          ? StellarSdk.nativeToScVal(params.sqrtPriceLimitX96.toString(), { type: 'i128' })
          : StellarSdk.nativeToScVal('0', { type: 'i128' })
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('deadline'),
        val: StellarSdk.xdr.ScVal.scvU64(StellarSdk.xdr.Uint64.fromString(params.deadline.toString()))
      })
    ]);

    const operation = Operation.invokeContractFunction({
      contract: CONTRACT_ADDRESSES.ROUTER,
      function: 'swap_exact_input_single',
      args: [swapParams]
    });

    const transaction = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: this.networkPassphrase
    })
      .addOperation(operation)
      .setTimeout(180)
      .build();

    const prepared = await soroban.prepareTransaction(transaction);
    
    // Sign the transaction with Freighter (like stellar-auth-test)
    const signed = await (window as any).freighterApi.signTransaction(
      prepared.toXDR(),
      { network: 'TESTNET', networkPassphrase: this.networkPassphrase }
    );
    
    const signedXdr = signed.signedTxXdr || signed;
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, this.networkPassphrase);
    
    // Submit the signed transaction via raw RPC
    const txHash = await this.submitViaRawRPC(signedTx);
    
    return {
      txHash,
      amountOut: params.amountIn // Placeholder - would be actual amount out
    };
  }

  /**
   * Execute a multi-hop swap
   */
  async swapExactInput(
    userAddress: string,
    params: SwapExactInputParams
  ): Promise<{ txHash: string; amountOut: bigint }> {
    const soroban = new StellarSdk.SorobanRpc.Server(this.sorobanRpcUrl);
    const horizon = new StellarSdk.Horizon.Server(this.horizonUrl);
    const account = await horizon.loadAccount(userAddress);

    const pathVec = StellarSdk.xdr.ScVal.scvVec(
      params.path.map(addr => new StellarAddress(addr).toScVal())
    );
    const feesVec = StellarSdk.xdr.ScVal.scvVec(
      params.fees.map(fee => StellarSdk.xdr.ScVal.scvU32(fee))
    );

    const swapParams = StellarSdk.xdr.ScVal.scvMap([
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('sender'),
        val: new StellarAddress(userAddress).toScVal()
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('path'),
        val: pathVec
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('fees'),
        val: feesVec
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('recipient'),
        val: new StellarAddress(params.recipient).toScVal()
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('amount_in'),
        val: StellarSdk.nativeToScVal(params.amountIn.toString(), { type: 'i128' })
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('amount_out_minimum'),
        val: StellarSdk.nativeToScVal(params.amountOutMinimum.toString(), { type: 'i128' })
      }),
      new StellarSdk.xdr.ScMapEntry({
        key: StellarSdk.xdr.ScVal.scvSymbol('deadline'),
        val: StellarSdk.xdr.ScVal.scvU64(StellarSdk.xdr.Uint64.fromString(params.deadline.toString()))
      })
    ]);

    const operation = Operation.invokeContractFunction({
      contract: CONTRACT_ADDRESSES.ROUTER,
      function: 'swap_exact_input',
      args: [swapParams]
    });

    const transaction = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: this.networkPassphrase
    })
      .addOperation(operation)
      .setTimeout(180)
      .build();

    const prepared = await soroban.prepareTransaction(transaction);
    
    // Sign the transaction with Freighter (like stellar-auth-test)
    const signed = await (window as any).freighterApi.signTransaction(
      prepared.toXDR(),
      { network: 'TESTNET', networkPassphrase: this.networkPassphrase }
    );
    
    const signedXdr = signed.signedTxXdr || signed;
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, this.networkPassphrase);
    
    // Submit the signed transaction via raw RPC
    const txHash = await this.submitViaRawRPC(signedTx);
    
    return {
      txHash,
      amountOut: params.amountIn // Placeholder - would be actual amount out
    };
  }

  /**
   * Submit transaction via raw RPC (like stellar-auth-test implementation)
   */
  private async submitViaRawRPC(signedTx: any): Promise<string> {
    // Handle both XDR strings and transaction objects
    let xdr: string;
    if (typeof signedTx === 'string') {
      xdr = signedTx;
    } else if (signedTx && typeof signedTx.toXDR === 'function') {
      xdr = signedTx.toXDR();
    } else {
      throw new Error('Invalid transaction format');
    }

    const rpcRequest = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'sendTransaction',
      params: {
        transaction: xdr
      }
    };

    const response = await fetch(this.sorobanRpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rpcRequest)
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.result.hash;
  }

  /**
   * Calculate liquidity amount from token amounts using Uniswap V3 math
   * Based on the working stellar-auth-test implementation
   */
  private async calculateLiquidityFromAmounts(
    poolAddress: string,
    amount0: number,
    amount1: number,
    tickLower: number,
    tickUpper: number
  ): Promise<string> {
    try {
      // Get current sqrt price from pool
      const currentSqrtPriceX96 = await this.getCurrentSqrtPrice(poolAddress);
      
      // Calculate sqrt prices for tick boundaries
      const sqrtPriceLowerX96 = this.tickToSqrtPrice(tickLower);
      const sqrtPriceUpperX96 = this.tickToSqrtPrice(tickUpper);
      
      // Scale amounts to contract units (7 decimals for Stellar)
      const scaledAmount0 = BigInt(Math.floor(amount0 * 1e7));
      
      // Calculate liquidity from token0 amount only (like the working demo)
      const liquidity = this.calculateLiquidityFromAmount0(
        scaledAmount0, 
        currentSqrtPriceX96, 
        sqrtPriceLowerX96, 
        sqrtPriceUpperX96
      );
      
      console.log('Liquidity calculation for addLiquidity:', {
        desiredAmount0: amount0,
        scaledAmount0: scaledAmount0.toString(),
        currentSqrtPrice: currentSqrtPriceX96.toString(),
        liquidity: liquidity.toString()
      });
      
      return liquidity.toString();
    } catch (error) {
      console.error('Error calculating liquidity:', error);
      // Fallback to simple calculation
      const totalAmount = amount0 + amount1;
      return Math.floor(totalAmount * 1e7).toString();
    }
  }

  /**
   * Get current sqrt price from pool (exactly like stellar-auth-test)
   */
  private async getCurrentSqrtPrice(poolAddress: string): Promise<bigint> {
    try {
      const simulationAccount = new StellarSdk.Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0');
      const getSlot0Op = StellarSdk.Operation.invokeContractFunction({
        contract: poolAddress,
        function: 'slot0',
        args: []
      });

      const tx = new StellarSdk.TransactionBuilder(simulationAccount, {
        fee: '100',
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(getSlot0Op)
        .setTimeout(30)
        .build();

      const request = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'simulateTransaction',
        params: { transaction: tx.toXDR() }
      };

      const response = await fetch(this.sorobanRpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const result = await response.json();
      if (result.result && result.result.results && result.result.results[0]) {
        const slot0Val = StellarSdk.xdr.ScVal.fromXDR(result.result.results[0].xdr, 'base64');
        const slot0Map = this.scMapToObject(slot0Val);

        console.log('slot0Map:', slot0Map);

        // Try to get sqrt_price_x96 directly
        if (slot0Map.sqrt_price_x96) {
          const u256Val = slot0Map.sqrt_price_x96;
          if (u256Val && typeof u256Val.u256 === 'function') {
            const parts = u256Val.u256();

            // Access _attributes directly (camelCase properties) - exactly like stellar-auth-test
            const attrs = parts._attributes || parts;
            const hiHi = BigInt(attrs.hiHi || '0');
            const hiLo = BigInt(attrs.hiLo || '0');
            const loHi = BigInt(attrs.loHi || '0');
            const loLo = BigInt(attrs.loLo || '0');

            const sqrtPrice = (hiHi << 192n) | (hiLo << 128n) | (loHi << 64n) | loLo;
            console.log('Fetched sqrt price from slot0:', sqrtPrice.toString());
            return sqrtPrice;
          }
        }

        // Fallback: if sqrt_price_x96 parsing failed, use tick to calculate it
        if (slot0Map.tick !== undefined) {
          const tickVal = slot0Map.tick;
          const tick = typeof tickVal.i32 === 'function' ? tickVal.i32() : Number(tickVal);
          const calculatedSqrtPrice = this.tickToSqrtPrice(tick);
          console.log(`Using sqrt price calculated from tick ${tick}:`, calculatedSqrtPrice.toString());
          return calculatedSqrtPrice;
        }
      }
    } catch (error) {
      console.error('Failed to fetch sqrt price from pool:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error), error instanceof Error ? error.stack : '');
    }

    throw new Error('Could not fetch current price from pool. Please make sure a pool is selected.');
  }

  /**
   * Convert tick to sqrt price (exactly like stellar-auth-test)
   */
  private tickToSqrtPrice(tick: number): bigint {
    // sqrt(1.0001^tick) * 2^96
    return BigInt(Math.floor(Math.sqrt(Math.pow(1.0001, tick)) * Math.pow(2, 96)));
  }

  /**
   * Calculate liquidity from token0 amount (exactly like stellar-auth-test)
   * Note: The contract rounds UP when calculating amounts, which can increase the amount by ~1-2 units per division
   * We need to account for this by reducing our liquidity request slightly
   */
  private calculateLiquidityFromAmount0(
    scaledAmount0: bigint,
    currentSqrtPriceX96: bigint,
    sqrtPriceLowerX96: bigint,
    sqrtPriceUpperX96: bigint
  ): bigint {
    // The contract does two operations with rounding up:
    // 1. product = mul_div_rounding_up(L << 96, price_diff, upper)
    // 2. amount = div_rounding_up(product, lower_or_current)
    // Each rounding up can add up to 1, so total rounding can be ~2
    // But in practice with large numbers, it's proportional to the divisions

    if (currentSqrtPriceX96 < sqrtPriceLowerX96) {
      // Below range
      // Work backwards from: amount0 = ((L << 96) * (upper - lower) / upper) / lower
      // Without rounding: L = (amount0 * lower * upper) / ((upper - lower) * 2^96)
      const numerator = scaledAmount0 * sqrtPriceLowerX96 * sqrtPriceUpperX96;
      const denominator = (sqrtPriceUpperX96 - sqrtPriceLowerX96) << 96n;
      // Reduce liquidity by ~0.2% to account for rounding up (empirical adjustment)
      const liquidity = numerator / denominator;
      return (liquidity * 998n) / 1000n; // Reduce by 0.2%
    } else if (currentSqrtPriceX96 >= sqrtPriceUpperX96) {
      // Above range: only token1 needed, return 0
      return BigInt(0);
    } else {
      // Within range
      // Contract does: product = (L << 96) * (upper - current) / upper, then amount0 = product / current
      // Reverse step 2: product = amount0 * current
      // Reverse step 1: L = (product * upper) / ((upper - current) << 96)
      // Combined: L = (amount0 * current * upper) / ((upper - current) << 96)
      const numerator = scaledAmount0 * currentSqrtPriceX96 * sqrtPriceUpperX96;
      const denominator = (sqrtPriceUpperX96 - currentSqrtPriceX96) << 96n;
      return numerator / denominator;
    }
  }

  /**
   * Convert SCVal map to object (exactly like stellar-auth-test)
   */
  private scMapToObject(scVal: any): any {
    if (!scVal || typeof scVal.map !== 'function') {
      return {};
    }
    const entries = scVal.map();
    const result: any = {};
    entries.forEach((entry: any) => {
      const keyVal = entry.key();
      let key = 'unknown';
      if (keyVal && typeof keyVal.sym === 'function') {
        key = this.scSymbolToString(keyVal.sym());
      }
      result[key] = entry.val();
    });
    return result;
  }

  /**
   * Convert SC symbol to string (exactly like stellar-auth-test)
   */
  private scSymbolToString(symbol: any): string {
    if (!symbol) return '';
    const raw = symbol.toString();
    const match = raw.match(/Symbol\((.*)\)/);
    return match ? match[1] : raw;
  }

  /**
   * Get pool configuration (exactly like stellar-auth-test)
   */
  private getPoolConfig(poolAddress: string): any {
    if (!poolAddress) {
      return null;
    }

    // For now, we'll use a simple mapping based on the pool addresses we know
    // In a real implementation, this would query the pool contract or factory
    const poolConfigs: { [key: string]: any } = {
      'CCYJJ2A2BAQHKKSNJ3NHRV66GA6XCHHBLROFBBR7J33YIYMWDL57XOUL': {
        token0: { address: 'CCUYO46LKVYRQL63LIIMGWVURVBQVETKO26G5OK5XVB5S4GKMGPKXNYJ', symbol: 'HYPEa' },
        token1: { address: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', symbol: 'XLM' },
        fee: 3000,
        spacing: 60,
        description: '💱 HYPEa-XLM Pool (0.3% fee, 1:1)',
        currentTick: 0,
        liquidity: 100000000000
      },
      'CDLPBPLMZGQHVRDMZAOMOQXWUUBGP5PWSLIAPTJVXC3WTAK6FAR3FQSQ': {
        token0: { address: 'CBQMJZL4U4MAQNHKNZZ2CAAKOJEDKL4J4C6AVFQL4CSKNLZU6H3PD5O7', symbol: 'HYPEb' },
        token1: { address: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', symbol: 'XLM' },
        fee: 3000,
        spacing: 60,
        description: '💱 HYPEb-XLM Pool (0.3% fee, 10:1)',
        currentTick: 23027,
        liquidity: 10000000000
      }
    };

    if (poolConfigs[poolAddress]) {
      return poolConfigs[poolAddress];
    }

    // Fallback for unknown pools
    return {
      token0: { address: '', symbol: 'TOKEN0' },
      token1: { address: '', symbol: 'TOKEN1' },
      fee: 3000,
      spacing: 60,
      description: 'Unknown Pool'
    };
  }
}
