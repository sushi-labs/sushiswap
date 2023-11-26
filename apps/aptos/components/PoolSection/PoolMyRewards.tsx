import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Typography } from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { Button } from '@sushiswap/ui/future/components/button'
import { Provider } from 'aptos'
import WalletSelector from 'components/WalletSelector'
import { createToast } from 'components/toast'
import { Aptos } from 'lib/coins'
import { useParams } from 'next/navigation'
import { FC, useState } from 'react'
import { formatNumber } from 'utils/utilFunctions'
import { formatUSD } from '@sushiswap/format'
import useStablePrice from 'utils/useStablePrice'
import { useNetwork } from 'utils/useNetwork'
import { networkNameToNetwork } from 'config/chains'

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
  const aptosPriceInUsd = aptosPrice ? aptosPrice * parseFloat(formatNumber(reward, decimals as number)) : 0
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-900/5 dark:border-slate-200/5">
          <Typography weight={600} className="dark:text-slate-50 text-gray-900">
            My Rewards
          </Typography>
          <div className="flex flex-col">
            <Typography variant="sm" weight={600} className="text-right dark:text-slate-50 text-gray-900">
              {formatUSD(aptosPriceInUsd)}
            </Typography>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-5 py-4">
          {isLoading ? (
            <div className="grid justify-between grid-cols-10 gap-2">
              <div className="h-[20px] bg-slate-700 animate-pulse col-span-8 rounded-full" />
              <div className="h-[20px] bg-slate-700 animate-pulse col-span-2 rounded-full" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://cryptototem.com/wp-content/uploads/2022/08/aptos-logo.jpg"
                  className="rounded-full"
                  height={20}
                  width={20}
                  alt=""
                />
                <Typography variant="sm" weight={600} className="dark:text-slate-300 text-gray-700">
                  {reward ? formatNumber(reward, decimals as number) : 0} APT
                </Typography>
              </div>
              <Typography variant="xs" weight={500} className="dark:text-slate-400 text-slate-600">
                {formatUSD(aptosPriceInUsd)}
              </Typography>
            </div>
          )}
        </div>
      </div>
      {!connected ? (
        <WalletSelector color="blue" size="xl" fullWidth={true} />
      ) : (
        <Button size="xl" fullWidth onClick={harvest} disabled={isTransactionPending}>
          {isTransactionPending ? <Dots>Claiming</Dots> : 'Claim'}
        </Button>
      )}
    </div>
  )
}
