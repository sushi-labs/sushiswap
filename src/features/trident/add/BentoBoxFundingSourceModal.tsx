import { QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BentoboxIcon, WalletIcon } from 'app/components/Icon'
import Image from 'app/components/Image'
import HeadlessUiModal from 'app/components/Modal/HeadlessUIModal'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { FC, useState } from 'react'

const BentoBoxFundingSourceModal: FC = () => {
  const { i18n } = useLingui()
  const [walletSelected, setWalletSelected] = useState(false)

  return (
    <HeadlessUiModal
      trigger={
        <div className="flex items-center justify-center rounded cursor-pointer lg:w-4 lg:h-4">
          <QuestionMarkCircleIcon className="w-4 h-4 text-high-emphesis" />
        </div>
      }
    >
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      {({ setOpen }) => (
        <div className="flex flex-col gap-4">
          <HeadlessUiModal.Header header={i18n._(t`Bentobox`)} onClose={() => setOpen(false)} />
          <div className="flex justify-center gap-4">
            <div className="relative shadow-pink-glow">
              <Image
                src="https://app.sushi.com/images/bentobox/logo.png"
                width={160}
                height={120}
                alt="BentoBox Logo"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Typography variant="lg" weight={700} className="text-center text-high-emphesis">
                {i18n._(t`Sushi utilizes a token vault called BentoBox that has balances separate from your wallet.`)}
              </Typography>
              <Typography variant="sm" className="text-center text-secondary">
                {i18n._(t`You can think of this as having "account balances" for each asset within sushi.com`)}
              </Typography>
            </div>
          </div>
          <HeadlessUiModal.BorderedContent className="flex flex-col">
            <div className="grid grid-cols-2 gap-10 flex-grow min-h-[160px]">
              <div className="flex flex-col justify-center gap-3">
                <div className="flex justify-center gap-4">
                  <div
                    className={classNames(
                      'flex flex-col gap-1',
                      walletSelected ? 'text-low-emphesis' : 'text-high-emphesis'
                    )}
                  >
                    <BentoboxIcon width={48} />
                    <Typography variant="xs" className="text-secondary">
                      {i18n._(t`Bentobox`)}
                    </Typography>
                  </div>
                  <div
                    className={classNames(
                      'flex flex-col gap-1',
                      walletSelected ? 'text-high-emphesis' : 'text-low-emphesis'
                    )}
                  >
                    <WalletIcon width={48} />
                    <Typography variant="xs" className="text-secondary">
                      {i18n._(t`Wallet`)}
                    </Typography>
                  </div>
                </div>
                <Typography weight={700} variant="sm" className="text-center text-high-emphesis">
                  {i18n._(t`You’ll see these icons next to your balance in various input fields.`)}
                </Typography>
              </div>
              <div
                className="h-full bg-right bg-no-repeat bg-contain"
                style={{ backgroundImage: `url('/images/trident/AssetInputScreenshot.png')` }}
              />
            </div>
            <div className="flex flex-col flex-grow min-h-[160px]">
              <div className="grid flex-grow grid-cols-2">
                <div
                  className="h-full bg-no-repeat bg-contain"
                  style={{ backgroundImage: `url('/images/trident/AssetInputScreenshot2.png')` }}
                />
                <div className="flex flex-col items-center justify-center gap-2 p-3 px-8">
                  <Switch checked={walletSelected} onChange={setWalletSelected} />
                  <Typography weight={700} variant="sm" className="text-center text-high-emphesis">
                    {i18n._(t`Use the toggle to switch between balances when interacting with our platform.`)}
                  </Typography>
                </div>
              </div>
            </div>
            <Typography variant="xs" className="px-10 mt-5 text-center text-low-emphesis">
              <Typography variant="xs" weight={700} component="span">
                Tip
              </Typography>
              : {i18n._(t`BentoBox to BentoBox swaps are up to 50% cheaper than normal swaps`)}
            </Typography>
          </HeadlessUiModal.BorderedContent>
        </div>
      )}
    </HeadlessUiModal>
  )
}

export default BentoBoxFundingSourceModal
