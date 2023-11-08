import { Button, Dots } from '@sushiswap/ui'
import { FC, useState } from 'react'
import { AddSectionStakeWidget } from './AddSectionStakeWidget'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Provider } from 'aptos'
import { useParams } from 'next/navigation'
import { createToast } from 'components/toast'
import { providerNetwork } from 'lib/constants'

interface AddSectionStakeProps {
  balance: number
  decimals: number | undefined
  lpTokenName: string | undefined
}
const MASTERCHEF_CONTRACT =
  process.env['MASTERCHEF_CONTRACT'] ||
  process.env['NEXT_PUBLIC_MASTERCHEF_CONTRACT']
const CONTRACT_ADDRESS =
  process.env['NEXT_PUBLIC_SWAP_CONTRACT'] ||
  process.env['NEXT_PUBLIC_SWAP_CONTRACT']

export const AddSectionStake: FC<{
  balance: number
  decimals: number | undefined
  lpTokenName: string | undefined
}> = ({ balance, decimals, lpTokenName }) => {
  return (
    <_AddSectionStake
      balance={balance}
      decimals={decimals}
      lpTokenName={lpTokenName}
    />
  )
}

const _AddSectionStake: FC<AddSectionStakeProps> = ({
  balance,
  decimals,
  lpTokenName,
}) => {
  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id)
  const [value, setValue] = useState('')
  const { signAndSubmitTransaction } = useWallet()
  const [isTransactionPending, setTransactionPending] = useState<boolean>(false)

  const depositeLiquidity = async () => {
    if (!decimals) return

    const provider = new Provider(providerNetwork)
    setTransactionPending(true)

    try {
      const response = await signAndSubmitTransaction({
        type: 'entry_function_payload',
        type_arguments: [`${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>`],
        arguments: [parseInt(String(Number(value) * 10 ** decimals))],
        function: `${MASTERCHEF_CONTRACT}::masterchef::deposit`,
      })
      await provider.waitForTransaction(response?.hash)
      //return from here if response is failed
      if (!response?.success) return
      const toastId = `completed:${response?.hash}`
      createToast({
        summery: `Successfully staked ${value} ${lpTokenName} tokens`,
        toastId: toastId,
      })
      setTransactionPending(false)
    } catch (err) {
      console.log(err)
      const toastId = `failed:${Math.random()}`
      createToast({
        summery: `Something went wrong when staking ${lpTokenName} tokens`,
        toastId: toastId,
      })
    } finally {
      setTransactionPending(false)
    }
  }

  return (
    <AddSectionStakeWidget value={value} setValue={setValue} balance={balance}>
      {Number(value) > balance ? (
        <Button size="default" disabled testId="stake-liquidity">
          Insufficient Balance
        </Button>
      ) : (
        <Button
          onClick={Number(value) > 0 ? depositeLiquidity : () => {}}
          fullWidth
          size="default"
          disabled={isTransactionPending || !value}
          testId="stake-liquidity"
        >
          {isTransactionPending ? (
            <Dots>Confirm transaction</Dots>
          ) : (
            'Stake Liquidity'
          )}
        </Button>
      )}
    </AddSectionStakeWidget>
  )
}
