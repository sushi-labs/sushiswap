import { useMemo } from 'react'
import { TransferToken } from 'src/lib/wagmi/systems/Checker/TransferToken'
import { Amounts } from 'src/lib/wagmi/systems/Checker/amounts'
import { Guard } from 'src/lib/wagmi/systems/Checker/guard'
import { Network } from 'src/lib/wagmi/systems/Checker/network'
import { Amount } from 'sushi'
import { useRecentRecipients } from '../../../lib/wagmi/hooks/hooks/use-recent-recipients'
import { useSendTokens } from './send-token-provider'

export const SendButton = ({
  isRecipientValid,
}: { isRecipientValid: boolean }) => {
  const { state, mutate } = useSendTokens()
  const { addRecent } = useRecentRecipients()

  const amounts = useMemo(() => {
    if (!state.token0) return []
    if (!state.amount || Number.isNaN(Number(state.amount))) return []

    return [new Amount(state.token0, state.amount)]
  }, [state.token0, state.amount])

  return (
    <Network chainId={state.token0?.chainId} className="!max-h-[52px]">
      <Amounts
        amounts={amounts}
        chainId={state.token0?.chainId}
        className="!max-h-[52px]"
        variant="destructive"
      >
        <Guard
          size="xl"
          guardText="Enter Amount"
          guardWhen={!state.amount}
          variant="default"
          className="!max-h-[52px]"
        >
          <Guard
            size="xl"
            guardText="Enter Recipient"
            guardWhen={!state.resolvedRecipientAddress}
            variant="default"
            className="!max-h-[52px]"
          >
            <Guard
              size="xl"
              guardText="Invalid recipient"
              guardWhen={!isRecipientValid}
              variant="destructive"
              className="!max-h-[52px]"
            >
              <TransferToken
                size="xl"
                id="send-button"
                className="!max-h-[52px]"
                amount={amounts[0]}
                sendTo={state.resolvedRecipientAddress as `0x${string}`}
                enabled={true}
                onSuccess={() => {
                  mutate.setAmount(undefined)
                  mutate.setRawRecipientInput('')
                  addRecent(state.rawRecipientInput)
                }}
              />
            </Guard>
          </Guard>
        </Guard>
      </Amounts>
    </Network>
  )
}
