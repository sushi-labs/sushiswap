import { ExternalLinkIcon } from '@heroicons/react-v1/outline'
import { LinkExternal, Message, classNames } from '@sushiswap/ui'

export const ArbNovaNotice = ({ className }: { className?: string }) => {
  return (
    <Message className={classNames(className ?? '')}>
      <p className="font-bold">Arbitrum Nova Notice:</p>
      <div className="flex flex-col">
        <LinkExternal href="https://snapshot.org/#/s:arbitrumfoundation.eth/proposal/0x002b8264f83d19f88d17dc48a92d1e92638285a6592c491255fa7b14c955da81">
          <div className="text-left underline">
            The Arbitrum DAO has passed a proposal to move Arbitrum Nova into a
            Minimization Phase.
            <ExternalLinkIcon className="w-4 h-4 ml-1 inline-block" />
          </div>
        </LinkExternal>{' '}
        <p>
          Please withdraw your LP positions from Nova and cross-chain swap
          assets to Arbitrum One before September 2, 2026. After this date,
          Arbitrum Nova will continue running, but shifts to a minimized state
          with reduced SLAs.
        </p>
      </div>
    </Message>
  )
}
