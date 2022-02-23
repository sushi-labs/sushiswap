import { FC } from 'react'
import { MetaMaskWalletView } from './types'

const MetaMaskStatusView: FC<MetaMaskWalletView> = ({ hooks: { useError, useAccounts, useChainId } }) => {
  const chainId = useChainId()
  const accounts = useAccounts()
  const error = useError()

  const connected = Boolean(chainId && accounts)

  return (
    <div>
      <b>MetaMask</b>
      {error ? (
        <>
          🛑 {error.name ?? 'Error'}: {error.message}
        </>
      ) : connected ? (
        <>✅ Connected</>
      ) : (
        <>⚠️ Disconnected</>
      )}
    </div>
  )
}

export default MetaMaskStatusView
