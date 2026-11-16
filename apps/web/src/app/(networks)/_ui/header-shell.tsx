'use client'

import { Navigation, classNames } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/sushi-icon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/sushi-with-text-icon'
import type { ReactNode } from 'react'
import { headerElements } from 'src/app/_common/header-elements'
import { SushiNavigationDropdown } from 'src/app/_common/navigation'
import type { ChainId } from 'sushi'

interface HeaderShellProps {
  chainId: ChainId
  rightElement: ReactNode
  includeOnramper?: boolean
  position?: 'fixed' | 'static'
  variant?: 'default' | 'transparent'
}

export function HeaderShell({
  chainId,
  rightElement,
  includeOnramper,
  position = 'fixed',
  variant = 'default',
}: HeaderShellProps) {
  const content = (
    <>
      <div
        className={classNames(
          'hidden lg:flex justify-between items-center px-1 h-14 flex-shrink-0 border-b-[0.5px]',
          variant === 'default' && 'bg-background border-accent',
          variant === 'transparent' && 'border-transparent',
        )}
      >
        <SushiNavigationDropdown className="!px-2">
          <SushiWithTextIcon width={90} />
        </SushiNavigationDropdown>
      </div>
      <div
        className={classNames(
          'flex lg:hidden justify-between items-center pl-4 border-b-[0.5px]',
          variant === 'default' && 'bg-background border-accent',
          variant === 'transparent' && 'border-transparent',
        )}
      >
        <SushiNavigationDropdown>
          <SushiIcon width={24} height={24} />
        </SushiNavigationDropdown>
      </div>
      <Navigation
        className={classNames(
          '!pl-0 lg:!pl-4 !z-[unset]',
          variant === 'transparent' &&
            '!bg-[unset] dark:!bg-[unset] !border-transparent dark:!border-transparent',
        )}
        hideSushiDropdown
        leftElements={headerElements({ chainId, includeOnramper })}
        rightElement={rightElement}
      />
    </>
  )

  if (position === 'static') {
    return <div className="w-full h-[56px] flex">{content}</div>
  }

  return (
    <div className="w-full h-[56px] z-20">
      <div className="fixed w-full flex z-20">{content}</div>
    </div>
  )
}
