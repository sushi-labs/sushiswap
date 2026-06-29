'use client'

import { useActiveAccountState } from '~evm/perps/active-account-provider'

export const Title = () => {
  const {
    state: { activeAccount },
  } = useActiveAccountState()
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-medium text-4xl">Portfolio</h1>
      {activeAccount?.type === 'vault' ? (
        <p className="text-sm">
          Vault:{' '}
          <span className="text-perps-muted-50">{activeAccount.name}</span>
        </p>
      ) : null}
    </div>
  )
}
