import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import BottomSlideIn from 'app/components/Dialog/BottomSlideIn'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Typography from 'app/components/Typography'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import { FC, useState } from 'react'

const FixedRatioExplanationModal: FC = () => {
  const isDesktop = useDesktopMediaQuery()
  const [open, setOpen] = useState(false)
  const { i18n } = useLingui()

  const trigger = (
    <div className="flex items-center justify-center w-6 h-6 rounded cursor-pointer" onClick={() => setOpen(true)}>
      <QuestionMarkCircleIcon className="w-6 h-6 lg:w-4 lg:h-4 text-high-emphesis" />
    </div>
  )

  const content = (
    <div className="flex flex-col gap-4">
      <HeadlessUiModal.Header header={i18n._(t`Fixed ratio`)} onClose={() => setOpen(false)} />
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-3">
        <Typography variant="sm" className="text-high-emphesis">
          {i18n._(
            t`Balanced Mode is an optional UI setting to maintain the traditional style of equal-value adds and removes.`
          )}
        </Typography>
        <Typography variant="sm" weight={400} className="text-high-emphesis">
          {i18n._(t`Previously, adding and removing liquidity had to be done with equal amounts of all assets. With the Trident
            update, this is no longer mandatory.`)}
        </Typography>
      </HeadlessUiModal.BorderedContent>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-2">
        <Typography variant="sm" weight={700} className="text-white">
          {i18n._(t`Why use Balance Mode?`)}
        </Typography>
        <Typography variant="sm" weight={400} className="text-high-emphesis">
          {i18n._(
            t`Lower price impacts. The closer to equilibrium you interact with a pool, the lower price impact there is on your investment.`
          )}
        </Typography>
      </HeadlessUiModal.BorderedContent>
    </div>
  )

  return (
    <>
      {isDesktop ? (
        <HeadlessUiModal trigger={trigger}>{() => content}</HeadlessUiModal>
      ) : (
        <>
          {trigger}
          <BottomSlideIn open={open} onClose={() => setOpen(false)}>
            {content}
          </BottomSlideIn>
        </>
      )}
    </>
  )
}

export default FixedRatioExplanationModal
