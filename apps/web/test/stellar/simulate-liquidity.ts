import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  Account,
  Address,
  Contract,
  Networks,
  StrKey,
  TransactionBuilder,
  rpc,
  scValToNative,
  xdr,
} from '@stellar/stellar-sdk'
import type { Client as ContractClient } from '@stellar/stellar-sdk/contract'
import { Client as FactoryClient } from '@sushiswap/stellar-contract-binding-factory'
import { Client as PoolClient } from '@sushiswap/stellar-contract-binding-pool'
import {
  Client as ManagerClient,
  type OracleHints,
} from '@sushiswap/stellar-contract-binding-position-manager'
import { SqrtPriceMath } from 'sushi/evm'
import { STELLAR_USDC, StellarChainId } from 'sushi/stellar'
import { contractAddresses } from '../../src/app/(networks)/(non-evm)/stellar/_common/lib/soroban/contracts'
import { getLiquidityAmounts } from '../../src/app/(networks)/(non-evm)/stellar/_common/lib/utils/liquidity-amounts'
import { getSqrtRatioAtTick } from '../../src/app/(networks)/(non-evm)/stellar/_common/lib/utils/ticks'

// No signing or submission methods: all contract calls use RPC simulation in recording mode.
const output = process.argv[2]
assert(
  output,
  'Usage: node --import tsx test/stellar/simulate-liquidity.ts OUTPUT_DIRECTORY',
)
mkdirSync(output, { recursive: true })
const rpcUrl = process.env.STELLAR_RPC_URL ?? 'https://lb.drpc.live/stellar'
const server = new rpc.Server(rpcUrl, {
  headers: process.env.DRPC_ID
    ? { 'Drpc-Key': process.env.DRPC_ID }
    : undefined,
})
// Public funded account; recording mode does not require or use its private key.
const sender =
  process.env.STELLAR_SIMULATION_ACCOUNT ??
  'GC7RIP4D7UETKBZU7FNUYW5XIR2IPLUQDV2DUTZRKVF6C3P2A5QEDSZI'
const options = {
  rpcUrl,
  networkPassphrase: Networks.PUBLIC,
  publicKey: sender,
}
const factory = new FactoryClient({
  ...options,
  contractId: contractAddresses.FACTORY,
})
const manager = new ManagerClient({
  ...options,
  contractId: contractAddresses.POSITION_MANAGER,
})
const token0 = contractAddresses.TOKENS.XLM
const token1 = STELLAR_USDC[StellarChainId.STELLAR].address

function json(value: unknown): string {
  return JSON.stringify(
    value,
    (_, item) => (typeof item === 'bigint' ? item.toString() : item),
    2,
  )
}

async function simulate(
  client: ContractClient,
  method: string,
  args: object = {},
): Promise<
  rpc.Api.SimulateTransactionSuccessResponse & {
    result: rpc.Api.SimulateHostFunctionResult
  }
> {
  const tx = new TransactionBuilder(new Account(sender, '0'), {
    fee: '100000',
    networkPassphrase: Networks.PUBLIC,
  })
    .addOperation(
      new Contract(client.options.contractId).call(
        method,
        ...client.spec.funcArgsToScVals(method, args),
      ),
    )
    .setTimeout(300)
    .build()
  const result = await server.simulateTransaction(tx, undefined, 'record')
  if (rpc.Api.isSimulationError(result))
    throw new Error(`${method}: ${result.error}`)
  assert(result.result, `${method}: simulation has no return value`)
  return { ...result, result: result.result }
}

async function download(name: string, address: string): Promise<object> {
  const entry = await server.getContractData(
    address,
    xdr.ScVal.scvLedgerKeyContractInstance(),
  )
  const hash = entry.val.contractData().val().instance().executable().wasmHash()
  const code = await server.getLedgerEntries(
    xdr.LedgerKey.contractCode(new xdr.LedgerKeyContractCode({ hash })),
  )
  assert(code.entries[0], `Missing deployed WASM for ${address}`)
  const bytes = code.entries[0].val.contractCode().code()
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  assert.equal(sha256, hash.toString('hex'))
  writeFileSync(join(output, `${name}.wasm`), bytes)
  return { name, address, sha256, ledger: code.latestLedger }
}

