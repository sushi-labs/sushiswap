import {
  CardContent,
  CardGroup,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import {
  currencyFormatter,
  getTextColorClass,
  perpsNumberFormatter,
  useUserAccountValues,
} from 'src/lib/perps'
import { StatItem, ValueSensitiveText } from '../_common'
import { SettingsDialog } from './settings-dialog'
import { useUserSettingsState } from './settings-provider'

export const AccountSummary = () => {
  const {
    spotEquity,
    unrelaizedPnL,
    perpsEquity,
    perpsBalance,
    maintenanceMargin,
    totalCrossMarginRatio,
    crossAccountLeverage,
  } = useUserAccountValues()
  const {
    state: { hidePnl },
  } = useUserSettingsState()
  return (
    <div className="flex flex-col gap-2">
      <hr className="my-0.5 border-t border-accent hidden lg:block" />
      <CardContent className="!p-0 !gap-2">
        <CardGroup className="!gap-1">
          <p className="text-xs font-semibold mb-2 lg:mb-1">Account Equity</p>
          <StatItem
            title="Spot"
            value={
              <ValueSensitiveText
                value={spotEquity}
                formatOptions={{
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }}
              />
            }
          />
          <StatItem
            title={
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild tabIndex={0}>
                  <div className="text-[#6A7282] underline">Perps</div>
                </HoverCardTrigger>
                <HoverCardContent
                  forceMount
                  side="top"
                  className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                >
                  <p>
                    Balance + Unrealized PNL (approximate account value if all
                    positions were closed).
                  </p>
                </HoverCardContent>
              </HoverCard>
            }
            value={
              <ValueSensitiveText
                value={perpsEquity}
                formatOptions={{
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                }}
              />
            }
          />
        </CardGroup>
        <hr className="border-t border-accent block lg:hidden" />
        <CardGroup className="!gap-1">
          <p className="text-xs font-semibold mb-2 lg:mb-1">Perps Overview</p>
          <StatItem
            title={
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild tabIndex={0}>
                  <div className="text-[#6A7282] underline">Balance</div>
                </HoverCardTrigger>
                <HoverCardContent
                  forceMount
                  side="top"
                  className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                >
                  <p>
                    Total Net Transfers + Total Realized Profit + Total Net
                    Funding Fees.
                  </p>
                </HoverCardContent>
              </HoverCard>
            }
            value={currencyFormatter.format(perpsBalance)}
          />
          <StatItem
            title="Unrealized PnL"
            value={
              <span
                className={classNames(
                  hidePnl ? '' : getTextColorClass(unrelaizedPnL),
                )}
              >
                {hidePnl
                  ? '***'
                  : perpsNumberFormatter({
                      value: unrelaizedPnL,
                      maxFraxDigits: 2,
                      minFraxDigits: 2,
                    })}
              </span>
            }
          />
          <StatItem
            title={
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild tabIndex={0}>
                  <div className="text-[#6A7282] underline">
                    Cross Margin Ratio
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  forceMount
                  side="top"
                  className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                >
                  <p>
                    Maintenance Margin / Portfolio Value. Your cross positions
                    will be liquidated if Margin Ratio reaches 100%.
                  </p>
                </HoverCardContent>
              </HoverCard>
            }
            value={
              <span
                className={classNames(
                  totalCrossMarginRatio === 0
                    ? ''
                    : getTextColorClass(totalCrossMarginRatio),
                )}
              >
                {perpsNumberFormatter({
                  value: totalCrossMarginRatio,
                  maxFraxDigits: 2,
                  minFraxDigits: 2,
                })}
                %
              </span>
            }
          />
          <StatItem
            title={
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild tabIndex={0}>
                  <div className="text-[#6A7282] underline">
                    Maintenance Margin
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  forceMount
                  side="top"
                  className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                >
                  <p>
                    The minimum portfolio value required to keep your cross
                    positions open.
                  </p>
                </HoverCardContent>
              </HoverCard>
            }
            value={currencyFormatter.format(maintenanceMargin)}
          />
          <StatItem
            title={
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild tabIndex={0}>
                  <div className="text-[#6A7282] underline">
                    Cross Account Leverage
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  forceMount
                  side="top"
                  className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                >
                  <p>
                    Cross Account Leverage = Total Cross Positions Value / Cross
                    Account Value.
                  </p>
                </HoverCardContent>
              </HoverCard>
            }
            value={`${perpsNumberFormatter({
              value: crossAccountLeverage,
              maxFraxDigits: 2,
              minFraxDigits: 2,
            })}x`}
          />
        </CardGroup>
      </CardContent>
      <div className="self-end mt-2">
        <SettingsDialog />
      </div>
    </div>
  )
}
