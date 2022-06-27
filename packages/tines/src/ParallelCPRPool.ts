import { ASSERT, calcSquareEquation, ConstantProductRPool, getBigNumber, RPool, RToken } from "./";

interface JumpInfo {
  poolIndex: number;
  input: number;
  output: number;
  price: number;
  combinedLiquidityY: number;
  gasCost: number
}

export class ParallelCPRPool extends RPool {
  readonly token0: RToken
  readonly allPools: ConstantProductRPool[]
  readonly gasPrice: number
  jumps0?: JumpInfo[]
  jumps1?: JumpInfo[]

  constructor(
    inputToken: RToken,
    pools: ConstantProductRPool[],
    gasPrice: number
  ) {
      super(
        'ParallelCPRPool',
        pools[0].token0,
        pools[0].token1,
        0,
        getBigNumber(pools.reduce((a, b) => a + b.reserve0Number, 0)),
        getBigNumber(pools.reduce((a, b) => a + b.reserve1Number/(1-b.fee), 0)),
      );
      // this.pools = pools.map((p):[ConstantProductRPool, number] => [p, p.getLiquidity()/(1-p.fee)])
      //   .sort(([_1, l1], [_2, l2]) => l1-l2)
      // console.log("pools", this.pools.map(p => p[0].getLiquidity()));
      this.token0 = inputToken
      this.allPools = pools
      this.gasPrice = gasPrice
  }

  //TODO:
  // 1) weak pool test
  // 3) poolPrice < priceCurrent
  calcNextJumpforPool(pool: ConstantProductRPool, poolIndex: number, direction: boolean, prevJump?: JumpInfo): JumpInfo | undefined {
    const dir = (this.token0.address === pool.token0.address) === direction
    const poolPrice = pool.calcPrice(0, dir, true)
    const y = dir ? pool.reserve1Number : pool.reserve0Number
    if (prevJump === undefined ) return {
      poolIndex,
      input: 0,
      output: 0,
      price: poolPrice,
      combinedLiquidityY: y,
      gasCost: pool.swapGasCost
    }

    const swapCost = this.gasPrice * pool.swapGasCost
    if ( y < swapCost) return     // pool is too weak to pay off swap gas cost
    const combinedYNew = Math.sqrt(poolPrice/prevJump.price)*prevJump.combinedLiquidityY
    console.assert(combinedYNew > 0, "Internal error 45")
    const outputFirst = prevJump.combinedLiquidityY - combinedYNew   // TODO: check if negative !!!!
    const inputFirst = prevJump.combinedLiquidityY*outputFirst/prevJump.price/combinedYNew

    const [inputSecond, in1] = calcSquareEquation(swapCost-y, swapCost*(2*combinedYNew + y)/poolPrice, 
      swapCost*combinedYNew*(combinedYNew+y)/poolPrice/poolPrice)
    console.assert(in1 < 0, "Internal Error 53")
    console.assert(inputSecond > 0, "Internal Error 54")
    const outputSecond = combinedYNew*inputSecond/(combinedYNew/poolPrice + inputSecond) + swapCost
    ASSERT(() => {
      const outputSecond2 = (combinedYNew + y)*inputSecond/((combinedYNew + y)/poolPrice + inputSecond)
      return Math.abs(outputSecond/outputSecond2 - 1) < 1e-12
    }, "Internal Error 62")
    const combinedYFinal = combinedYNew + y - outputSecond
    const priceFinal = poolPrice* Math.pow(combinedYFinal/(combinedYNew+y), 2)
    return {
      poolIndex,
      input: prevJump.input + inputFirst + inputSecond,
      output: prevJump.output + outputFirst + outputSecond,
      price: priceFinal,
      combinedLiquidityY: combinedYFinal,
      gasCost: prevJump.gasCost + pool.swapGasCost
    }
  }

  calcBestJump(pools: ConstantProductRPool[], direction: boolean, prevJump?: JumpInfo): JumpInfo | undefined {
    let bestJump: JumpInfo | undefined;
    pools.forEach( (p, i) => {
      const jump = this.calcNextJumpforPool(p, i, direction, prevJump)
      if (bestJump === undefined) bestJump = jump
      else if (jump !== undefined) {
        if (0 < jump.input && jump.input < bestJump.input) bestJump = jump
        if (bestJump.input === 0 && jump.price > bestJump.price) bestJump = jump
      }
    })
    return bestJump
  }

  calcJumps(direction: boolean): JumpInfo[] {
    let jumps = direction ? this.jumps0 : this.jumps1
    if (jumps !== undefined) return jumps

    jumps = []
    const unusedPools = [...this.allPools]
    let bestJump = this.calcBestJump(unusedPools, direction)
    while(bestJump !== undefined) {
      jumps.push(bestJump)
      unusedPools.splice(bestJump.poolIndex, 1)
      bestJump = this.calcBestJump(unusedPools, direction, bestJump)
    }

    if (direction) this.jumps0 = jumps
    else this.jumps1 = jumps

    return jumps
  }

  getJump(direction: boolean, less: (j: JumpInfo) => boolean) {
    const jumps = this.calcJumps(direction)
    let a = 0, b = jumps.length - 1
    while( (b-a) > 1) {
      const c = Math.floor((a+b)/2)
      if (less(jumps[c])) a = c
      else b = c
    }
    return less(jumps[b]) ? jumps[b] : jumps[a]
  }

  calcOutByIn(amountIn: number, direction: boolean): {out: number, gasSpent: number} {
    const jump = this.getJump(direction, j => j.input <= amountIn)
    console.assert(amountIn >= jump.input)

    const addInput = amountIn - jump.input
    const addOutput = jump.combinedLiquidityY*addInput/(jump.combinedLiquidityY/jump.price + addInput)
    return {out: jump.output + addOutput, gasSpent: jump.gasCost}
  }

  calcInByOut(amountOut: number, direction: boolean): {inp: number, gasSpent: number} {
    const jump = this.getJump(direction, j => j.output <= amountOut)
    console.assert(amountOut >= jump.input)

    const addOutput = amountOut - jump.output
    let addInput = jump.combinedLiquidityY/jump.price*addOutput/(jump.combinedLiquidityY - addOutput)
    if (addInput < 0) addInput = 0
    return {inp: jump.input + addInput, gasSpent: jump.gasCost}
  }

  calcCurrentPriceWithoutFee(direction: boolean): number {
    let bestLiquidity: number | undefined
    let price: number | undefined
    this.allPools.forEach(p => {
      const l = p.getLiquidity()
      if (bestLiquidity === undefined) {
        bestLiquidity = l
        price = p.calcCurrentPriceWithoutFee(direction)
      }
    })
    return price as number
  }
}