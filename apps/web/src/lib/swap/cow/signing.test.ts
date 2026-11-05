import { SigningScheme } from '@cowprotocol/cow-sdk'
import { concatHex, serializeErc6492Signature } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { describe, expect, it } from 'vitest'
import { CowUnsupportedSignatureError } from './errors'
import { getCowOrderSignature, getCowTypedData } from './signing'
import { owner, preparedOrder, token0 } from './test-fixtures'

const otherAccount = privateKeyToAccount(
  '0x0000000000000000000000000000000000000000000000000000000000000002',
)

describe('CoW order signatures', () => {
  it('uses EIP-712 for the owner key and ERC-1271 for anything else', async () => {
    const prepared = await preparedOrder()
    const typedData = await getCowTypedData(prepared)
    const signature = await owner.signTypedData(typedData)
    expect(await getCowOrderSignature(prepared, signature)).toEqual({
      signature,
      scheme: SigningScheme.EIP712,
    })
    const other = await otherAccount.signTypedData(typedData)
    expect((await getCowOrderSignature(prepared, other)).scheme).toBe(
      SigningScheme.EIP1271,
    )
    // Contract signatures need not be 65 bytes.
    const contract = concatHex([signature, signature])
    expect(await getCowOrderSignature(prepared, contract)).toEqual({
      signature: contract,
      scheme: SigningScheme.EIP1271,
    })
  })
  it('unwraps ERC-6492 signatures for the deployed owner', async () => {
    const prepared = await preparedOrder()
    const inner = concatHex([prepared.digest, prepared.digest])
    const wrapped = serializeErc6492Signature({
      address: token0,
      data: '0x1234',
      signature: inner,
    })
    expect(await getCowOrderSignature(prepared, wrapped)).toEqual({
      signature: inner,
      scheme: SigningScheme.EIP1271,
    })
  })
  it('offers on-chain authorization when a multi-signer wallet returns no signature yet', async () => {
    await expect(
      getCowOrderSignature(await preparedOrder(), '0x'),
    ).rejects.toBeInstanceOf(CowUnsupportedSignatureError)
  })
})
