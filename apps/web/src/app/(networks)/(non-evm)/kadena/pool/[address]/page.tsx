'use client'

import { Container } from '@sushiswap/ui'
import { use } from 'react'
import { ChefType, RewarderType } from 'sushi'
import { PoolPageV2 } from '~kadena/_common/ui/Pools/PoolsV2/PoolPageV2'

export default function PoolByIdPage(props: {
  params: Promise<{ address: string }>
}) {
  const params = use(props.params)
  const decodedPoolId = params.address
  const _pairAddress = decodedPoolId[2]

  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <PoolPageV2
        pool={{
          id: '1:0xabcabcabcabcabcabcabcabcabcabcabcabcabca',
          address: '0xabcabcabcabcabcabcabcabcabcabcabcabcabca',
          chainId: 1 as const,
          swapFee: 0.003,
          protocol: 'SUSHISWAP_V2',
          reserve0: BigInt('1000000000000000000000'),
          reserve1: BigInt('500000000000000000000'),
          liquidity: BigInt('1500000000000000000000'),
          liquidityUSD: 1200000,
          volumeUSD: 30000000,
          token0: {
            id: '1:0x1111111111111111111111111111111111111111',
            address: '0x1111111111111111111111111111111111111111',
            decimals: 18,
            name: 'Kadena',
            symbol: 'KDA',
            chainId: 1 as const,
          },
          token1: {
            id: '1:0x2222222222222222222222222222222222222222',
            address: '0x2222222222222222222222222222222222222222',
            decimals: 6,
            name: 'USDC Coin',
            symbol: 'USDC',
            chainId: 1 as const,
          },
          token0Price: 3000,
          token1Price: 1 / 3000,
          txCount1d: 420,
          volumeUSD1d: 200000,
          feesUSD1d: 200000 * 0.3,
          txCount: 50000,
          liquidityUSD1dChange: -1.5,
          volumeUSD1dChange: 2.3,
          feesUSD1dChange: 2.3 * 0.003,
          txCount1dChange: 5,
          feeApr1d: 12.4,
          totalApr1d: 18.7,
          incentiveApr: 6.3,
          isIncentivized: true,
          wasIncentivized: true,
          feesUSD: 30000000 * 0.003,
          name: 'Kadena-USDC',

          incentives: [
            {
              id: '1:0x3333333333333333333333333333333333333333',
              chainId: 1 as const,
              chefType: ChefType.MiniChef,
              apr: 6.3,
              rewardToken: {
                id: '1:0x4444444444444444444444444444444444444444',
                address: '0x4444444444444444444444444444444444444444',
                chainId: 1 as const,
                decimals: 18,
                name: 'SushiToken',
                symbol: 'SUSHI',
              },
              rewardPerDay: 123.45,
              poolAddress: '0xabcabcabcabcabcabcabcabcabcabcabcabcabca',
              pid: 12,
              rewarderAddress: '0x5555555555555555555555555555555555555555',
              rewarderType: RewarderType.Primary,
            },
          ],
        }}
      />
    </Container>
  )
}

//  PoolPageV2.pool: {
//     id: `${string}:0x${string}`;
//     address: Address;
//     chainId: 1 | 137 | 250 | 100 | 56 | 42161 | 42170 | 43114 | 1666600000 | 42220 | 1285 | 122 | 1284 | 10 | 2222 | 1088 | 288 | 56288 | 199 | 11155111 | 1101 | 108 | 314 | 11235 | 1116 | 59144 | 8453 | 534352 | 7000 | 81457 | 2046399126 | 30 | 146 | 43111;
//     ... 26 more ...;
//     incentives: {
//         id: `${string}:0x${string}`;
//         chainId: 1 | 137 | 250 | 100 | 56 | 42161 | 42170 | 43114 | 1666600000 | 42220 | 1285 | 122 | 1284 | 10 | 2222 | 1088 | 288 | 56288 | 199 | 11155111 | 1101 | 108 | 314 | 11235 | 1116 | 59144 | 8453 | 534352 | 7000 | 81457 | 2046399126 | 30 | 146 | 43111;
//         chefType: ChefType;
//         apr: number;
//         rewardToken: {
//             id: `${string}:0x${string}`;
//             address: Address;
//             chainId: 1 | 137 | 250 | 100 | 56 | 42161 | 42170 | 43114 | 1666600000 | 42220 | 1285 | 122 | 1284 | 10 | 2222 | 1088 | 288 | 56288 | 199 | 11155111 | 1101 | 108 | 314 | 11235 | 1116 | 59144 | 8453 | 534352 | 7000 | 81457 | 2046399126 | 30 | 146 | 43111;
//             decimals: number;
//             name: string;
//             symbol: string;
//         };
//         rewardPerDay: number;
//         poolAddress: Address;
//         pid: number;
//         rewarderAddress: Address;
//         rewarderType: RewarderType;
//     }[];
// }
