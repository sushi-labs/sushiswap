'use client'

import { classNames } from '@sushiswap/ui'
import type { FC } from 'react'
import { TabCheckIcon } from './TabCheckIcon'

type TabType = 'superior-yields' | 'no-impermanent-loss' | 'mev-proof'

interface TabNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

interface TabItemProps {
  id: TabType
  label: string
  isActive: boolean
  onClick: () => void
}

const TabItem: FC<TabItemProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'flex flex-row items-center justify-center transition-all duration-200 gap-1 rounded-[1000px] px-3 py-2 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05)] dark:shadow-[0px_10px_20px_0px_rgba(0,0,0,0.3)] bg-white dark:bg-gray-800 sm:w-full sm:gap-2.5 sm:bg-transparent sm:p-2 sm:shadow-none sm:dark:bg-transparent md:w-[302px] md:p-3',
        isActive ? 'sm:bg-[#3D657C0A]' : 'opacity-70 hover:opacity-100',
      )}
    >
      <div className="h-3 w-3 sm:h-5 sm:w-5">
        <TabCheckIcon
          className={classNames(
            'h-full w-full',
            isActive ? 'block' : 'block sm:hidden',
          )}
          color={isActive ? '#1AC87F' : '#9CA3AF'}
        />
      </div>
      <span
        className={classNames(
          'whitespace-nowrap leading-none text-xs sm:text-gray-700 sm:text-sm sm:leading-6 sm:dark:bg-none sm:dark:text-gray-300 md:text-base',
          isActive
            ? 'font-semibold text-gray-700 dark:bg-gradient-to-r dark:from-[#B5E8FC] dark:to-[#D7A8E9] dark:bg-clip-text dark:text-transparent'
            : 'font-medium text-gray-700 dark:text-white',
        )}
      >
        {label}
      </span>
    </button>
  )
}

export const TabNavigation: FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'superior-yields' as TabType, label: 'Superior Profit-Based Yields' },
    { id: 'no-impermanent-loss' as TabType, label: 'No Impermanent Loss' },
    { id: 'mev-proof' as TabType, label: 'MEV-Proof' },
  ]

  return (
    <>
      <div className="z-10 flex flex-row flex-wrap items-center justify-center gap-3 sm:hidden">
        {tabs.map((tab) => (
          <TabItem
            key={tab.id}
            id={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>

      <div className="z-10 mx-auto hidden w-full max-w-4xl rounded-[100px] bg-white shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05)] sm:block dark:bg-gray-900 dark:shadow-[0px_10px_20px_0px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col items-center gap-1 p-2 sm:flex-row sm:gap-0">
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
