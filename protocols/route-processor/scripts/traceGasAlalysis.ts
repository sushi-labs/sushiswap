// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function printGasUsage(trace: any) {
  printGasUsageRecursive(trace.structLogs as CodeTraceInfo[], 0, '')
}

interface CodeTraceInfo {
  op: string
  depth: number
  gas: number
  gasCost: number
  pc: number
  stack: string[]
  memory: string[]
}

function getStack(data: CodeTraceInfo, depth: number): string {
  const stack = data.stack
  const len = stack.length - 1
  return stack[len - depth]
}

function getStackAddr(data: CodeTraceInfo, depth: number): string {
  const val = getStack(data, depth)
  return `0x${val.substring(24)}`
}

function getNumber(data: CodeTraceInfo, depth: number): number {
  const val = getStack(data, depth)
  return parseInt(val, 16)
}

function getMemory(data: CodeTraceInfo, addr: number, len: number): string {
  const word = Math.floor(addr / 32)
  const shift = addr - word * 32
  const mem =
    word < data.memory.length
      ? data.memory[word]
      : '0000000000000000000000000000000000000000000000000000000000000000'
  return mem.substring(shift * 2, (shift + len) * 2)
}

function getCallFuncSelector(data: CodeTraceInfo): string {
  const op = data.op
  let dataAddrDepth = 0
  switch (op) {
    case 'CALL':
    case 'CALLCODE':
      dataAddrDepth = 3
      break
    case 'DELEGATECALL':
    case 'STATICCALL':
      dataAddrDepth = 2
      break
    default:
      throw new Error('Unknown call code: ') + op
  }
  const addr = getNumber(data, dataAddrDepth)
  const selector = getMemory(data, addr, 4)
  switch (selector) {
    // some often values
    case '70a08231':
      return 'balanceOf(address)'
    case 'd0e30db0':
      return 'deposit()'
    case 'a9059cbb':
      return 'transfer(address dst, uint256 wad)'
    case '022c0d9f':
      return 'Uni:swap(uint256 amount0Out, uint256 amount1Out, address to, bytes data)'
    case '4ffe34db':
      return 'Bento:totals(address)'
    case 'f18d03cc':
      return 'Bento:transfer(address token, address from, address to, uint256 share)'
    case '0902f1ac':
      return 'getReserves()'
    case 'df23b45b':
      return 'StratageData'
    case '02b9446c':
      return 'Bento:Deposit()'
    case 'f7888aec':
      return 'Bento:BalanceOf()'
    default:
      return selector
  }
}

// Returns the last processed code index
function printGasUsageRecursive(
  trace: CodeTraceInfo[],
  start: number,
  prefix: string,
  gasBefore = -1,
): number {
  const depth = trace[start].depth
  const gasStart = trace[start].gas
  let lastPrintedGas = gasStart
  if (gasBefore > 0)
    console.log(
      `${prefix}gas before function execution ${gasBefore - gasStart}`,
    )

  for (let i = start; i < trace.length; ) {
    const info = trace[i]
    if (info.depth !== depth) {
      console.log(
        `${prefix}ERROR: UNEXPECTED DEPTH ${info.pc}: ${depth} -> ${info.depth}`,
      )
      return i - 1
    }
    if (info.op.endsWith('CALL')) {
      if (trace[i + 1].depth > depth) {
        // Function call
        console.log(`${prefix}${lastPrintedGas - info.gas} gas`)
        console.log(
          `${prefix}${info.op}(pc=${info.pc}, index=${i}) ${getStackAddr(
            info,
            1,
          )} ${getCallFuncSelector(info)}`,
        )
        i =
          printGasUsageRecursive(trace, i + 1, `${prefix}  `, info.gasCost) + 1
        console.log(`${`${prefix}  `}call total ${info.gas - trace[i].gas} gas`)
        lastPrintedGas = trace[i].gas
        continue
      }
    }
    if (info.op === 'RETURN' || info.op === 'REVERT' || info.op === 'STOP') {
      if (lastPrintedGas !== gasStart)
        console.log(`${prefix}${lastPrintedGas - info.gas} gas`)
      console.log(
        `${prefix}${info.op}(pc=${info.pc}, index=${i}) function execution ${
          gasStart - info.gas
        } gas`,
      )
      return i
    }
    if (i < trace.length - 1) {
      const gas = info.gas - trace[i + 1].gas
      if (gas >= 100) console.log(`${prefix}${info.op} - ${gas}`)
    }
    ++i
  }
  return -1
}
