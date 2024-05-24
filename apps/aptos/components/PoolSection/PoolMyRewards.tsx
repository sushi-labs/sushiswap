import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Button, CardFooter, CardTitle, Dots } from '@sushiswap/ui'
import { Card, CardDescription, CardHeader } from '@sushiswap/ui'
import { CardContent, CardGroup, CardItem, CardLabel } from '@sushiswap/ui'
import { Provider } from 'aptos'
import { networkNameToNetwork } from 'config/chains'
import { Aptos } from 'config/coins'
import { formatNumberWithDecimals } from 'lib/common/format-number-with-decimals'
import { useNetwork } from 'lib/common/use-network'
import { useStablePrice } from 'lib/common/use-stable-price'
import { useParams } from 'next/navigation'
import { FC, useState } from 'react'
import { formatUSD } from 'sushi/format'
import { createToast } from 'ui/common/toast'
import { UserProfile } from 'ui/common/user-profile/user-profile'

interface PoolMyRewards {
  reward: number
  decimals: number | undefined
  isLoading: boolean
}

export const PoolMyRewards: FC<PoolMyRewards> = ({ reward, decimals }) => {
  const router = useParams<{ id: string }>()
  const { connected, signAndSubmitTransaction } = useWallet()

  const {
    network,
    contracts: { swap: swapContract, masterchef: masterchefContract },
  } = useNetwork()

  const aptosPrice = useStablePrice({ currency: Aptos[network] })
  const aptosPriceInUsd = aptosPrice
    ? aptosPrice *
      parseFloat(formatNumberWithDecimals(reward, decimals as number))
    : 0
  const tokenAddress = decodeURIComponent(router?.id)
  const [isTransactionPending, setTransactionPending] = useState<boolean>(false)

  const harvest = async () => {
    if (!masterchefContract) return

    const provider = new Provider(networkNameToNetwork(network))
    setTransactionPending(true)
    try {
      const response = await signAndSubmitTransaction({
        data: {
          typeArguments: [`${swapContract}::swap::LPToken<${tokenAddress}>`],
          functionArguments: [0],
          function: `${masterchefContract}::masterchef::deposit`,
        },
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
                ? parseFloat(
                    String(
                      formatNumberWithDecimals(reward, decimals as number),
                    ),
                  )
                : 0}{' '}
            </span>
          </CardItem>
        </CardGroup>
      </CardContent>
      <CardFooter>
        {!connected ? (
          <UserProfile />
        ) : (
          <Button fullWidth onClick={harvest} disabled={isTransactionPending}>
            {isTransactionPending ? <Dots>Claiming</Dots> : 'Claim'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
