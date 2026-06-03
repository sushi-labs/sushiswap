import { SwappedIframe } from '@sushiswap/ui'
import { signSwappedData } from 'src/lib/swapped/actions/sign-swapped-data'
import { useAccount } from 'src/lib/wallet'

export const FiatDeposit = () => {
  const address = useAccount('evm')
  return (
    <div className="w-[400px] h-[482px] flex items-center justify-center mx-auto">
      <SwappedIframe
        signSwappedData={signSwappedData}
        address={address}
        defaultCrypto="USDC_HYPE" //https://docs.swapped.com/swapped-ramp/readme/supported-cryptocurrencies
      />
    </div>
  )
}
