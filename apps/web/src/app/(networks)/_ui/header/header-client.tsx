'use client'

import { Navigation, SushiNavigationDropdown, classNames } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
import type React from 'react'
import type { FC } from 'react'
import { headerElements } from 'src/app/_common/header-elements'
import type { ChainId } from 'sushi'

interface HeaderProps {
  chainId?: ChainId
  rightElement?: React.ReactNode
  theme?: 'default' | 'transparent'
}

export const HeaderClient: FC<HeaderProps> = ({
  chainId,
  rightElement,
  theme = 'default',
}) => {
  return (
    <div className="w-full h-[56px] z-20">
      <div className="fixed w-full flex z-20">
        <div
          className={classNames(
            'hidden lg:flex justify-between items-center px-1 h-14 flex-shrink-0 border-b',
            theme === 'default' &&
              'bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800',
            theme === 'transparent' && 'border-transparent',
          )}
        >
          <SushiNavigationDropdown className="!px-2">
            <SushiWithTextIcon width={90} />
          </SushiNavigationDropdown>
        </div>
        <div
          className={classNames(
            'flex lg:hidden justify-between items-center pl-4 border-b',
            theme === 'default' &&
              'bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800',
            theme === 'transparent' && 'border-transparent',
          )}
        >
          <SushiNavigationDropdown>
            <SushiIcon width={24} height={24} />
          </SushiNavigationDropdown>
        </div>
        <Navigation
          className={classNames(
            '!pl-0 lg:!pl-4 !z-[unset]',
            theme === 'transparent' &&
              '!bg-[unset] dark:!bg-[unset] !border-transparent dark:!border-transparent',
          )}
          hideSushiDropdown
          leftElements={headerElements({ chainId })}
          rightElement={rightElement}
        />
      </div>
    </div>
  )
}
