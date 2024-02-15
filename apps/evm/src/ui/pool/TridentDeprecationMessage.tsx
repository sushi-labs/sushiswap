import {
  ArrowTopRightOnSquareIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { Message } from '@sushiswap/ui'

export const TridentDeprecationMessage = () => {
  return (
    <Message size="sm" variant="warning" className="mb-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2.5">
        <div className="flex flex-col gap-1 flex-shrink max-w-[1100px]">
          <span className="font-semibold flex items-center gap-1">
            <ExclamationCircleIcon
              width={20}
              height={20}
              className="flex-shrink-0"
            />
            Trident pools will soon be deprecated, please remove your assets
            ASAP.
          </span>
          <span>
            Sushi will soon deprecate support for Trident liquidity pools. If
            you have assets in the Trident Stable and Classic pools, please
            remove them via My Positions tab ASAP. Once deprecated, you could
            only remove assets from Trident pools via the smart contract.
          </span>
        </div>
        {/* TODO */}
        {/* <a
          href={''}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:underline flex gap-2 items-center whitespace-nowrap font-semibold justify-end"
        >
          Learn More
          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
        </a> */}
      </div>
    </Message>
  )
}
