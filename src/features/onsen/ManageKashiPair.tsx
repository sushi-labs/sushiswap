import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Settings from 'app/components/Settings'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { useMemo, useState } from 'react'
import { useActiveWeb3React } from 'services/web3'

import { useKashiMediumRiskLendingPair } from '../kashi/hooks'
import KashiDeposit from './KashiDeposit'
import KashiWithdraw from './KashiWithdraw'

// @ts-ignore TYPE NEEDS FIXING
const ManageKashiPair = ({ farm }) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()

  const kashiPair = useKashiMediumRiskLendingPair(account, farm.pair.id)

  const [toggle, setToggle] = useState(true)

  const header = useMemo(
    () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Typography weight={700} className="text-high-emphesis">
            {toggle ? i18n._(t`Deposit`) : i18n._(t`Withdraw`)}
          </Typography>
          <div className="flex gap-4">
            <Switch
              size="sm"
              checked={toggle}
              onChange={() => setToggle(!toggle)}
              checkedIcon={<PlusIcon className="text-dark-1000" />}
              uncheckedIcon={<MinusIcon className="text-dark-1000" />}
            />
            <Settings className="w-[unset] h-[unset]" />
          </div>
        </div>
      </div>
    ),
    [i18n, toggle]
  )

  return kashiPair ? (
    <>
      <div className={classNames(toggle ? 'flex flex-col flex-grow gap-4' : 'hidden')}>
        <KashiDeposit market={kashiPair} header={header} />
      </div>
      <div className={classNames(!toggle ? 'flex flex-col flex-grow gap-4' : 'hidden')}>
        <KashiWithdraw market={kashiPair} header={header} />
      </div>
    </>
  ) : null
}

export default ManageKashiPair
