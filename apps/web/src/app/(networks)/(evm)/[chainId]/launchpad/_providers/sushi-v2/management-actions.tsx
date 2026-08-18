import { FireIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { Button, Message, TextField } from '@sushiswap/ui'
import type { EvmAddress } from 'sushi/evm'
import { isAddressEqual } from 'viem'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import type { LaunchpadTokenFor } from '../provider-types'
import {
  type SushiV2FeeDisposition,
  getSushiV2FeeDispositionTransitions,
} from './contract'

export function SushiV2ManagementActions({
  token,
  connectedAddress,
  newCreator,
  isUpdating,
  error,
  onNewCreatorChange,
  onTransferCreator,
  onSetFeeDisposition,
}: {
  token: LaunchpadTokenFor<'SUSHI_V2'>
  connectedAddress: EvmAddress | undefined
  newCreator: string
  isUpdating: boolean
  error: string | null
  onNewCreatorChange: (address: string) => void
  onTransferCreator: () => void
  onSetFeeDisposition: (next: SushiV2FeeDisposition) => void
}) {
  const isCurrentCreator = Boolean(
    connectedAddress && isAddressEqual(connectedAddress, token.creator),
  )

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <PerpsCard className="p-5 sm:p-7" fullWidth>
        <div className="flex items-center gap-2">
          <UserCircleIcon className="h-5 w-5 text-perps-blue" />
          <h2 className="font-semibold text-perps-muted">Transfer creator</h2>
        </div>
        <p className="mt-3 text-xs leading-5 text-perps-muted-50">
          The current creator may transfer creator authority. The launch creator
          remains recorded permanently.
        </p>
        <TextField
          type="text"
          value={newCreator}
          onChange={(event) => onNewCreatorChange(event.target.value)}
          placeholder="0x…"
          className="mt-5 !bg-white/[0.04] !text-perps-muted"
        />
        <Button
          fullWidth
          className="mt-3"
          variant="perps-default"
          disabled={isUpdating || !isCurrentCreator}
          onClick={onTransferCreator}
        >
          Transfer creator
        </Button>
      </PerpsCard>

      <PerpsCard className="p-5 sm:p-7" fullWidth>
        <div className="flex items-center gap-2">
          <FireIcon className="h-5 w-5 text-perps-blue" />
          <h2 className="font-semibold text-perps-muted">Fee disposition</h2>
        </div>
        <p className="mt-3 text-xs leading-5 text-perps-muted-50">
          Current mode: {token.feeDisposition.replaceAll('_', ' ')}. Changes are
          creator-only and irreversible.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {getSushiV2FeeDispositionTransitions(token.feeDisposition).map(
            (next) => (
              <Button
                key={next}
                variant={
                  next === 'BUYBACK_AND_BURN'
                    ? 'perps-default'
                    : 'perps-secondary'
                }
                disabled={isUpdating || !isCurrentCreator}
                onClick={() => onSetFeeDisposition(next)}
              >
                {next === 'BUYBACK_AND_BURN'
                  ? 'Buyback & burn'
                  : 'Burn token fees'}
              </Button>
            ),
          )}
          {token.feeDisposition === 'BUYBACK_AND_BURN' ? (
            <span className="text-sm text-perps-muted-50">Terminal mode</span>
          ) : null}
        </div>
      </PerpsCard>
      {error ? (
        <Message variant="destructive" className="lg:col-span-2">
          {error}
        </Message>
      ) : null}
    </div>
  )
}
