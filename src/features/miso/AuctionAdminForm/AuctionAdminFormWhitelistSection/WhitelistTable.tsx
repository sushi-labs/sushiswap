import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { NATIVE } from '@sushiswap/core-sdk'
import CloseIcon from 'app/components/CloseIcon'
import Typography from 'app/components/Typography'
import { useStore } from 'app/features/miso/context/store'
import { WhitelistEntry } from 'app/features/miso/context/types'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface WhitelistTableProps {
  entries: WhitelistEntry[]
}

const WhitelistTable: FC<WhitelistTableProps> = ({ entries }) => {
  const { i18n } = useLingui()
  const { setValue } = useFormContext()
  const { chainId } = useActiveWeb3React()
  const paymentCurrencyAddress = useStore((state) => state.paymentCurrencyAddress)
  const paymentToken = useToken(paymentCurrencyAddress) ?? NATIVE[chainId || 1]

  return (
    <div className="col-span-6 md:col-span-3 pt-8">
      <div className="flex justify-between items-center">
        <Typography weight={700}>{i18n._(t`Addresses`)}</Typography>
        <CloseIcon
          width={24}
          height={24}
          className="cursor-pointer hover:text-high-emphesis"
          onClick={() => setValue('whitelistAddresses', [], { shouldValidate: true })}
        />
      </div>
      <div className="mt-2 px-4 divide-y divide-dark-800 border border-dark-800 rounded bg-dark-1000/40 overflow-hidden shadow-md shadow-dark-1000">
        <div className="py-3 grid grid-cols-3 items-center">
          <Typography variant="sm" weight={700} className="text-high-emphesis" />
          <Typography variant="xs" weight={700} className="text-high-emphesis uppercase">
            {i18n._(t`Account`)}
          </Typography>
          <Typography variant="xs" weight={700} className="text-right text-high-emphesis uppercase">
            {i18n._(t`Amount`)}
          </Typography>
        </div>
        <div className="max-h-[200px] overflow-auto divide-y divide-dark-900">
          {entries.map(({ account, amount }, index) => (
            <div className="grid grid-cols-3 py-2 items-center overflow-hidden" key={index}>
              <Typography variant="sm">{index + 1}</Typography>
              <Typography variant="xs" className="truncate">
                {account}
              </Typography>
              <Typography variant="xs" className="text-right">
                {amount} {paymentToken?.symbol}
              </Typography>
            </div>
          ))}
        </div>
        <div className="py-2 grid grid-cols-3 items-center">
          <Typography variant="sm" weight={700} className="text-white">
            {entries.length}
          </Typography>
          <Typography variant="sm" weight={700} className="text-secondary" />
          <Typography variant="sm" weight={700} className="text-right text-white">
            + {entries.reduce((acc, cur) => acc + Number(cur.amount), 0)} {paymentToken?.symbol}
          </Typography>
        </div>
      </div>
      <p className="mt-2 text-sm text-yellow">
        {i18n._(
          t`There is currently no way of retrieving the list of addresses in the point list. This means you won't be able to see the list of set addresses after you refresh this page.`
        )}
      </p>
    </div>
  )
}

export default WhitelistTable
