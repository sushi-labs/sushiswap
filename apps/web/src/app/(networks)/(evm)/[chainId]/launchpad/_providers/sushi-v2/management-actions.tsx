import {
  BanknotesIcon,
  FireIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { Button, Message, TextField, classNames } from '@sushiswap/ui'
import type { EvmAddress } from 'sushi/evm'
import { isAddressEqual } from 'viem'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import { shortenAddress } from '../../_lib/format'
import type { LaunchpadTokenFor } from '../provider-types'
import {
  SUSHI_V2_FEE_DISPOSITION,
  SUSHI_V2_FEE_DISPOSITION_DESCRIPTIONS,
  SUSHI_V2_FEE_DISPOSITION_LABELS,
  SUSHI_V2_FEE_DISPOSITION_ORDER,
  type SushiV2FeeDisposition,
  getSushiV2FeeDispositionTransitions,
} from './contract'

export function SushiV2ManagementActions({
  token,
  connectedAddress,
  isLaunchpadOwner,
  newCreator,
  newFeeReceiver,
  isUpdating,
  error,
  onNewCreatorChange,
  onNewFeeReceiverChange,
  onTransferCreator,
  onSetFeeReceiver,
  onSetFeeDisposition,
}: {
  token: LaunchpadTokenFor<'SUSHI_V2'>
  connectedAddress: EvmAddress | undefined
  isLaunchpadOwner: boolean
  newCreator: string
  newFeeReceiver: string
  isUpdating: boolean
  error: string | null
  onNewCreatorChange: (address: string) => void
  onNewFeeReceiverChange: (address: string) => void
  onTransferCreator: () => void
  onSetFeeReceiver: () => void
  onSetFeeDisposition: (next: SushiV2FeeDisposition) => void
}) {
  const isCurrentCreator = Boolean(
    connectedAddress && isAddressEqual(connectedAddress, token.creator),
  )
  const canTransferCreator = isCurrentCreator || isLaunchpadOwner
  const currentDispositionOrdinal =
    SUSHI_V2_FEE_DISPOSITION[token.feeDisposition]
  const isFinalDisposition =
    getSushiV2FeeDispositionTransitions(token.feeDisposition).length === 0

  return (
    <div className="mt-5 grid items-start gap-5 lg:grid-cols-2">
      <PerpsCard className="p-5 sm:p-7" fullWidth>
        <div className="flex items-center gap-2">
          <UserCircleIcon className="h-5 w-5 text-perps-blue" />
          <h2 className="font-semibold text-perps-muted">Transfer creator</h2>
        </div>
        <p className="mt-3 text-xs leading-5 text-perps-muted-50">
          The current creator or launchpad owner may transfer creator authority.
          The launch creator remains recorded permanently.
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
          disabled={isUpdating || !canTransferCreator}
          onClick={onTransferCreator}
        >
          Transfer creator
        </Button>
      </PerpsCard>

      <PerpsCard className="p-5 sm:p-7" fullWidth>
        <div className="flex items-center gap-2">
          <BanknotesIcon className="h-5 w-5 text-perps-blue" />
          <h2 className="font-semibold text-perps-muted">
            Transfer fee recipient
          </h2>
        </div>
        <p className="mt-3 text-xs leading-5 text-perps-muted-50">
          The launchpad owner may change where the non-Sushi trading-fee share
          is sent.
        </p>
        <p className="mt-3 break-all font-mono text-xs text-perps-muted-50">
          Current recipient: {token.feeReceiver}
        </p>
        <TextField
          type="text"
          value={newFeeReceiver}
          onChange={(event) => onNewFeeReceiverChange(event.target.value)}
          placeholder="0x…"
          className="mt-5 !bg-white/[0.04] !text-perps-muted"
        />
        <Button
          fullWidth
          className="mt-3"
          variant="perps-default"
          disabled={isUpdating || !isLaunchpadOwner}
          onClick={onSetFeeReceiver}
        >
          Transfer fee recipient
        </Button>
      </PerpsCard>

      <PerpsCard className="p-5 sm:p-7" fullWidth>
        <div className="flex items-center gap-2">
          <FireIcon className="h-5 w-5 text-perps-blue" />
          <h2 className="font-semibold text-perps-muted">Fee disposition</h2>
        </div>
        <p className="mt-3 text-xs leading-5 text-perps-muted-50">
          Where the non-Sushi share of trading fees goes. The creator can only
          move further toward burning, never back.
        </p>
        <div className="mt-5 space-y-2">
          {SUSHI_V2_FEE_DISPOSITION_ORDER.map((disposition) => {
            const isCurrent = disposition === token.feeDisposition
            const isPassed =
              SUSHI_V2_FEE_DISPOSITION[disposition] < currentDispositionOrdinal

            return (
              <div
                key={disposition}
                className={classNames(
                  'rounded-xl border p-3 transition',
                  isCurrent
                    ? 'border-perps-blue/40 bg-perps-blue/[0.06]'
                    : 'border-white/[0.06] bg-white/[0.02]',
                  isPassed ? 'opacity-40' : '',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={classNames(
                      'text-sm font-medium',
                      isCurrent ? 'text-perps-muted' : 'text-perps-muted-50',
                    )}
                  >
                    {SUSHI_V2_FEE_DISPOSITION_LABELS[disposition]}
                  </span>
                  {isCurrent ? (
                    <span className="rounded-full bg-perps-blue/[0.15] px-2 py-0.5 text-[11px] font-medium text-perps-blue">
                      Current
                    </span>
                  ) : isPassed ? (
                    <span className="text-[11px] text-perps-muted-50">
                      Passed
                    </span>
                  ) : (
                    <Button
                      size="xs"
                      variant="perps-secondary"
                      disabled={isUpdating || !isCurrentCreator}
                      onClick={() => onSetFeeDisposition(disposition)}
                    >
                      Switch
                    </Button>
                  )}
                </div>
                <p className="mt-1.5 text-xs leading-5 text-perps-muted-50">
                  {SUSHI_V2_FEE_DISPOSITION_DESCRIPTIONS[disposition]}
                </p>
              </div>
            )
          })}
        </div>
        <p className="mt-4 text-xs leading-5 text-perps-muted-50">
          {isFinalDisposition
            ? `${SUSHI_V2_FEE_DISPOSITION_LABELS[token.feeDisposition]} is the last step, fee disposition can no longer change for this launch.`
            : isCurrentCreator
              ? 'Switching is irreversible and applies to every distribution afterwards.'
              : `Only the current creator (${shortenAddress(token.creator, 4)}) can switch modes.`}
        </p>
      </PerpsCard>
      {error ? (
        <Message variant="destructive" className="lg:col-span-2">
          {error}
        </Message>
      ) : null}
    </div>
  )
}
