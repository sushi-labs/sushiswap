import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Button, CardFooter, CardTitle, Dots } from '@sushiswap/ui'
import { Card, CardDescription, CardHeader } from '@sushiswap/ui'
import { CardContent, CardGroup, CardItem, CardLabel } from '@sushiswap/ui'
import { Provider } from 'aptos'
import WalletSelector from 'components/WalletSelector'
import { createToast } from 'components/toast'
import { networkNameToNetwork } from 'config/chains'
import { Aptos } from 'lib/coins'
import { useParams } from 'next/navigation'
import { FC, useState } from 'react'
import { formatUSD } from 'sushi/format'
import { useNetwork } from 'utils/useNetwork'
import useStablePrice from 'utils/useStablePrice'
import { formatNumber } from 'utils/utilFunctions'

interface Props {
  reward: number
  decimals: number | undefined
  isLoading: boolean
}

export const PoolMyRewards: FC<Props> = ({ reward, decimals, isLoading }) => {
  const router = useParams()
  const { connected, signAndSubmitTransaction } = useWallet()

  const {
    network,
    contracts: { swap: swapContract, masterchef: masterchefContract },
  } = useNetwork()

  const aptosPrice = useStablePrice({ currency: Aptos[network] })
  const aptosPriceInUsd = aptosPrice
    ? aptosPrice * parseFloat(formatNumber(reward, decimals as number))
    : 0
  const tokenAddress = decodeURIComponent(router?.id)
  const [isTransactionPending, setTransactionPending] = useState<boolean>(false)

  const harvest = async () => {
    if (!masterchefContract) return

    const provider = new Provider(networkNameToNetwork(network))
    setTransactionPending(true)
    try {
      const response = await signAndSubmitTransaction({
        type: 'entry_function_payload',
        type_arguments: [`${swapContract}::swap::LPToken<${tokenAddress}>`],
        arguments: [0],
        function: `${masterchefContract}::masterchef::deposit`,
      })

      await provider.waitForTransaction(response?.hash)

      //return from here if response is failed
      if (!response?.success) return
      const toastId = `completed:${response?.hash}`
      createToast({
        summery: 'Successfully claimed rewards',
        toastId: toastId,
      })
      setTransactionPending(false)
    } catch (err) {
      console.log(err)
      const toastId = `failed:${Math.random()}`
      createToast({
        summery: 'Something went wrong when claiming rewards',
        toastId: toastId,
      })
    } finally {
      setTransactionPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unclaimed rewards</CardTitle>
        <CardDescription>Total: {formatUSD(aptosPriceInUsd)}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardGroup>
          <CardLabel>Tokens</CardLabel>
          <CardItem
            title={
              <div className="font-medium flex items-center gap-2 text-muted-foreground">
                <img
                  src="https://cryptototem.com/wp-content/uploads/2022/08/aptos-logo.jpg"
                  className="rounded-full"
                  height={18}
                  width={18}
                  alt=""
                />{' '}
                APT
              </div>
            }
          >
            <span className="flex gap-1 font-semibold">
              {' '}
              {reward
                ? parseFloat(String(formatNumber(reward, decimals as number)))
                : 0}{' '}
            </span>
          </CardItem>
        </CardGroup>
      </CardContent>
      <CardFooter>
        {!connected ? (
          <WalletSelector />
        ) : (
          <Button fullWidth onClick={harvest} disabled={isTransactionPending}>
            {isTransactionPending ? <Dots>Claiming</Dots> : 'Claim'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