function checkStateChanges(
  changes: rpc.Api.LedgerEntryChange[],
  poolAddress: string,
  tokenId: number,
  liquidity: bigint,
  amount0: bigint,
  amount1: bigint,
): void {
  let ownerChecked = false
  let positionChecked = false
  let debited0 = 0n
  let debited1 = 0n
  const credits = new Map<string, bigint>()
  for (const change of changes) {
    const before = change.before?.data()
    const after = change.after?.data()
    if (!after) continue
    if (
      before?.switch().name === 'account' &&
      after.switch().name === 'account' &&
      StrKey.encodeEd25519PublicKey(after.account().accountId().ed25519()) ===
        sender
    ) {
      debited0 +=
        BigInt(before.account().balance().toString()) -
        BigInt(after.account().balance().toString())
    }
    if (
      before?.switch().name === 'trustline' &&
      after.switch().name === 'trustline' &&
      StrKey.encodeEd25519PublicKey(after.trustLine().accountId().ed25519()) ===
        sender
    ) {
      debited1 +=
        BigInt(before.trustLine().balance().toString()) -
        BigInt(after.trustLine().balance().toString())
    }
    if (after.switch().name !== 'contractData') continue
    const data = after.contractData()
    const contract = Address.fromScAddress(data.contract()).toString()
    const key: unknown = scValToNative(data.key())
    if (!Array.isArray(key)) continue
    const value: unknown = scValToNative(data.val())
    if (
      contract === contractAddresses.POSITION_MANAGER &&
      key[0] === 'Owner' &&
      key[1] === tokenId
    ) {
      assert.equal(value, sender)
      ownerChecked = true
    }
    if (
      contract === contractAddresses.POSITION_MANAGER &&
      key[0] === 'Position' &&
      key[1] === tokenId
    ) {
      assert(value && typeof value === 'object' && 'liquidity' in value)
      assert.equal(value.liquidity, liquidity)
      positionChecked = true
    }
    if (
      (contract === token0 || contract === token1) &&
      key[0] === 'Balance' &&
      key[1] === poolAddress
    ) {
      const previous: unknown = before
        ? scValToNative(before.contractData().val())
        : { amount: 0n }
      assert(
        previous &&
          typeof previous === 'object' &&
          'amount' in previous &&
          typeof previous.amount === 'bigint',
      )
      assert(
        value &&
          typeof value === 'object' &&
          'amount' in value &&
          typeof value.amount === 'bigint',
      )
      credits.set(contract, value.amount - previous.amount)
    }
  }
  assert(
    ownerChecked && positionChecked,
    'Mint must create the recipient NFT and position',
  )
  assert.equal(debited0, amount0, 'Sender XLM debit')
  assert.equal(debited1, amount1, 'Sender USDC debit')
  assert.equal(credits.get(token0) ?? 0n, amount0, 'Pool XLM credit')
  assert.equal(credits.get(token1) ?? 0n, amount1, 'Pool USDC credit')
}

const discovery = await simulate(factory, 'get_pool', {
  token_a: token0,
  token_b: token1,
  fee: 3000,
})
const poolAddress: unknown = scValToNative(discovery.result.retval)
assert(typeof poolAddress === 'string')
const pool = new PoolClient({ ...options, contractId: poolAddress })
const hashes = await Promise.all([
  download('factory', contractAddresses.FACTORY),
  download('manager', contractAddresses.POSITION_MANAGER),
  download('pool', poolAddress),
])
const defaultHash = await simulate(factory, 'get_pool_wasm_hash')
assert.equal(
  Buffer.from(scValToNative(defaultHash.result.retval)).toString('hex'),
  createHash('sha256')
    .update(readFileSync(join(output, 'pool.wasm')))
    .digest('hex'),
)
writeFileSync(join(output, 'deployment.json'), json(hashes))

