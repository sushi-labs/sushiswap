import { ChainId } from '@sushiswap/chain'
import { Amount, Token, tryParseAmount } from '@sushiswap/currency'
import { Button, Dialog, Dots, Form } from '@sushiswap/ui'
import { Incentive } from 'features'
// import { createToast } from 'components'
// import { Stream } from 'lib'
import { Farm } from 'features/onsen/context/Farm'
import { FundSource, useWalletBalance } from 'hooks'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useContractWrite } from 'wagmi'

import STAKING_ABI from '../abis/Staking.json'
import { CurrencyInput } from './CurrencyInput'
import IncentiveTable from './IncentiveTable'
import { createToast } from './Toast'

interface StakeAndSubscribeModalProps {
  farm: Farm
  // abi: ContractInterface
  // address: string
  // fn: string
}

export const StakeAndSubscribeModal: FC<StakeAndSubscribeModalProps> = ({ farm }) => {
  const [open, setOpen] = useState(false)
  const { data: account } = useAccount()
  const [selectedIncentives, setSelectedIncentives] = useState<Incentive[]>([])
  const stakeToken = useMemo(() => farm.incentives[0].liquidityStaked.currency, [farm])
  const { data: balance } = useWalletBalance(account?.address, stakeToken, FundSource.WALLET)

  const [amount, setAmount] = useState<Amount<Token>>()
  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    {
      addressOrName: '0x1CeD9B90aa573849b42ADAC7204860823c290dAc',
      contractInterface: STAKING_ABI,
    },
    'stakeAndSubscribeToIncentives',
    {
      onSuccess() {
        setOpen(false)
      },
    }
  )

  const stakeAndSubscribe = useCallback(async () => {
    if (!account) return
    const data = await writeAsync({
      args: [stakeToken.address, amount?.quotient.toString(), selectedIncentives.map((incentive) => incentive.id), false],
    })

    createToast({
      title: 'Stake and subscribe',
      description: `You have successfully staked ${stakeToken.symbol} and subscribed to ${selectedIncentives
        .map((incentive) => incentive.rewardRemaining.currency.symbol)
        .join(', ')}`,
      promise: data.wait(),
    })
  }, [account, amount, selectedIncentives, stakeToken, writeAsync])

  const onInput = useCallback(
    (val: string) => {
      console.log(val)
      if (isNaN(Number(val)) || Number(val) < 0 || !stakeToken) {
        setAmount(undefined)
      } else {
        setAmount(tryParseAmount(val, stakeToken))
      }
    },
    [stakeToken]
  )

  if (!account) return <></>

  return (
    <>
      <Button
        variant="filled"
        color="blue"
        // startIcon={<TrashIcon className="text-red-900" width={24} height={24} />}
        onClick={() => setOpen(true)}
      >
        Farm
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-5 !max-w-m">
          <Dialog.Header title={`Farm ${stakeToken.symbol}`} onClose={() => setOpen(false)} />

          <IncentiveTable
            incentives={farm.incentives}
            chainId={ChainId.KOVAN} // TODO: replace with activeChain
            loading={false}
            setSelectedRows={setSelectedIncentives}
            placeholder="No subscriptions available"
          />
          <Form.Control label="Amount to withdraw">
            <CurrencyInput.Base
              currency={stakeToken}
              onChange={onInput}
              value={amount?.toExact()}
              // error={!amount}
              bottomPanel={<CurrencyInput.BottomPanel loading={false} label="Available" amount={balance} />}
              helperTextPanel={
                amount && balance && amount.greaterThan(balance) ? (
                  <CurrencyInput.HelperTextPanel isError={true} text="Not enough available" />
                ) : (
                  <></>
                )
              }
            />
          </Form.Control>

          <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={isWritePending || selectedIncentives.length == 0 || !amount?.greaterThan(0)}
            onClick={stakeAndSubscribe}
          >
            {isWritePending ? <Dots>{`Staking & Subscribing`}</Dots> : 'Stake & Subscribe'}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
