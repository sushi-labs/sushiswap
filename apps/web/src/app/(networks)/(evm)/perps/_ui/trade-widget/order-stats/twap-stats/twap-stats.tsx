import { StatItem } from '~evm/perps/_ui/_common/stat-item'
import { FeeStat } from '../fee-stat'
import { NumberOfOrdersStat } from './number-of-orders-stat'
import { RuntimeStat } from './runtime-stat'
import { SizePerSuborderStat } from './size-per-suborder-stat'

export const TwapStats = () => {
  return (
    <div className="flex flex-col gap-2">
      <StatItem title="Frequency" value={`30 seconds`} />
      <RuntimeStat />
      <NumberOfOrdersStat />
      <SizePerSuborderStat />
      <FeeStat />
    </div>
  )
}
