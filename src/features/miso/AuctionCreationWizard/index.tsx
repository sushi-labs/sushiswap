import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import { Stepper } from 'app/components/Stepper'
import AuctionCreationStep from 'app/features/miso/AuctionCreationWizard/AuctionDetailsStep'
import GeneralDetailsStep from 'app/features/miso/AuctionCreationWizard/GeneralDetailsStep'
import LiquidityLauncherStep from 'app/features/miso/AuctionCreationWizard/LiquidityLauncherStep'
import ReviewDetailsStep from 'app/features/miso/AuctionCreationWizard/ReviewDetailsStep'
import TokenCreationStep from 'app/features/miso/AuctionCreationWizard/TokenCreationStep'
import WhitelistDetailsStep from 'app/features/miso/AuctionCreationWizard/WhitelistDetailsStep'
import React, { FC, useState } from 'react'

import CreateAuctionButtons from './ReviewDetailsStep/CreateAuctionButtons'

const AuctionCreationWizard: FC = () => {
  const { i18n } = useLingui()
  const [step, setStep] = useState<number>(0)

  return (
    <div>
      <Stepper.Root activeStep={step} setActiveStep={setStep}>
        <Stepper.Step>
          <Stepper.Label>{i18n._(t`Token Details*`)}</Stepper.Label>
          <Stepper.Content
            description={
              <Stepper.Description>
                {i18n._(
                  t`If you already have an ERC-20 token, use “Provide Token.”  If you’d like to create one now with MISO, use the “Create Token” tab.`
                )}
              </Stepper.Description>
            }
          >
            <TokenCreationStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    color="blue"
                    disabled={!isValid}
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                    type="submit"
                  >
                    {i18n._(t`Continue`)}
                  </Button>
                </div>
              )}
            </TokenCreationStep>
          </Stepper.Content>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Label>{i18n._(t`General Details*`)}</Stepper.Label>
          <Stepper.Content
            description={
              <Stepper.Description>
                {i18n._(t`Please select the payment currency for your auction, and its start and end dates.`)}
              </Stepper.Description>
            }
          >
            <GeneralDetailsStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    color="blue"
                    disabled={!isValid}
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                    type="submit"
                  >
                    {i18n._(t`Continue`)}
                  </Button>
                  <Button
                    size="sm"
                    color="blue"
                    variant="empty"
                    type="button"
                    onClick={() => setStep((prevStep) => prevStep - 1)}
                  >
                    {i18n._(t`Back`)}
                  </Button>
                </div>
              )}
            </GeneralDetailsStep>
          </Stepper.Content>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Label>{i18n._(t`Auction Details*`)}</Stepper.Label>
          <Stepper.Content
            description={
              <Stepper.Description>
                {i18n._(t`Please select an auction type, and set the price parameters for your auction.`)}
              </Stepper.Description>
            }
          >
            <AuctionCreationStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    color="blue"
                    disabled={!isValid}
                    type="submit"
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                  >
                    {i18n._(t`Continue`)}
                  </Button>
                  <Button
                    size="sm"
                    color="blue"
                    variant="empty"
                    type="button"
                    onClick={() => setStep((prevStep) => prevStep - 1)}
                  >
                    {i18n._(t`Back`)}
                  </Button>
                </div>
              )}
            </AuctionCreationStep>
          </Stepper.Content>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Label>{i18n._(t`Liquidity`)}</Stepper.Label>
          <Stepper.Content
            description={
              <Stepper.Description>
                {i18n._(
                  t`Optional - set aside tokens for creating a constant product pool on Sushi with your token and the auction currency token`
                )}
              </Stepper.Description>
            }
          >
            <LiquidityLauncherStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    color="blue"
                    disabled={!isValid}
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                    type="submit"
                  >
                    {i18n._(t`Continue`)}
                  </Button>
                  <Button
                    size="sm"
                    color="blue"
                    variant="empty"
                    type="button"
                    onClick={() => setStep((prevStep) => prevStep - 1)}
                  >
                    {i18n._(t`Back`)}
                  </Button>
                </div>
              )}
            </LiquidityLauncherStep>
          </Stepper.Content>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Label>{i18n._(t`Whitelist`)}</Stepper.Label>
          <Stepper.Content
            description={
              <Stepper.Description>
                {i18n._(
                  t`Optional - upload a CSV file with approved addresses to only allow participation by certain wallets`
                )}
              </Stepper.Description>
            }
          >
            <WhitelistDetailsStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    color="blue"
                    disabled={!isValid}
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                    type="submit"
                  >
                    {i18n._(t`Continue`)}
                  </Button>
                  <Button
                    size="sm"
                    color="blue"
                    variant="empty"
                    type="button"
                    onClick={() => setStep((prevStep) => prevStep - 1)}
                  >
                    {i18n._(t`Back`)}
                  </Button>
                </div>
              )}
            </WhitelistDetailsStep>
          </Stepper.Content>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Label>{i18n._(t`Review`)}</Stepper.Label>
          <Stepper.Content
            description={
              <Stepper.Description>{i18n._(t`Please review your entered details thoroughly`)}</Stepper.Description>
            }
          >
            <ReviewDetailsStep>
              {(isValid) =>
                isValid ? (
                  <CreateAuctionButtons onBack={() => setStep((prevStep) => prevStep - 1)} />
                ) : (
                  <>
                    <Button size="sm" color="blue" type="button" disabled={true}>
                      {i18n._(t`Approve`)}
                    </Button>
                    <Button size="sm" color="blue" type="button" disabled={true}>
                      {i18n._(t`Create auction`)}
                    </Button>
                    <Button
                      size="sm"
                      color="blue"
                      variant="empty"
                      type="button"
                      onClick={() => setStep((prevStep) => prevStep - 1)}
                    >
                      {i18n._(t`Back`)}
                    </Button>
                  </>
                )
              }
            </ReviewDetailsStep>
          </Stepper.Content>
        </Stepper.Step>
      </Stepper.Root>
    </div>
  )
}

export default AuctionCreationWizard
