import { RadioGroup } from '@headlessui/react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  FormSection,
  Toggle,
} from '@sushiswap/ui'
import { FC } from 'react'

export enum PoolType {
  MANUAL = 'manual',
  SMART = 'smart',
}

interface SelectV3PoolTypeWidgetProps {
  poolType: PoolType
  setPoolType: (poolType: PoolType) => void
  isSmartPoolSupported: boolean
}

export const SelectV3PoolTypeWidget: FC<SelectV3PoolTypeWidgetProps> = ({
  poolType,
  setPoolType,
  isSmartPoolSupported,
}) => {
  return (
    <FormSection
      title="Deposit Option"
      description={
        <>
          Smart Pool option lets you choose from a variety of different
          strategies; positions will automatically adhere to the chosen
          strategy, rebalancing when necessary.
          <br />
          <br />
          Manual option lets you customize the price range for the position.
        </>
      }
    >
      <RadioGroup
        value={poolType}
        onChange={setPoolType}
        className="grid grid-cols-2 gap-4"
      >
        <RadioGroup.Option
          value={PoolType.SMART}
          disabled={!isSmartPoolSupported}
        >
          {({ checked }) => (
            <Toggle
              pressed={checked}
              asChild
              className="!h-full !w-full !p-0 !text-left !justify-start cursor-pointer dark:data-[state=on]:bg-secondary"
            >
              <Card className={!isSmartPoolSupported ? 'opacity-40' : ''}>
                <CardHeader>
                  <CardTitle>Smart Pool</CardTitle>
                  <CardDescription>Apply automated strategy</CardDescription>
                </CardHeader>
              </Card>
            </Toggle>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={PoolType.MANUAL}>
          {({ checked }) => (
            <Toggle
              pressed={checked}
              asChild
              className="!h-full !w-full !p-0 !text-left !justify-start cursor-pointer dark:data-[state=on]:bg-secondary"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Manual</CardTitle>
                  <CardDescription>Customize price range</CardDescription>
                </CardHeader>
              </Card>
            </Toggle>
          )}
        </RadioGroup.Option>
      </RadioGroup>
    </FormSection>
  )
}
