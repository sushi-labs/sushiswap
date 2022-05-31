import { useActivePopups } from 'app/state/application/hooks'
import { useURLWarningVisible } from 'app/state/user/hooks'
import { FC } from 'react'

import PopupItem from './PopupItem'

const Popups: FC = () => {
  const activePopups = useActivePopups()
  const urlWarningActive = useURLWarningVisible()

  if (activePopups.length === 0) return <span />

  return (
    <>
      <div
        className={`hidden md:block fixed right-[36px] max-w-[355px] w-full z-30 flex flex-col ${
          urlWarningActive ? 'top-[108px]' : 'top-[88px]'
        }`}
      >
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        {activePopups.map((item) => (
          <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
        ))}
      </div>
      <div className="fixed md:hidden left-4 right-4 top-[88px] fit-content mb-[20px]">
        <div
          className="h-[99%] overflow-x-auto overflow-y-hidden flex flex-col gap-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {activePopups // reverse so new items up front
            .slice(0)
            .reverse()
            // @ts-ignore TYPE NEEDS FIXING
            .map((item) => (
              <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs} />
            ))}
        </div>
      </div>
    </>
  )
}

export default Popups
