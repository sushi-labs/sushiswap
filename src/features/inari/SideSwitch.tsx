import { Switch } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useAppDispatch } from 'app/state/hooks'
import { setZapIn } from 'app/state/inari/actions'
import { useInariState } from 'app/state/inari/hooks'
import React, { FC } from 'react'

import Typography from '../../components/Typography'

interface SideSwitchProps {}

const SideSwitch: FC<SideSwitchProps> = () => {
  const { i18n } = useLingui()
  const { zapIn } = useInariState()
  const dispatch = useAppDispatch()

  return (
    <Switch.Group>
      <div className="flex items-center">
        <Switch.Label className="mr-3">
          <Typography variant="xs">{i18n._(t`Withdraw`)}</Typography>
        </Switch.Label>
        <Switch
          checked={zapIn}
          onChange={() => dispatch(setZapIn(!zapIn))}
          className="bg-blue bg-opacity-60 border border-blue border-opacity-80 relative inline-flex items-center h-[32px] rounded-full w-[54px] transition-colors focus:outline-none"
        >
          <span
            className={`${
              zapIn ? 'translate-x-[23px]' : 'translate-x-[1px]'
            } inline-block w-7 h-7 transform bg-white rounded-full transition-transform text-blue`}
          >
            {zapIn ? <PlusIcon /> : <MinusIcon />}
          </span>
        </Switch>
        <Switch.Label className="ml-3">
          <Typography variant="xs">{i18n._(t`Deposit`)}</Typography>
        </Switch.Label>
      </div>
    </Switch.Group>
  )
}

export default SideSwitch
