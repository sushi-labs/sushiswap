import {
  CardContent,
  CardGroup,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  classNames,
} from '@sushiswap/ui'
import { MeterIcon } from '@sushiswap/ui/icons/MeterIcon'
import {
  currencyFormatter,
  enUSFormatNumber,
  getTextColorClass,
  useUserAccountValues,
} from 'src/lib/perps'
import { StatItem } from '../_common/stat-item'
import { ValueSensitiveText } from '../_common/value-sensitive-text'
import { SettingsDialog } from './settings-dialog'

export const UnifiedAccountSummary = () => {
  const {
    unrelaizedPnL,
    maintenanceMargin,
    portfolioValue,
    unifiedAccountLeverage,
    unifiedAccountRatio,
  } = useUserAccountValues()
  return (
    <div className="flex flex-col gap-2">
      <hr className="my-0.5 border-t border-accent hidden lg:block" />
      <CardContent className="!p-0 !gap-2">
        <CardGroup className="!gap-1">
          <p className="text-xs font-semibold mb-2 lg:mb-1">
            Unified Account Summary
          </p>
          <StatItem
            title={
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild tabIndex={0}>
                  <div className="text-muted-foreground underline">
                    Unified Account Ratio
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  forceMount
                  side="top"
                  className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                >
                  <p>
                    Represents the risk of portfolio liquidation. When the value
                    is greater than 95%, your portfolio may be liquidated.
                  </p>
                </HoverCardContent>
              </HoverCard>
            }
            value={
              <span
                className={classNames(
                  getTextColorClass(unifiedAccountRatio >= 90 ? 1 : 0),
                  'flex items-center gap-1',
                )}
              >
                <MeterIcon width={18} height={8} />
                {enUSFormatNumber.format(
                  Number(unifiedAccountRatio.toFixed(2)),
                )}
                %
              </span>
            }
          />

          <StatItem
            title="Portfolio Value"
            value={
              <ValueSensitiveText
                value={portfolioValue}
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
            title="Unrealized PnL"
            value={
              <span className={classNames(getTextColorClass(unrelaizedPnL))}>
                {currencyFormatter.format(unrelaizedPnL)}
              </span>
            }
          />

          <StatItem
            title={
              <HoverCard openDelay={0}>
                <HoverCardTrigger asChild tabIndex={0}>
                  <div className="text-muted-foreground underline whitespace-nowrap">
                    Perps Maintenance Margin
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
                  <div className="text-muted-foreground underline">
                    Unified Account Leverage
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  forceMount
                  side="top"
                  className="!px-3 !py-2 max-w-[320px] whitespace-normal text-left text-xs"
                >
                  <p>
                    Unified Account Leverage = Total Cross Positions Value /
                    Total Collateral Balance.
                  </p>
                </HoverCardContent>
              </HoverCard>
            }
            value={`${enUSFormatNumber.format(unifiedAccountLeverage)}x`}
          />
        </CardGroup>
      </CardContent>
      <div className="self-end mt-2">
        <SettingsDialog />
      </div>
    </div>
  )
}
