import {
  MASTERCHEF_ADDRESS,
  useBalancesWeb3,
  useContractReads,
} from '@sushiswap/wagmi'
import { useMemo } from 'react'
import { bentoBoxV1Abi, erc20Abi, masterChefV1Abi } from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { BENTOBOX_ADDRESS } from 'sushi/config'
import {
  AXSUSHI,
  AXSUSHI_ADDRESS,
  Amount,
  CRXSUSHI,
  CRXSUSHI_ADDRESS,
  MEOW,
  MEOW_ADDRESS,
  SUSHI_ADDRESS,
  Share,
  TSUSHI,
  TSUSHI_ADDRESS,
  Token,
  Type,
  XSUSHI,
  XSUSHI_ADDRESS,
} from 'sushi/currency'
import { Fraction, _1e18 } from 'sushi/math'

const XSUSHI_CAULDRON_ADDRESS = '0x98a84EfF6e008c5ed0289655CcdCa899bcb6B99F'
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
    currencies: [
      XSUSHI[ChainId.ETHEREUM],
      AXSUSHI[ChainId.ETHEREUM],
      CRXSUSHI[ChainId.ETHEREUM],
      TSUSHI[ChainId.ETHEREUM],
      MEOW[ChainId.ETHEREUM],
      SUSHI_ETH_SLP,
    ],
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
        // BentoBox MEOW shares
        {
          chainId: ChainId.ETHEREUM,
          abi: bentoBoxV1Abi,
          address: BENTOBOX_ADDRESS[ChainId.ETHEREUM],
          functionName: 'balanceOf',
          args: [
            XSUSHI_ADDRESS[ChainId.ETHEREUM],
            MEOW_ADDRESS[ChainId.ETHEREUM],
          ],
        },
        // BentoBox XSUSHI totals
        {
          chainId: ChainId.ETHEREUM,
          abi: bentoBoxV1Abi,
          address: BENTOBOX_ADDRESS[ChainId.ETHEREUM],
          functionName: 'totals',
          args: [XSUSHI_ADDRESS[ChainId.ETHEREUM]],
        },
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

        // xsushi.balanceOf(aXSUSHI)
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
          functionName: 'balanceOf',
          args: [AXSUSHI_ADDRESS[ChainId.ETHEREUM]],
        },

        // xsushi.balanceOf(crXSUSHI)
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
          functionName: 'balanceOf',
          args: [CRXSUSHI_ADDRESS[ChainId.ETHEREUM]],
        },

        // SUSHI-ETH-LP.totalSupply()
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: SUSHI_ETH_SLP_ADDRESS,
          functionName: 'totalSupply',
        },

        // meow.totalSupply()
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: MEOW_ADDRESS[ChainId.ETHEREUM],
          functionName: 'totalSupply',
        },

        // aXSUSHI.totalSupply()
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: AXSUSHI_ADDRESS[ChainId.ETHEREUM],
          functionName: 'totalSupply',
        },

        // crXSUSHI.totalSupply()
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: CRXSUSHI_ADDRESS[ChainId.ETHEREUM],
          functionName: 'totalSupply',
        },

        // xsushi.totalSupply()
        {
          chainId: ChainId.ETHEREUM,
          abi: erc20Abi,
          address: XSUSHI_ADDRESS[ChainId.ETHEREUM],
          functionName: 'totalSupply',
        },
      ],
      [],
    ),
    staleTime: 300000,
  })

  const { data: ethereumUserData } = useContractReads({
    contracts: useMemo(
      () =>
        address
          ? [
              // Abracadabra user XSUSHI Collateral Shares
              {
                chainId: ChainId.ETHEREUM,
                abi: [
                  {
                    inputs: [
                      {
                        internalType: 'address',
                        name: '',
                        type: 'address',
                      },
                    ],
                    name: 'userCollateralShare',
                    outputs: [
                      {
                        internalType: 'uint256',
                        name: '',
                        type: 'uint256',
                      },
                    ],
                    stateMutability: 'view',
                    type: 'function',
                  },
                ],
                address: XSUSHI_CAULDRON_ADDRESS,
                functionName: 'userCollateralShare',
                args: [address],
              },
              // BentoBox user XSUSHI shares
              {
                chainId: ChainId.ETHEREUM,
                abi: bentoBoxV1Abi,
                address: BENTOBOX_ADDRESS[ChainId.ETHEREUM],
                functionName: 'balanceOf',
                args: [XSUSHI_ADDRESS[ChainId.ETHEREUM], address],
              },
              // user's staked SUSHI-ETH LP
              {
                chainId: ChainId.ETHEREUM,
                abi: masterChefV1Abi,
                address: MASTERCHEF_ADDRESS[ChainId.ETHEREUM],
                functionName: 'userInfo',
                args: [12n, address],
              },
            ]
          : undefined,
      [address],
    ),
    enabled: Boolean(address),
    staleTime: 300000,
  })

  const weights = useMemo(() => {
    if (
      ethereumData?.length !== 11 ||
      ethereumData.some((data) => data.status !== 'success')
    )
      return undefined

    const [
      bentoMEOWShares,
      bentoXSUSHITotals,
      sushiBalanceSLP,
      sushiBalanceXSUSHI,
      xsushiBalanceAXSUSHI,
      xsushiBalanceCRXSUSHI,
      slpTotalSupply,
      meowTotalSupply,
      axsushiTotalSupply,
      crxsushiTotalSupply,
      xsushiTotalSupply,
    ] = ethereumData

    const axsushiWeight = new Fraction(
      xsushiBalanceAXSUSHI.result as bigint,
      axsushiTotalSupply.result as bigint,
    )

    const crxsushiWeight = new Fraction(
      xsushiBalanceCRXSUSHI.result as bigint,
      crxsushiTotalSupply.result as bigint,
    ).divide(10n ** 10n)

    const xsushiWeight = new Fraction(
      sushiBalanceXSUSHI.result as bigint,
      xsushiTotalSupply.result as bigint,
    )

    const meowWeight = new Fraction(
      Share.fromRawShare(
        MEOW[ChainId.ETHEREUM],
        bentoMEOWShares.result as bigint,
      ).toAmount({
        elastic: bentoXSUSHITotals.result?.[0] as bigint,
        base: bentoXSUSHITotals.result?.[1] as bigint,
      }).quotient,
      meowTotalSupply.result as bigint,
    )

    const slpWeight = new Fraction(
      (sushiBalanceSLP.result as bigint) * 2n,
      slpTotalSupply.result as bigint,
    )

    return {
      xsushi: xsushiWeight,
      axsushi: axsushiWeight.multiply(xsushiWeight),
      crxsushi: crxsushiWeight.multiply(xsushiWeight),
      tsushi: new Fraction(1, 1),
      meowshi: meowWeight.multiply(xsushiWeight),
      slp: slpWeight,
      xsushiPolygon: new Fraction(1, 1),
    }
  }, [ethereumData])

  const balances = useMemo(() => {
    if (
      !ethereumBalances ||
      !polygonBalances ||
      ethereumUserData?.length !== 3 ||
      ethereumUserData.some((data) => data.status !== 'success') ||
      !ethereumData?.[1]?.result
    ) {
      return undefined
    }

    const [userAbraXSUSHIShares, userBentoXSUSHIShares, userStakedSLP] =
      ethereumUserData

    const bentoXSUSHITotals = ethereumData[1].result

    const abraShare = Share.fromRawShare(
      XSUSHI[ChainId.ETHEREUM],
      userAbraXSUSHIShares.result as bigint,
    )

    const bentoShare = Share.fromRawShare(
      XSUSHI[ChainId.ETHEREUM],
      userBentoXSUSHIShares.result as bigint,
    )

    const bentoXSUSHIBalance = abraShare.add(bentoShare).toAmount({
      elastic: bentoXSUSHITotals[0],
      base: bentoXSUSHITotals[1],
    })

    return {
      xsushi: ethereumBalances[XSUSHI_ADDRESS[ChainId.ETHEREUM]].add(
        bentoXSUSHIBalance,
      ) as Amount<Type>,
      axsushi: ethereumBalances[AXSUSHI_ADDRESS[ChainId.ETHEREUM]],
      crxsushi: ethereumBalances[CRXSUSHI_ADDRESS[ChainId.ETHEREUM]],
      tsushi: ethereumBalances[TSUSHI_ADDRESS[ChainId.ETHEREUM]],
      meowshi: ethereumBalances[MEOW_ADDRESS[ChainId.ETHEREUM]],
      slp: ethereumBalances[SUSHI_ETH_SLP_ADDRESS].add(
        Amount.fromRawAmount(
          SUSHI_ETH_SLP,
          userStakedSLP.result?.[0] as bigint,
        ),
      ) as Amount<Type>,
      xsushiPolygon: polygonBalances[XSUSHI_ADDRESS[ChainId.POLYGON]],
    }
  }, [ethereumUserData, ethereumData, ethereumBalances, polygonBalances])

  return { weights, balances }
}