const results: object[] = []
for (const mode of ['within', 'below', 'above', 'full'] as const) {
  // Require reads and mint to use the same ledger so a moving price cannot masquerade as a math mismatch.
  let completed = false
  for (let attempt = 0; attempt < 8 && !completed; attempt++) {
    const [stateResult, hintsResult] = await Promise.all([
      simulate(pool, 'slot0'),
      simulate(pool, 'get_oracle_hints'),
    ])
    const state: unknown = scValToNative(stateResult.result.retval)
    const hintsValue: unknown = scValToNative(hintsResult.result.retval)
    assert(
      state &&
        typeof state === 'object' &&
        'sqrt_price_x96' in state &&
        typeof state.sqrt_price_x96 === 'bigint' &&
        'tick' in state &&
        typeof state.tick === 'number',
    )
    assert(
      hintsValue &&
        typeof hintsValue === 'object' &&
        'slot' in hintsValue &&
        typeof hintsValue.slot === 'bigint' &&
        'checkpoint' in hintsValue &&
        typeof hintsValue.checkpoint === 'number' &&
        'checkpoint_min' in hintsValue &&
        typeof hintsValue.checkpoint_min === 'number',
    )
    const hints: OracleHints = {
      slot: hintsValue.slot,
      checkpoint: hintsValue.checkpoint,
      checkpoint_min: hintsValue.checkpoint_min,
    }
    const center = Math.floor(state.tick / 60) * 60
    const tickLower =
      mode === 'full' ? -887220 : mode === 'below' ? center + 600 : center - 600
    const tickUpper =
      mode === 'full' ? 887220 : mode === 'above' ? center - 60 : center + 660
    const quote = getLiquidityAmounts(
      state.sqrt_price_x96,
      tickLower,
      tickUpper,
      10000000n,
      10000000n,
    )
    assert(quote.liquidity > 0n)
    const result = await simulate(manager, 'mint_with_hints', {
      params: {
        token0,
        token1,
        fee: 3000,
        recipient: sender,
        sender,
        tick_lower: tickLower,
        tick_upper: tickUpper,
        amount0_desired: quote.amount0,
        amount1_desired: quote.amount1,
        amount0_min: 0n,
        amount1_min: 0n,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 300),
      },
      hints,
    })
    if (
      result.latestLedger !== stateResult.latestLedger ||
      result.latestLedger !== hintsResult.latestLedger
    )
      continue
    const value: unknown = scValToNative(result.result.retval)
    assert(Array.isArray(value) && value.length === 4)
    const [tokenId, liquidity, amount0, amount1] = value
    assert(
      typeof tokenId === 'number' &&
        typeof liquidity === 'bigint' &&
        typeof amount0 === 'bigint' &&
        typeof amount1 === 'bigint',
    )
    const lower = getSqrtRatioAtTick(tickLower)
    const upper = getSqrtRatioAtTick(tickUpper)
    const price =
      state.sqrt_price_x96 < lower
        ? lower
        : state.sqrt_price_x96 > upper
          ? upper
          : state.sqrt_price_x96
    assert.equal(liquidity, quote.liquidity, `${mode}: liquidity`)
    assert.equal(
      amount0,
      SqrtPriceMath.getAmount0Delta(price, upper, liquidity, true),
      `${mode}: charge0`,
    )
    assert.equal(
      amount1,
      SqrtPriceMath.getAmount1Delta(lower, price, liquidity, true),
      `${mode}: charge1`,
    )
    assert(amount0 <= quote.amount0 && amount1 <= quote.amount1)
    assert(
      result.stateChanges,
      'RPC must return state changes to verify transfers and NFT ownership',
    )
    checkStateChanges(
      result.stateChanges,
      poolAddress,
      tokenId,
      liquidity,
      amount0,
      amount1,
    )
    const row = {
      mode,
      ledger: result.latestLedger,
      state,
      tickLower,
      tickUpper,
      quote,
      minted: { tokenId, liquidity, amount0, amount1 },
      authorizations: result.result.auth.length,
      stateChanges: result.stateChanges?.length,
      minResourceFee: result.minResourceFee,
    }
    results.push(row)
    writeFileSync(
      join(output, `live-${mode}-response.json`),
      json({
        ...row,
        events: result.events.map((event) => event.toXDR('base64')),
        stateChanges: result.stateChanges?.map((change) => ({
          type: change.type,
          key: change.key.toXDR('base64'),
          before: change.before?.toXDR('base64'),
          after: change.after?.toXDR('base64'),
        })),
      }),
    )
    console.log(json(row))
    completed = true
  }
  assert(
    completed,
    `${mode}: could not obtain reads and mint from the same ledger`,
  )
}
writeFileSync(join(output, 'live-results.json'), json(results))
console.log(
  `PASS: ${results.length} live mint simulations; no transactions signed or submitted`,
)
