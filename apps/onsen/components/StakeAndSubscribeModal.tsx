import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dialog, Dots, Form } from '@sushiswap/ui'
import { Approve } from '@sushiswap/wagmi'
import { Farm } from 'lib/Farm'
import { networks, useStakingContract, useWalletBalance } from 'lib/hooks'
import { Incentive } from 'lib/Incentive'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

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
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const [selectedIncentives, setSelectedIncentives] = useState<Incentive[]>([])
  const stakeToken = useMemo(() => farm.incentives[0].liquidityStaked.currency, [farm])
  const { data: balance } = useWalletBalance(address, stakeToken, FundSource.WALLET)
  const contract = useStakingContract(activeChain?.id)

  const [input, setInput] = useState<string>('')
  const { writeAsync, isLoading: isWritePending } = useContractWrite({
    addressOrName: activeChain?.id ? networks.get(activeChain?.id) ?? AddressZero : AddressZero,
    contractInterface: STAKING_ABI,
    functionName: 'stakeAndSubscribeToIncentives',
    onSuccess() {
      setOpen(false)
    },
  })

  const amount = useMemo(() => {
    if (!stakeToken) return undefined
    return tryParseAmount(input, stakeToken)
  }, [input, stakeToken])

  const stakeAndSubscribe = useCallback(async () => {
    if (!address || !selectedIncentives || !stakeToken || !amount) return

    const data = await writeAsync({
      args: [
        stakeToken.address,
        amount?.quotient.toString(),
        selectedIncentives.map((incentive) => incentive.id),
        false, // TODO: add input field for this arg
      ],
    })

    createToast({
      title: 'Stake and subscribe',
      description: `You have successfully staked ${
        stakeToken.symbol
      } and subscribed to the following rewards: ${selectedIncentives
        .map((incentive) => incentive.rewardsRemaining.currency.symbol)
        .join(', ')}`,
      promise: data.wait(),
    })
  }, [address, amount, selectedIncentives, stakeToken, writeAsync])

  if (!address) return <></>

  return (
    <>
      <Button variant="filled" color="blue" onClick={() => setOpen(true)}>
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
          <Form.Control label="Amount to stake">
            <CurrencyInput.Base
              currency={stakeToken}
              onChange={setInput}
              value={input}
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
          <Approve
            components={
              <Approve.Components>
                {/* <Approve.Bentobox address={contract?.address} onSignature={setSignature} /> */}
                <Approve.Token amount={amount} address={activeChain?.id ? contract.address : undefined} />
              </Approve.Components>
            }
            render={({ approved }) => (
              <Button
                type="submit"
                variant="filled"
                color="gradient"
                disabled={isWritePending || !approved || selectedIncentives.length == 0 || !amount?.greaterThan(0)}
                onClick={stakeAndSubscribe}
              >
                {isWritePending ? <Dots>{`Staking & Subscribing`}</Dots> : 'Stake & Subscribe'}
              </Button>
            )}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
