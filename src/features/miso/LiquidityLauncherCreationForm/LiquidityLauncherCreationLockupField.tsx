import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Form from 'app/components/Form'
import ToggleButtonGroup from 'app/components/ToggleButton'
import Typography from 'app/components/Typography'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface LiquidityLauncherCreationLockupFieldProps {}

const LiquidityLauncherCreationLockupField: FC<LiquidityLauncherCreationLockupFieldProps> = ({}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { getValues, setValue } = useFormContext()

  if (!chainId) return <></>

  return (
    <div className="flex flex-col">
      <div>
        <Typography weight={700}>{i18n._(t`Liquidity Lockup Time`)}</Typography>
        <ToggleButtonGroup
          variant="outlined"
          value={getValues('liqLockTime')}
          onChange={(val: string) => setValue('liqLockTime', val, { shouldValidate: true })}
          className="mt-2 !flex"
        >
          <ToggleButtonGroup.Button value={180} activeClassName="border-purple" className="!bg-none px-5 !py-2.5">
            {i18n._(t`${180} days`)}
          </ToggleButtonGroup.Button>
          <ToggleButtonGroup.Button value={90} activeClassName="border-purple" className="!bg-none px-5 !py-2.5">
            {i18n._(t`${90} days`)}
          </ToggleButtonGroup.Button>
        </ToggleButtonGroup>
      </div>
      <div className="flex flex-col flex-grow">
        <Form.TextField
          name="liqLockTime"
          helperText={i18n._(t`Custom amount of days`)}
          placeholder=""
          endIcon={
            <Typography variant="sm" weight={700} className="text-secondary">
              {i18n._(t`Days`)}
            </Typography>
          }
        />
      </div>
    </div>
  )
}

export default LiquidityLauncherCreationLockupField
