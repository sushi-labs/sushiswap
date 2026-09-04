// Import through the same specifiers the modules under test use: Vitest
// resolves `src/...` and relative paths to separate module instances, which
// would give this test its own copy of the connection store.
import { toEvmWalletId } from 'src/lib/wallet/namespaces/evm/provider/connect-plan'
import { PRIVY_SVM_CONNECTOR_ID } from 'src/lib/wallet/namespaces/svm/config'
import { PRIVY_EVM_CONNECTOR_ID } from 'src/lib/wallet/privy/privy-evm-connector'
import {
  hasPrivyWalletConnectionOutside,
  isPrivyWalletConnectionId,
} from 'src/lib/wallet/privy/privy-session'
import {
  addWalletConnection,
  clearWalletConnections,
} from 'src/lib/wallet/provider/store'
import { EvmChainId } from 'sushi/evm'
import { type SvmAddress, SvmChainId } from 'sushi/svm'
import { beforeEach, describe, expect, it } from 'vitest'

// The ids the namespace providers actually register.
const privyEvmId = toEvmWalletId(PRIVY_EVM_CONNECTOR_ID)
const privySvmId = `svm:${PRIVY_SVM_CONNECTOR_ID.toLowerCase()}`

function connectPrivyEvm(): void {
  addWalletConnection({
    account: '0x0000000000000000000000000000000000000001',
    chainId: EvmChainId.ETHEREUM,
    id: privyEvmId,
    name: 'Email',
    namespace: 'evm',
  })
}

function connectPrivySvm(): void {
  addWalletConnection({
    account: 'So11111111111111111111111111111111111111112' as SvmAddress,
    chainId: SvmChainId.SOLANA,
    id: privySvmId,
    name: 'Email',
    namespace: 'svm',
  })
}

beforeEach(() => {
  clearWalletConnections('evm')
  clearWalletConnections('svm')
  clearWalletConnections('stellar')
})

describe('Privy session sharing', () => {
  it('recognizes the connection ids both namespaces register', () => {
    expect(privyEvmId).toBe('evm:io.privy.wallet')
    expect(privySvmId).toBe('svm:wallet-standard:privy')
    expect(isPrivyWalletConnectionId(privyEvmId)).toBe(true)
    expect(isPrivyWalletConnectionId(privySvmId)).toBe(true)
    // Connections persisted by earlier releases are address-scoped.
    expect(
      isPrivyWalletConnectionId(
        `${privyEvmId}.0x0000000000000000000000000000000000000001`,
      ),
    ).toBe(true)
    expect(isPrivyWalletConnectionId('evm:io.metamask')).toBe(false)
    expect(isPrivyWalletConnectionId('svm:wallet-standard:phantom')).toBe(false)
  })

  it('keeps the session while the other namespace still uses it', () => {
    connectPrivyEvm()
    connectPrivySvm()

    // Disconnecting either wallet must not log the other one out.
    expect(hasPrivyWalletConnectionOutside('svm')).toBe(true)
    expect(hasPrivyWalletConnectionOutside('evm')).toBe(true)
  })

  it('releases the session once the last namespace disconnects', () => {
    connectPrivyEvm()
    connectPrivySvm()

    clearWalletConnections('evm')
    expect(hasPrivyWalletConnectionOutside('svm')).toBe(false)
  })

  it('ignores the disconnecting namespace and other wallets', () => {
    connectPrivySvm()
    addWalletConnection({
      account: '0x0000000000000000000000000000000000000002',
      chainId: EvmChainId.ETHEREUM,
      id: 'evm:io.metamask',
      name: 'MetaMask',
      namespace: 'evm',
    })

    // Only the SVM wallet uses Privy, so its own disconnect may log out.
    expect(hasPrivyWalletConnectionOutside('svm')).toBe(false)
    expect(hasPrivyWalletConnectionOutside('evm')).toBe(true)
  })
})
