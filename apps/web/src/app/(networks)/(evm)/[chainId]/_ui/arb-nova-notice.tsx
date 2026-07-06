import { Message, classNames } from '@sushiswap/ui'

export const ArbNovaNotice = ({ className }: { className?: string }) => {
  return (
    <Message className={classNames(className ?? '')}>
      <p className="font-bold">Arbitrum Nova Notice:</p>
      <p>
        The Arbitrum DAO has passed a proposal to move Arbitrum Nova into a
        Minimization Phase. Please withdraw your LP positions from Nova and
        cross-chain swap assets to Arbitrum One before September 2, 2026. After
        this date, Arbitrum Nova will continue running, but shifts to a
        minimized state with reduced SLAs.
      </p>
    </Message>
  )
}
