import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { FC } from 'react'

const MyDeposits: FC = () => {
  const { i18n } = useLingui()
  const { poolWithState } = usePoolContext()

  return (
    <div className="flex flex-col px-5 gap-5 mt-12">
      <Typography variant="h3" className="text-high-emphesis" weight={700}>
        {i18n._(t`My Deposits`)}
      </Typography>
      <ListPanel
        header={<ListPanel.Header title={i18n._(t`Assets`)} value="$16,720.00" subValue="54.32134 SLP" />}
        items={[poolWithState?.pool?.reserve0, poolWithState?.pool?.reserve1].map((amount, index) => (
          <ListPanel.CurrencyAmountItem amount={amount} key={index} />
        ))}
        footer={<ListPanel.Footer title={i18n._(t`Share of Pool`)} value="0.05%" />}
      />
    </div>
  )
}

export default MyDeposits
