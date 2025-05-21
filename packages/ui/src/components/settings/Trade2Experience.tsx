import classNames from 'classnames'
import { Label } from '../label'
import { Switch } from '../switch'
import { typographyVariants } from '../typography'

export type TradeViewOptions = 'simple' | 'advanced'

export const Trade2Experience = ({
  toggleTradeView,
  tradeView,
}: {
  tradeView: TradeViewOptions
  toggleTradeView: (view: TradeViewOptions) => void
}) => {
  return (
    <div className={classNames('p-4 rounded-lg')}>
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <Label>Trade 2.0 Experience</Label>
          <span
            className={typographyVariants({
              variant: 'muted',
              className: 'text-sm',
            })}
          >
            Switch to Trade 2.0 for a better trading <br /> experience.
          </span>
        </div>
        <Switch
          checked={tradeView === 'advanced'}
          onCheckedChange={(checked) =>
            toggleTradeView(checked ? 'advanced' : 'simple')
          }
        />
      </div>
    </div>
  )
}
