import { CogIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { classNames, IconButton, Overlay, SlideIn } from '@sushiswap/ui'
import { useSettings } from 'lib/state/storage'
import { FC, useState } from 'react'

import { CarbonOffsetOverlay } from './CarbonOffsetOverlay'
import { CustomTokensOverlay } from './CustomTokensOverlay'
import { ExpertMode } from './ExpertMode'
import { SlippageToleranceDisclosure } from './SlippageToleranceDisclosure'

interface SettingsOverlay {
  chainId: ChainId | undefined
}

export const SettingsOverlay: FC<SettingsOverlay> = ({ chainId }) => {
  const [open, setOpen] = useState(false)
  const [{ carbonOffset, sushiGuard }, { updateCarbonOffset, updateSushiGuard }] = useSettings()
  return (
    <>
      <div className="grid grid-flow-col gap-4">
        {/* {chainId === ChainId.ETHEREUM && (
          <IconButton
            className={classNames(
              'hover:animate-pulse min-w-5 min-h-5 flex items-center',
              sushiGuard && 'text-green-400'
            )}
            onClick={() => updateSushiGuard(!sushiGuard)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m10 18.75-3.86-2.058a6.865 6.865 0 0 1-3.64-6.067V2.5a1.251 1.251 0 0 1 1.25-1.25h12.5A1.251 1.251 0 0 1 17.5 2.5v8.125a6.864 6.864 0 0 1-3.64 6.067L10 18.75ZM3.75 2.5v8.125a5.616 5.616 0 0 0 2.979 4.964L10 17.333l3.271-1.744a5.616 5.616 0 0 0 2.979-4.964V2.5H3.75Z"
                fill="currentColor"
              />
              <path d="M10 15.798V3.75h5v6.753a4.375 4.375 0 0 1-2.313 3.858L10 15.798Z" fill="currentColor" />
            </svg>
          </IconButton>
        )} */}
        {chainId === ChainId.POLYGON && (
          <IconButton
            className={classNames(
              'hover:animate-pulse min-w-5 min-h-5 flex items-center',
              carbonOffset && 'text-green-400'
            )}
            onClick={() => updateCarbonOffset(!carbonOffset)}
          >
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m8.808 2.145.172.002c.29.007.58.03.86.073a.978.978 0 0 0 1.113-.828.984.984 0 0 0-.824-1.12 9.234 9.234 0 0 0-.968-.09L9.025.18a8.783 8.783 0 0 0-.398 17.56 8.785 8.785 0 0 0 8.462-5.805.981.981 0 1 0-1.846-.667 6.83 6.83 0 0 1-6.57 4.505 6.824 6.824 0 0 1-6.661-6.966 6.826 6.826 0 0 1 6.796-6.66Zm10.968 1.32c.317-.401.018-1.003-.651-1.026H16.5a7.76 7.76 0 0 0-5.53 2.291 7.81 7.81 0 0 0-1.574 2.238 7.862 7.862 0 0 0-.642 2.167 3.683 3.683 0 0 0-2.688-1.168H3.985c-.39.015-.408.395-.109.721l4.86 4.858c.344.279.67.26.968 0l10.072-10.08Zm-9.819 8.29c-.072.074-.199.063-.199-.06v-1.43A6.75 6.75 0 0 1 16.5 3.52h1.267c.2 0 .29.144.163.27-.37.366-1.873 1.866-7.973 7.964Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth=".005"
                strokeMiterlimit="2"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
        )}
        <IconButton className="flex items-center hover:animate-spin-slow min-w-5 min-h-5" onClick={() => setOpen(true)}>
          <CogIcon width={20} height={20} />
        </IconButton>
      </div>
      <SlideIn>
        <SlideIn.FromLeft show={open} onClose={() => setOpen(false)}>
          <Overlay.Content className="!bg-slate-800 !pb-0">
            <div className="h-full px-3 -ml-3 -mr-3 overflow-x-hidden overflow-y-auto scroll">
              <Overlay.Header onClose={() => setOpen(false)} title="Settings" />
              <div className="px-1 py-1">
                {/*<GasSettingsDisclosure chainId={chainId} />*/}
                <SlippageToleranceDisclosure />
                <CustomTokensOverlay />
                <ExpertMode />
                {/* {chainId === ChainId.ETHEREUM && <SushiGuard />} */}
                {chainId === ChainId.POLYGON && <CarbonOffsetOverlay />}

                {/* <DustAmount /> */}
              </div>
            </div>
          </Overlay.Content>
        </SlideIn.FromLeft>
      </SlideIn>
    </>
  )
}
