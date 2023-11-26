import { AppearOnMount, Dots } from '@sushiswap/ui'
import { FC, useState } from 'react'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/future/components/button'
import { Token } from 'utils/tokenType'
import { useParams } from 'next/navigation'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Provider } from 'aptos'
import { createToast } from 'components/toast'
import { useNetwork } from 'utils/useNetwork'
import { networkNameToNetwork } from 'config/chains'

interface AddSectionStakeProps {
  token0: Token
  token1: Token
  stakeAmount: number
  balance: number
  decimals: number
  lpTokenName: string | undefined
}

export const RemoveSectionUnstake: FC<{
  token0: Token
  token1: Token
  stakeAmount: number
  balance: number
  decimals: number
  lpTokenName: string | undefined
}> = ({ token0, token1, stakeAmount, balance, decimals, lpTokenName }) => {
  const isMounted = useIsMounted()
  if (!isMounted) return <></>
  return (
    <AppearOnMount show={true}>
      <_RemoveSectionUnstake
        token0={token0}
        token1={token1}
        stakeAmount={stakeAmount}
        balance={balance}
        decimals={decimals}
        lpTokenName={lpTokenName}
      />
    </AppearOnMount>
  )
}

export const _RemoveSectionUnstake: FC<AddSectionStakeProps> = ({
  token0,
  token1,
  stakeAmount,
  balance,
  decimals,
  lpTokenName,
}) => {
  const [value, setValue] = useState('')

  const {
    network,
    contracts: { swap: swapContract, masterchef: masterchefContract },
  } = useNetwork()

  const router = useParams()
  const tokenAddress = decodeURIComponent(router?.id)
  const { signAndSubmitTransaction } = useWallet()
  const [isTransactionPending, setTransactionPending] = useState<boolean>(false)
  const withdrawLiquidity = async () => {
    if (!masterchefContract) return

    const provider = new Provider(networkNameToNetwork(network))
    setTransactionPending(true)

    try {
      const response = await signAndSubmitTransaction({
        type: 'entry_function_payload',
        type_arguments: [`${swapContract}::swap::LPToken<${tokenAddress}>`],
        arguments: [parseInt(String(Number(value) * 10 ** decimals))],
        function: `${masterchefContract}::masterchef::withdraw`,
      })
      await provider.waitForTransaction(response?.hash)
      //return from here if response is failed
      if (!response?.success) return
      const toastId = `completed:${response?.hash}`
      createToast({
        summery: `Successfully unstaked ${value} ${lpTokenName} tokens`,
        toastId: toastId,
      })
      setTransactionPending(false)
    } catch (err) {
      console.log(err)
      const toastId = `failed:${Math.random()}`
      createToast({
        summery: `Something went wrong when unstaking ${lpTokenName} tokens`,
        toastId: toastId,
      })
    } finally {
      setTransactionPending(false)
    }
  }
  return (
    <RemoveSectionUnstakeWidget
      value={value}
      setValue={setValue}
      token0={token0}
      token1={token1}
      stakeAmount={stakeAmount}
      balance={balance}
    >
      {Number(value) > balance ? (
        <Button size="xl" variant="filled" disabled testId="stake-liquidity">
          Insufficient Balance
        </Button>
      ) : (
        <Button
          onClick={Number(value) > 0 ? withdrawLiquidity : () => {}}
          fullWidth
          size="xl"
          variant="filled"
          disabled={isTransactionPending || !value}
          testId="unstake-liquidity"
        >
          {isTransactionPending ? <Dots>Confirm transaction</Dots> : 'Unstake Liquidity'}
        </Button>
      )}
    </RemoveSectionUnstakeWidget>
  )
}
