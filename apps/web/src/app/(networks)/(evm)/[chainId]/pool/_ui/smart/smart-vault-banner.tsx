import { Button, LinkInternal, Message } from '@sushiswap/ui'
import type { FC } from 'react'
import { getSteerPoolHref } from 'src/lib/steer/utils/get-steer-vault-href'
import type { EvmChainId } from 'sushi/evm'
import type { Hex } from 'viem'

export const SmartVaultBanner: FC<{
  chainId: EvmChainId
  poolAddress: Hex
}> = ({ chainId, poolAddress }) => {
  return (
    <Message
      variant="info"
      size="sm"
      className="mb-4 flex flex-col md:flex-row items-center gap-4 justify-between"
    >
      <p>
        {`This pool has been activated to leverage our liquidity vault feature. Liquidity Vaults are designed to optimize the
        allocation of liquidity within customized price ranges, thereby improving trading efficiency. They achieve
        this by enhancing liquidity depth around the current price, which results in higher fee earnings for liquidity
        providers (LPs) and allows the market to dictate the distribution of LPs' positions based on rational
        decisions.`}
      </p>
      <LinkInternal
        shallow={true}
        href={getSteerPoolHref({ chainId, poolAddress })}
        className="w-full md:w-fit"
      >
        <Button className="w-full md:w-fit">
          Create Liquidity Vault Position
        </Button>
      </LinkInternal>
    </Message>
  )
}
