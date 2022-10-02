import { CogIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { IconButton, Overlay, SlideIn } from '@sushiswap/ui'
import { useSettings } from 'lib/state/storage'
import { FC, useState } from 'react'

import { CarbonOffsetOverlay } from './CarbonOffsetOverlay'
import { CustomTokensOverlay } from './CustomTokensOverlay'
import { ExpertMode } from './ExpertMode'
import { SlippageToleranceDisclosure } from './SlippageToleranceDisclosure'
import { SushiGuard } from './SushiGuard'

interface SettingsOverlay {
  chainId: ChainId | undefined
}

export const SettingsOverlay: FC<SettingsOverlay> = ({ chainId }) => {
  const [open, setOpen] = useState(false)
  const [{ carbonOffset }] = useSettings()
  return (
    <>
      <div className="flex flex-row gap-4">
        {chainId === ChainId.POLYGON && carbonOffset && (
          <svg width="20" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m10.708 2.45.19.003c.321.007.642.034.953.081a1.083 1.083 0 0 0 1.233-.918 1.09 1.09 0 0 0-.912-1.24 9.993 9.993 0 0 0-1.073-.1l-.15-.004C5.573.151 1.122 4.412 1.001 9.781c-.12 5.369 4.141 9.826 9.505 9.947a9.734 9.734 0 0 0 9.375-6.433 1.087 1.087 0 1 0-2.046-.739 7.567 7.567 0 0 1-7.278 4.991c-4.161-.094-7.47-3.552-7.38-7.717.1-4.1 3.45-7.367 7.53-7.38ZM22.86 3.915c.35-.446.02-1.112-.722-1.138H19.23a8.597 8.597 0 0 0-6.126 2.538 8.653 8.653 0 0 0-1.744 2.48 8.71 8.71 0 0 0-.712 2.401A4.08 4.08 0 0 0 7.67 8.901H5.364c-.431.017-.451.437-.12.799l5.384 5.382c.38.309.742.288 1.072 0L22.86 3.914Zm-10.88 9.182c-.08.082-.22.07-.22-.067v-1.584c0-4.12 3.348-7.472 7.47-7.472h1.403c.22 0 .32.16.18.299-.41.406-2.075 2.067-8.833 8.824Z"
              fill="#fff"
              stroke="#fff"
              strokeWidth=".005"
              strokeMiterlimit="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <IconButton className="hover:animate-spin-slow" onClick={() => setOpen(true)}>
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
                {chainId === ChainId.ETHEREUM && <SushiGuard />}
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
