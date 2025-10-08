import {
  Button,
  Card,
  CardContent,
  CardCurrencyAmountItem,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
} from '@sushiswap/ui'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { Amount, formatUSD } from 'sushi'

export const Positions = ({
  position,
  hideButtons,
}: { position: any; hideButtons?: boolean }) => {
  const { createQuery } = useCreateQuery()

  const amounts = [
    new Amount(position.token0, 890000000000000000000n),
    new Amount(position.token1, 12344312432n),
  ]
  return (
    <Card className="!bg-slate-50 dark:!bg-slate-800">
      <CardHeader className="!p-3 flex !flex-col justify-between md:items-center md:!flex-row gap-2">
        <div>
          <CardTitle className="mb-1">Positions</CardTitle>
          <CardDescription className="font-medium !text-lg">
            {formatUSD('49123')}
          </CardDescription>
        </div>
        {hideButtons ? null : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                createQuery([
                  {
                    name: 'lpPosTab',
                    value: 'manage',
                  },
                  {
                    name: 'lpManageTab',
                    value: 'add',
                  },
                ])
              }}
              className="w-full md:w-fit"
            >
              Add Liquidity
            </Button>
            <Button
              onClick={() => {
                createQuery([
                  {
                    name: 'lpPosTab',
                    value: 'manage',
                  },
                  {
                    name: 'lpManageTab',
                    value: 'remove',
                  },
                ])
              }}
              className="w-full md:w-fit"
              variant="networks"
            >
              Remove Liquidity
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="!p-3">
        <CardGroup>
          <CardCurrencyAmountItem
            isLoading={false}
            amount={amounts[0]}
            fiatValue={formatUSD(1234)}
            amountClassName="!font-medium"
          />
          <CardCurrencyAmountItem
            isLoading={false}
            amount={amounts[1]}
            fiatValue={formatUSD(4321)}
            amountClassName="!font-medium"
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
