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
import { formatUSD } from 'sushi'
import { Amount } from 'sushi/currency'

export const Fees = ({ position }: { position: any }) => {
  const amounts = [
    Amount.fromRawAmount(position.token0, 8900000000000000n),
    Amount.fromRawAmount(position.token1, 123432n),
  ]
  return (
    <Card>
      <CardHeader className="!p-3 justify-between items-center !flex-row flex gap-2">
        <div>
          <CardTitle className="mb-1">Fees</CardTitle>
          <CardDescription className="font-medium !text-lg">
            {formatUSD('49123')}
          </CardDescription>
        </div>
        <Button className="w-[128px]">Collect</Button>
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
