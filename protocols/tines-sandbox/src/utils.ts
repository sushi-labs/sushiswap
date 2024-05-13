import { expect } from 'chai'
import { Native, Token } from 'sushi/currency'
import {
  Abi,
  Address,
  GetContractReturnType,
  Hex,
  PublicClient,
  WalletClient,
  erc20Abi,
  getContract,
} from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'

function closeValues(
  _a: number | bigint,
  _b: number | bigint,
  accuracy: number,
): boolean {
  const a = Number(_a)
  const b = Number(_b)
  if (accuracy === 0) return a === b
  if (Math.abs(a) < 1 / accuracy) return Math.abs(a - b) <= 10
  if (Math.abs(b) < 1 / accuracy) return Math.abs(a - b) <= 10
  return Math.abs(a / b - 1) < accuracy
}

export function expectCloseValues(
  _a: number | bigint,
  _b: number | bigint,
  accuracy: number,
  logInfoIfFalse = '',
) {
  const res = closeValues(_a, _b, accuracy)
  if (!res) {
    console.log(`Expected close: ${_a}, ${_b}, ${accuracy} ${logInfoIfFalse}`)
    // debugger
    expect(res).true
  }
  return res
}

export function tryCall<A>(f: () => A): A | undefined {
  try {
    return f()
  } catch {
    //
  }
}

export async function tryCallAsync<A>(
  f: () => Promise<A>,
): Promise<A | undefined> {
  try {
    return await f()
  } catch {
    //
  }
}

export function getRndLin(rnd: () => number, min: number, max: number) {
  return rnd() * (max - min) + min
}
export function getRndLinInt(rnd: () => number, min: number, max: number) {
  return Math.floor(getRndLin(rnd, min, max))
}

export function getRndVariant<A>(rnd: () => number, variants: A[]) {
  return variants[Math.floor(rnd() * variants.length)]
}

export function getRndExp(rnd: () => number, min: number, max: number) {
  const minL = Math.log(min)
  const maxL = Math.log(max)
  const v = rnd() * (maxL - minL) + minL
  const res = Math.exp(v)
  return res
}

export function getRndExpInt(rnd: () => number, min: number, max: number) {
  return Math.floor(getRndExp(rnd, min, max))
}

export const getDeploymentAddress = async (
  client: WalletClient,
  promise: Promise<Hex>,
) =>
  waitForTransactionReceipt(client, { hash: await promise }).then(
    (receipt) => receipt.contractAddress as Address,
  )

export async function deployContract(
  client: PublicClient & WalletClient,
  contract: { abi: unknown; bytecode: string },
  args?: unknown[],
  deployer?: Address,
): Promise<Address> {
  return getDeploymentAddress(
    client,
    client.deployContract({
      chain: null,
      abi: contract.abi as Abi,
      bytecode: contract.bytecode as Hex,
      account: deployer as Address,
      args,
    }),
  )
}

export function tokenContract(
  client: PublicClient & WalletClient,
  token: Token | Address,
): GetContractReturnType<typeof erc20Abi, PublicClient & WalletClient> {
  return getContract({
    address: token instanceof Token ? token.address : token,
    abi: erc20Abi,
    client: { public: client, wallet: client },
  })
}

export async function getBalance(
  client: PublicClient & WalletClient,
  token: Token | Native | Address,
  user: Address,
): Promise<bigint> {
  if (token instanceof Native)
    token = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  else if (token instanceof Token) token = token.address
  if (token.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    return client.getBalance({ address: user })
  return tokenContract(client, token).read.balanceOf([user])
}
