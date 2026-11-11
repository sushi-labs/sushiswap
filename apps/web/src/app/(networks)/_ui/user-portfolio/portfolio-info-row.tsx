import { Badge } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import Link from 'next/link'
import type { FC, ReactElement } from 'react'
import type { ChainId } from 'sushi'

interface PortfolioInfoRow {
  chainId: ChainId
  icon: ReactElement<any>
  leftContent: ReactElement<any>
  rightContent: ReactElement<any> | null
  href?: string
  externalLink?: boolean
  onClick?: () => void
}

export const PortfolioInfoRow: FC<PortfolioInfoRow> = (params) => {
  const { href, externalLink = false } = params

  return href ? (
    <Link href={href} target={externalLink ? '_blank' : '_self'}>
      <_PortfolioInfoRow {...params} />
    </Link>
  ) : (
    <_PortfolioInfoRow {...params} />
  )
}

const _PortfolioInfoRow: FC<PortfolioInfoRow> = ({
  chainId,
  icon,
  leftContent,
  rightContent,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick}
      className="group/portfolio-row flex w-full items-center hover:bg-muted px-7 py-2 gap-x-6 whitespace-nowrap"
    >
      <div className="shrink-0">
        <Badge
          className="!-right-1 !-bottom-1 border-2 border-background bg-background rounded-full z-[11]"
          position="bottom-right"
          badgeContent={
            <NetworkIcon chainId={chainId} width={16} height={16} />
          }
        >
          {icon}
        </Badge>
      </div>
      <div className="flex min-w-0 flex-1 justify-between items-center gap-x-3">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {leftContent}
        </div>
        <div className="shrink-0 flex flex-col text-right tabular-nums">
          {rightContent}
        </div>
      </div>
    </div>
  )
}
