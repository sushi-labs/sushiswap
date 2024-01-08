import {
  MASTERCHEF_ADDRESS,
  useBalancesWeb3,
  useContractReads,
} from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { erc20Abi, masterChefV1Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import {
  Amount,
  SUSHI_ADDRESS,
  Token,
  Type,
  XSUSHI,
  XSUSHI_ADDRESS,
} from 'sushi/currency'
import { Fraction, _1e18 } from 'sushi/math'

const SUSHI_ETH_SLP_ADDRESS = '0x795065dCc9f64b5614C407a6EFDC400DA6221FB0'

export const SUSHI_ETH_SLP = new Token({
  chainId: ChainId.ETHEREUM,
  address: SUSHI_ETH_SLP_ADDRESS,
  decimals: 18,
  symbol: 'SUSHI-ETH SLP',
  name: 'SUSHI-ETH LP Token',
})

const POLYGON_XSUSHI = new Token({
  chainId: ChainId.POLYGON,
  address: XSUSHI_ADDRESS[ChainId.POLYGON],
  decimals: 18,
  symbol: 'XSUSHI (Polygon)',
  name: 'SushiBar',
})

export const useVotingPowerBreakdown = ({
  address,
}: { address: `0x${string}` | undefined }) => {
  const { data: ethereumBalances } = useBalancesWeb3({
    chainId: ChainId.ETHEREUM,
    currencies: [XSUSHI[ChainId.ETHEREUM], SUSHI_ETH_SLP],
    account: address,
    enabled: Boolean(address),
  })

  const { data: polygonBalances } = useBalancesWeb3({
    chainId: ChainId.POLYGON,
    currencies: [POLYGON_XSUSHI],
    account: address,
    enabled: Boolean(address),
  })

  const { data: ethereumData } = useContractReads({
    contracts: useMemo(
      () => [
        // sushi.balanceOf(SUSHI-ETH LP)
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: SUSHI_ADDRESS[ChainId.ETHEREUM],
          functionName: 'balanceOf',
          args: [SUSHI_ETH_SLP_ADDRESS],
        },
        // sushi.balanceOf(XSUSHI)
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: SUSHI_ADDRESS[ChainId.ETHEREUM],
          functionName: 'balanceOf',
          args: [XSUSHI_ADDRESS[ChainId.ETHEREUM]],
        },
        // SUSHI-ETH-LP.totalSupply()
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: SUSHI_ETH_SLP_ADDRESS,
          functionName: 'totalSupply',
        },
        // xsushi.totalSupply()
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
          functionName: 'totalSupply',
        },
        // user's staked SUSHI-ETH LP
        ...(address
          ? [
              {
                chainId: ChainId.ETHEREUM,
                abi: masterChefV1Abi,
                address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
                functionName: 'userInfo',
                args: [12n, address],
              },
            ]
          : []),
      ],
      [address],
    ),
    staleTime: 300000,
  })

  const weights = useMemo(() => {
    if (
      !ethereumData?.length ||
      ethereumData.some((data) => data.status !== 'success')
    )
      return undefined

    const [
      sushiBalanceSLP,
      sushiBalanceXSUSHI,
      slpTotalSupply,
      xsushiTotalSupply,
    ] = ethereumData

    const xsushiWeight = new Fraction(
      sushiBalanceXSUSHI.result as bigint,
      xsushiTotalSupply.result as bigint,
    )

    const slpWeight = new Fraction(
      (sushiBalanceSLP.result as bigint) * 2n,
      slpTotalSupply.result as bigint,
    )

    return {
      xsushi: xsushiWeight,
      slp: slpWeight,
      xsushiPolygon: new Fraction(1, 1),
    }
  }, [ethereumData])

  const balances = useMemo(() => {
    if (!ethereumBalances || !polygonBalances || !ethereumData?.[4]?.result) {
      return undefined
    }

    const userStakedSLP = ethereumData[4].result as [bigint, bigint]

    return {
      xsushi: ethereumBalances[XSUSHI_ADDRESS[ChainId.ETHEREUM]],
      slp: ethereumBalances[SUSHI_ETH_SLP_ADDRESS].add(
        Amount.fromRawAmount(SUSHI_ETH_SLP, userStakedSLP[0]),
      ) as Amount<Type>,
      xsushiPolygon: polygonBalances[XSUSHI_ADDRESS[ChainId.POLYGON]],
    }
  }, [ethereumData, ethereumBalances, polygonBalances])

  return { weights, balances }
}
