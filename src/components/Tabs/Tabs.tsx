import { classNames } from '../../functions'

interface TabsProps {
  tabs: string[]
  currentTab: string
  setTab: Function
}

export default function Tabs({ tabs, currentTab, setTab }: TabsProps): JSX.Element {
  return (
    <>
      <div className="flex flex-row space-x-8 overflow-x-auto overflow-y-hidden whitespace-nowrap" aria-label="Tabs">
        {tabs.map((tab) => (
          <div key={tab} onClick={() => setTab(tab)} className="space-y-2 cursor-pointer h-full">
            <div
              className={classNames(tab === currentTab ? 'text-high-emphesis font-bold' : '', 'text-sm text-secondary')}
            >
              {tab}
            </div>
            <div
              className={classNames(
                tab === currentTab ? 'relative bg-gradient-to-r from-blue to-pink h-[3px] w-full' : ''
              )}
            />
          </div>
        ))}
      </div>
    </>
  )
}
