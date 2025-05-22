// import { ArrowRightIcon } from "@heroicons/react-v1/solid";
import { Currency, LinkExternal } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { ReactNode } from 'react'
import { Native, Token } from 'sushi/currency'
import { formatUSD } from 'sushi/format'

//TODO: add correct props when known
export const CompletedOrderItem = () => {
  return (
    <div className="dark:bg-slate-800 bg-slate-100 sm:bg-slate-50 rounded-xl flex flex-col gap-4 px-5 pt-3 pb-5">
      <div className="flex items-center text-[#6B7280] gap-1 text-xs">
        <div className="flex items-center gap-1">
          <NetworkIcon chainId={1} width={14} height={14} />
          Ethereum Mainnet
        </div>
        {/* <ArrowRightIcon width={12} height={12} className="text-gray-500" />
				<div className="flex items-center gap-1">
					<NetworkIcon chainId={56} width={14} height={14} />
					BNB Smart Chain
				</div> */}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-3">
          <Item title="Bought">
            <Currency.Icon
              currency={Native.onChain(1)}
              width={24}
              height={24}
            />
            0.1 ETH
          </Item>
          <Item title="Type">DCA</Item>
          <Item title="Value/PnL">
            $10 <span className="text-green text-xs">+{formatUSD(0.8)}</span>
          </Item>
          <Item title="Date">02/04/25 3:41 PM</Item>
        </div>
        <div className="flex flex-col gap-3">
          <Item title="Sold">
            <Currency.Icon
              currency={
                new Token({
                  chainId: 1,
                  address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
                  decimals: 18,
                  symbol: 'USDT',
                  name: 'Tether USD',
                })
              }
              width={24}
              height={24}
            />
            150 USDT
          </Item>
          <Item title="Price USD">{formatUSD(2603.98)}</Item>
          <Item title="TX Hash">
            <LinkExternal href="https://etherscan.io/tx/0x6ce092dae13b2bb5de762c04ed400285ccff68a868d1a60f97e95d5bc33c8295">
              {'0x6ce092dae13b2bb5de762c04ed400285ccff68a868d1a60f97e95d5bc33c8295'.slice(
                0,
                6,
              )}
              ...
              {'0x6ce092dae13b2bb5de762c04ed400285ccff68a868d1a60f97e95d5bc33c8295'.slice(
                -4,
              )}
            </LinkExternal>
          </Item>
          <Item title="Status">50% Filled</Item>
        </div>
      </div>
    </div>
  )
}

const Item = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-[#6B7280]">{title}</div>
      <div className="text-black dark:text-white text-sm font-medium flex items-center gap-1">
        {children}
      </div>
    </div>
  )
}
