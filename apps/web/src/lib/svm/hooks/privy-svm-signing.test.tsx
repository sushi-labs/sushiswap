/** @vitest-environment jsdom */

import type { ReadonlyUint8Array } from '@solana/kit'
import { act } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import type { SvmAddress, SvmTxHash } from 'sushi/svm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSvmSignAndSendTransaction } from './use-svm-sign-and-send-transaction'
import { useSvmSignTransaction } from './use-svm-sign-transaction'

const ADDRESS = '11111111111111111111111111111111' as SvmAddress

const harness = vi.hoisted(() => ({
  getPrivyWallet: vi.fn(),
  signAndSendSvmTransaction: vi.fn(),
  signSvmTransaction: vi.fn(),
  signer: {
    address: '11111111111111111111111111111111',
    signAndSendTransaction: vi.fn(),
    signTransaction: vi.fn(),
  },
}))

vi.mock('@solana/connector', () => ({
  useTransactionSigner: () => ({ signer: harness.signer }),
}))

vi.mock('@solana/connector/react', () => ({
  useConnector: () => ({
    wallet: {
      status: 'connected',
      session: { connectorId: 'wallet-standard:privy' },
    },
  }),
}))

vi.mock('@solana/kit', () => ({
  getSignatureFromTransaction: () => 'signed-transaction-signature',
  getTransactionDecoder: () => ({ decode: vi.fn(() => ({})) }),
}))

vi.mock('../../wallet/hooks/use-privy-embedded', () => ({
  usePrivyEmbeddedWallet: () => harness.getPrivyWallet(),
}))

vi.mock('../../wallet/privy/use-privy-runtime', () => ({
  usePrivyRuntime: () => ({
    operations: {
      signAndSendSvmTransaction: harness.signAndSendSvmTransaction,
      signSvmTransaction: harness.signSvmTransaction,
    },
  }),
}))

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

type SigningHandlers = {
  signAndSendTransaction: ReturnType<
    typeof useSvmSignAndSendTransaction
  >['signAndSendTransaction']
  signTransaction: ReturnType<typeof useSvmSignTransaction>['signTransaction']
}

function SigningProbe({
  onRender,
}: {
  onRender(handlers: SigningHandlers): void
}) {
  const { signAndSendTransaction } = useSvmSignAndSendTransaction()
  const { signTransaction } = useSvmSignTransaction()
  onRender({ signAndSendTransaction, signTransaction })
  return null
}

describe('Privy SVM signing', () => {
  let container: HTMLDivElement
  let root: Root
  let handlers!: SigningHandlers

  beforeEach(() => {
    vi.clearAllMocks()
    harness.signer.address = ADDRESS
    harness.getPrivyWallet.mockReturnValue({ address: ADDRESS })
    harness.signSvmTransaction.mockResolvedValue({
      signedTransaction: new Uint8Array([9]),
    })
    harness.signAndSendSvmTransaction.mockResolvedValue({
      signature: 'privy-signature' as SvmTxHash,
    })
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    act(() => {
      root.render(
        <SigningProbe
          onRender={(nextHandlers) => {
            handlers = nextHandlers
          }}
        />,
      )
    })
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('uses the active Privy connector while wallet addresses reconcile', async () => {
    const transaction = new Uint8Array([1]) as ReadonlyUint8Array<ArrayBuffer>
    harness.signer.address = '22222222222222222222222222222222'

    await expect(handlers.signTransaction(transaction)).resolves.toEqual({
      base58TxSig: 'signed-transaction-signature',
      base64SignedTx: 'CQ==',
    })
    expect(harness.signSvmTransaction).toHaveBeenCalledWith({
      address: ADDRESS,
      transaction,
    })
    expect(harness.signer.signTransaction).not.toHaveBeenCalled()
  })

  it('signs and sends through Privy even without modal options', async () => {
    const transaction = new Uint8Array([1]) as ReadonlyUint8Array<ArrayBuffer>

    await expect(handlers.signAndSendTransaction(transaction)).resolves.toEqual(
      { base58TxSig: 'privy-signature' },
    )
    expect(harness.signAndSendSvmTransaction).toHaveBeenCalledWith({
      address: ADDRESS,
      transaction,
      uiOptions: undefined,
    })
    expect(harness.signer.signAndSendTransaction).not.toHaveBeenCalled()
  })
})
