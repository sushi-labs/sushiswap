import {DismissableMessage, LinkExternal} from '@sushiswap/ui'

export const BobaAvaxAlert = () => {
  return (
    <DismissableMessage
      storageKey="boba-avax-cease-operations-alert"
      variant="warning"
      size="sm"
      className="text-center rounded-none"
      showUntil="2023-10-31T00:00:00.000Z"
    >
      Attention BobaAvax Liquidity Providers on Sushi, kindly withdraw your
      liquidity and move your funds before October 31st, 2023, as BobaAvax will
      no longer be in operation.{' '}
      <LinkExternal href="https://www.sushi.com/blog/important-update-immediate-action-required-for-boba-avax-liquidity-providers-on-sushi">
        Read more
      </LinkExternal>
    </DismissableMessage>
  )
}
