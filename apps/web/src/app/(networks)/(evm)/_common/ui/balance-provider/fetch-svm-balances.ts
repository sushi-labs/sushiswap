import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import {
  TOKEN_2022_PROGRAM_ADDRESS,
  findAssociatedTokenPda,
} from '@solana-program/token-2022'
import { getSvmRpc } from 'src/lib/svm/rpc'
import { getNativeAddress } from 'sushi'
import type { SvmAddress, SvmChainId } from 'sushi/svm'

interface FetchSvmBalancesParams {
  chainId: SvmChainId
  tokenAddresses: SvmAddress[]
  account: SvmAddress
}

const ACCOUNT_FETCH_CHUNK_SIZE = 100

export async function fetchSvmBalances({
  chainId,
  tokenAddresses,
  account,
}: FetchSvmBalancesParams): Promise<ReadonlyMap<SvmAddress, bigint>> {
  const nativeAddress = getNativeAddress(chainId) as SvmAddress
  const uniqueTokenAddresses = Array.from(new Set(tokenAddresses))

  const includesNative = uniqueTokenAddresses.includes(nativeAddress)
  const requestedMints = uniqueTokenAddresses.filter(
    (address) => address !== nativeAddress,
  )

  const balanceMap = new Map<SvmAddress, bigint>()
  requestedMints.forEach((mint) => balanceMap.set(mint, 0n))

  const rpc = getSvmRpc()

  if (includesNative) {
    const result = await rpc.getBalance(account).send()
    balanceMap.set(nativeAddress, result.value)
  }

  if (requestedMints.length > 0) {
    const ataToMintMap = new Map<SvmAddress, SvmAddress>()
    const allPotentialAccounts: SvmAddress[] = []

    await Promise.all(
      requestedMints.map(async (mint) => {
        const [classicAta] = await findAssociatedTokenPda({
          mint,
          owner: account,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
        })

        const [token22Ata] = await findAssociatedTokenPda({
          mint,
          owner: account,
          tokenProgram: TOKEN_2022_PROGRAM_ADDRESS,
        })

        allPotentialAccounts.push(classicAta, token22Ata)
        ataToMintMap.set(classicAta, mint)
        ataToMintMap.set(token22Ata, mint)
      }),
    )

    for (
      let offset = 0;
      offset < allPotentialAccounts.length;
      offset += ACCOUNT_FETCH_CHUNK_SIZE
    ) {
      const slice = allPotentialAccounts.slice(
        offset,
        offset + ACCOUNT_FETCH_CHUNK_SIZE,
      )

      const { value } = await rpc
        .getMultipleAccounts(slice, {
          encoding: 'jsonParsed',
          commitment: 'confirmed',
        })
        .send()

      value.forEach((accountInfo, index) => {
        if (!accountInfo) return

        const parsed = (accountInfo as { data?: { parsed?: unknown } }).data
          ?.parsed as
          | { info?: { mint?: string; tokenAmount?: { amount?: string } } }
          | undefined

        const amountStr = parsed?.info?.tokenAmount?.amount
        const parsedMint = parsed?.info?.mint
        const queriedAddress = slice[index]
        const originalMint = queriedAddress
          ? ataToMintMap.get(queriedAddress)
          : undefined

        if (!originalMint || !amountStr) return
        if (parsedMint && parsedMint !== originalMint) return

        balanceMap.set(originalMint, BigInt(amountStr))
      })
    }
  }

  return balanceMap
}
