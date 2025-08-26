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

export const Rewards = ({ position }: { position: any }) => {
  const amounts = [Amount.fromRawAmount(position.token0, 89000000000n)]
  return (
    <Card>
      <CardHeader className="!p-3 justify-between items-center !flex-row flex gap-2">
        <div>
          <CardTitle className="mb-1">Rewards</CardTitle>
          <CardDescription className="font-medium !text-lg">
            {formatUSD('49123')}
          </CardDescription>
        </div>
        <Button className="w-[128px]">Claim</Button>
      </CardHeader>

      <CardContent className="!p-3">
        <CardGroup>
          <CardCurrencyAmountItem
            isLoading={false}
            amount={amounts[0]}
            fiatValue={formatUSD(1234)}
            amountClassName="!font-medium"
          />
        </CardGroup>
      </CardContent>
    </Card>
  )
}
