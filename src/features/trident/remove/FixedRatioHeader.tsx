import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Checkbox from 'app/components/Checkbox'
import Typography from 'app/components/Typography'
import { selectTridentRemove, setRemoveFixedRatio } from 'app/features/trident/remove/removeSlice'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { useAppDispatch, useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

const FixedRatioHeader: FC<{ margin?: boolean }> = ({ margin = true }) => {
  const isDesktop = useDesktopMediaQuery()
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { fixedRatio } = useAppSelector(selectTridentRemove)

  const content = (
    <div className="flex justify-between gap-1 lg:justify-start">
      <div
        className="flex flex-row items-center gap-3 cursor-pointer"
        onClick={() => dispatch(setRemoveFixedRatio(!fixedRatio))}
      >
        <Checkbox id={`chk-fixed-ratio-withdraw`} className="w-6 h-6" checked={fixedRatio} />
        <Typography variant="sm" weight={700} className={fixedRatio ? 'text-white' : ''}>
          {i18n._(t`Withdraw assets in equal amounts`)}
        </Typography>
      </div>
    </div>
  )

  if (isDesktop) {
    return <div className="pb-1">{content}</div>
  }

  return (
    <div className={margin ? 'top-0 -ml-5 -mr-5 -mt-5 mb-4 pt-5 pb-5 relative' : 'py-5 relative'}>
      <div className="z-[-1] top-0 pointer-events-none absolute w-full h-full border-t border-b border-gradient-r-blue-pink-dark-1000 border-transparent opacity-30">
        <div className="w-full h-full bg-gradient-to-r from-opaque-blue to-opaque-pink" />
      </div>
      <div className="px-5 z-[1]">{content}</div>
    </div>
  )
}

export default FixedRatioHeader
