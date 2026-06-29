'use client'
import { Message, classNames } from '@sushiswap/ui'
import { useActiveAccountState } from '../../active-account-provider'

export const VaultTradingMessage = () => {
  const {
    state: { activeAccount },
  } = useActiveAccountState()

  return (
    <div
      data-vault-trading={activeAccount?.type === 'vault'}
      className={classNames(
        'hidden top-[56px] data-[vault-trading=true]:block data-[vault-trading=true]:animate-slide w-screen z-[11] items-center justify-center bg-perps-background',
      )}
    >
      <Message
        variant="info"
        className="!p-3 !text-xs !rounded-md !text-blue-100 border border-blue/50 mx-1"
      >
        IMPORTANT: You are trading on behalf of your vault {activeAccount?.name}
        .
      </Message>
    </div>
  )
}
