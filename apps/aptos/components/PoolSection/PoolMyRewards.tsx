import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Button, Dots } from '@sushiswap/ui'
import { Provider } from 'aptos'
import WalletSelector from 'components/WalletSelector'
import { createToast } from 'components/toast'
import { providerNetwork } from 'lib/constants'
import { useParams } from 'next/navigation'
import { FC, useState } from 'react'
import { formatNumber } from 'utils/utilFunctions'
interface Props {
  reward: number
  decimals: number | undefined
  isLoading: boolean
}
const MASTERCHEF_CONTRACT =
  process.env['MASTERCHEF_CONTRACT'] ||
  process.env['NEXT_PUBLIC_MASTERCHEF_CONTRACT']
const CONTRACT_ADDRESS =
  process.env['SWAP_CONTRACT'] || process.env['NEXT_PUBLIC_SWAP_CONTRACT']

export const PoolMyRewards: FC<Props> = ({ reward, decimals, isLoading }) => {
  const router = useParams()
  const { connected, signAndSubmitTransaction } = useWallet()
  const tokenAddress = decodeURIComponent(router?.id)
  const [isTransactionPending, setTransactionPending] = useState<boolean>(false)
  const harvest = async () => {
    const provider = new Provider(providerNetwork)
    setTransactionPending(true)
    try {
      const response = await signAndSubmitTransaction({
        type: 'entry_function_payload',
        type_arguments: [`${CONTRACT_ADDRESS}::swap::LPToken<${tokenAddress}>`],
        arguments: [0],
        function: `${MASTERCHEF_CONTRACT}::masterchef::deposit`,
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
          <span className="dark:text-slate-50 text-gray-900">My Rewards</span>
          <div className="flex flex-col">
            <span className="text-sm text-right dark:text-slate-50 text-gray-900">
              {'$0.00'}
            </span>
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
                <span className="text-sm dark:text-slate-300 text-gray-700">
                  {reward
                    ? parseFloat(
                        String(formatNumber(reward, decimals as number)),
                      )
                    : 0}{' '}
                  APT
                </span>
              </div>
              <span className="text-xs dark:text-slate-400 text-slate-600">
                {'$0.00'}
              </span>
            </div>
          )}
        </div>
      </div>
      {!connected ? (
        <WalletSelector color="blue" size="xl" fullWidth={true} />
      ) : (
        <Button
          size="xl"
          fullWidth
          onClick={harvest}
          disabled={isTransactionPending}
        >
          {isTransactionPending ? <Dots>Claiming</Dots> : 'Claim'}
        </Button>
      )}
    </div>
  )
}
