import { AddressZero } from '@ethersproject/constants'
import { ChainId } from '@sushiswap/chain'
import { WNATIVE_ADDRESS } from '@sushiswap/currency'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'

const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.GÖRLI,
  ChainId.ARBITRUM,
  ChainId.AVALANCHE,
  ChainId.BSC,
  ChainId.FANTOM,
  ChainId.GNOSIS,
  ChainId.HARMONY,
  ChainId.MOONBEAM,
  ChainId.MOONRIVER,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
]

const isNetworkSupported = (chainId: number) => SUPPORTED_CHAINS.includes(chainId)

export const getRebase = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return []
  const sdk = await getBuiltGraphSDK()

  if (network === ChainId.ETHEREUM) {
    return (
      (await sdk.EthereumBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .ETHEREUM_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.GÖRLI) {
    return (
      (await sdk.GoerliBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .GOERLI_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.ARBITRUM) {
    return (
      (await sdk.ArbitrumBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .ARBITRUM_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.AVALANCHE) {
    return (
      (await sdk.AvalancheBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .AVALANCHE_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.BSC) {
    return (
      (await sdk.BscBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .BSC_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.FANTOM) {
    return (
      (await sdk.FantomBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .FANTOM_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.GNOSIS) {
    return (
      (await sdk.GnosisBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .GNOSIS_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.HARMONY) {
    return (
      (await sdk.HarmonyBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .HARMONY_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.MOONBEAM) {
    return (
      (await sdk.MoonbeamBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .MOONBEAM_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.MOONRIVER) {
    return (
      (await sdk.MoonriverBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .MOONRIVER_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.OPTIMISM) {
    return (
      (await sdk.OptimismBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .OPTIMISM_BENTOBOX_rebase ?? []
    )
  } else if (network === ChainId.POLYGON) {
    return (
      (await sdk.PolygonBentoBoxRebase({ id: id === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : id }))
        .POLYGON_BENTOBOX_rebase ?? []
    )
  }
}

export const getRebases = async (chainId: string | number, tokens: string[]) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return []
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (
      (
        await sdk.EthereumBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).ETHEREUM_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.GÖRLI) {
    return (
      (
        await sdk.GoerliBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).GOERLI_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.ARBITRUM) {
    return (
      (
        await sdk.ArbitrumBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).ARBITRUM_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.AVALANCHE) {
    return (
      (
        await sdk.AvalancheBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).AVALANCHE_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.BSC) {
    return (
      (
        await sdk.BscBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).BSC_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.FANTOM) {
    return (
      (
        await sdk.FantomBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).FANTOM_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.GNOSIS) {
    return (
      (
        await sdk.GnosisBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).GNOSIS_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.HARMONY) {
    return (
      (
        await sdk.HarmonyBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).HARMONY_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.MOONBEAM) {
    return (
      (
        await sdk.MoonbeamBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).MOONBEAM_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.MOONRIVER) {
    return (
      (
        await sdk.MoonriverBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).MOONRIVER_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.OPTIMISM) {
    return (
      (
        await sdk.OptimismBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).OPTIMISM_BENTOBOX_rebases ?? []
    )
  } else if (network === ChainId.POLYGON) {
    return (
      (
        await sdk.PolygonBentoBoxRebases({
          where: {
            token_in: tokens.map((token) => (token === AddressZero ? WNATIVE_ADDRESS[network].toLowerCase() : token)),
          },
        })
      ).POLYGON_BENTOBOX_rebases ?? []
    )
  }
}

export const getStreams = async (chainId: string | number, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumUserStreams({ id })).ETHEREUM_STREAM_user ?? {}
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliUserStreams({ id })).GOERLI_STREAM_user ?? {}
  } else if (network === ChainId.ARBITRUM) {
    return (await sdk.ArbitrumUserStreams({ id })).ARBITRUM_STREAM_user ?? {}
  } else if (network === ChainId.AVALANCHE) {
    return (await sdk.AvalancheUserStreams({ id })).AVALANCHE_STREAM_user ?? {}
  } else if (network === ChainId.BSC) {
    return (await sdk.BscUserStreams({ id })).BSC_STREAM_user ?? {}
  } else if (network === ChainId.FANTOM) {
    return (await sdk.FantomUserStreams({ id })).FANTOM_STREAM_user ?? {}
  } else if (network === ChainId.GNOSIS) {
    return (await sdk.GnosisUserStreams({ id })).GNOSIS_STREAM_user ?? {}
  } else if (network === ChainId.HARMONY) {
    return (await sdk.HarmonyUserStreams({ id })).HARMONY_STREAM_user ?? {}
  } else if (network === ChainId.MOONBEAM) {
    return (await sdk.MoonbeamUserStreams({ id })).MOONBEAM_STREAM_user ?? {}
  } else if (network === ChainId.MOONRIVER) {
    return (await sdk.MoonriverUserStreams({ id })).MOONRIVER_STREAM_user ?? {}
  } else if (network === ChainId.OPTIMISM) {
    return (await sdk.OptimismUserStreams({ id })).OPTIMISM_STREAM_user ?? {}
  } else if (network === ChainId.POLYGON) {
    return (await sdk.PolygonUserStreams({ id })).POLYGON_STREAM_user ?? {}
  }
}

export const getVestings = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumUserVestings({ id })).ETHEREUM_VESTING_user ?? {}
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliUserVestings({ id })).GOERLI_VESTING_user ?? {}
  } else if (network === ChainId.ARBITRUM) {
    return (await sdk.ArbitrumUserVestings({ id })).ARBITRUM_VESTING_user ?? {}
  } else if (network === ChainId.AVALANCHE) {
    return (await sdk.AvalancheUserVestings({ id })).AVALANCHE_VESTING_user ?? {}
  } else if (network === ChainId.BSC) {
    return (await sdk.BscUserVestings({ id })).BSC_VESTING_user ?? {}
  } else if (network === ChainId.FANTOM) {
    return (await sdk.FantomUserVestings({ id })).FANTOM_VESTING_user ?? {}
  } else if (network === ChainId.GNOSIS) {
    return (await sdk.GnosisUserVestings({ id })).GNOSIS_VESTING_user ?? {}
  } else if (network === ChainId.HARMONY) {
    return (await sdk.HarmonyUserVestings({ id })).HARMONY_VESTING_user ?? {}
  } else if (network === ChainId.MOONBEAM) {
    return (await sdk.MoonbeamUserVestings({ id })).MOONBEAM_VESTING_user ?? {}
  } else if (network === ChainId.MOONRIVER) {
    return (await sdk.MoonriverUserVestings({ id })).MOONRIVER_VESTING_user ?? {}
  } else if (network === ChainId.OPTIMISM) {
    return (await sdk.OptimismUserVestings({ id })).OPTIMISM_VESTING_user ?? {}
  } else if (network === ChainId.POLYGON) {
    return (await sdk.PolygonUserVestings({ id })).POLYGON_VESTING_user ?? {}
  }
}

export const getStream = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumStream({ id })).ETHEREUM_STREAM_stream ?? {}
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliStream({ id })).GOERLI_STREAM_stream ?? {}
  } else if (network === ChainId.ARBITRUM) {
    return (await sdk.ArbitrumStream({ id })).ARBITRUM_STREAM_stream ?? {}
  } else if (network === ChainId.AVALANCHE) {
    return (await sdk.AvalancheStream({ id })).AVALANCHE_STREAM_stream ?? {}
  } else if (network === ChainId.BSC) {
    return (await sdk.BscStream({ id })).BSC_STREAM_stream ?? {}
  } else if (network === ChainId.FANTOM) {
    return (await sdk.FantomStream({ id })).FANTOM_STREAM_stream ?? {}
  } else if (network === ChainId.GNOSIS) {
    return (await sdk.GnosisStream({ id })).GNOSIS_STREAM_stream ?? {}
  } else if (network === ChainId.HARMONY) {
    return (await sdk.HarmonyStream({ id })).HARMONY_STREAM_stream ?? {}
  } else if (network === ChainId.MOONBEAM) {
    return (await sdk.MoonbeamStream({ id })).MOONBEAM_STREAM_stream ?? {}
  } else if (network === ChainId.MOONRIVER) {
    return (await sdk.MoonriverStream({ id })).MOONRIVER_STREAM_stream ?? {}
  } else if (network === ChainId.OPTIMISM) {
    return (await sdk.OptimismStream({ id })).OPTIMISM_STREAM_stream ?? {}
  } else if (network === ChainId.POLYGON) {
    return (await sdk.PolygonStream({ id })).POLYGON_STREAM_stream ?? {}
  }
}

export const getStreamTransactions = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return []
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumStreamTransactions({ id })).ETHEREUM_STREAM_transactions ?? []
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliStreamTransactions({ id })).GOERLI_STREAM_transactions ?? []
  } else if (network === ChainId.ARBITRUM) {
    return (await sdk.ArbitrumStreamTransactions({ id })).ARBITRUM_STREAM_transactions ?? []
  } else if (network === ChainId.AVALANCHE) {
    return (await sdk.AvalancheStreamTransactions({ id })).AVALANCHE_STREAM_transactions ?? []
  } else if (network === ChainId.BSC) {
    return (await sdk.BscStreamTransactions({ id })).BSC_STREAM_transactions ?? []
  } else if (network === ChainId.FANTOM) {
    return (await sdk.FantomStreamTransactions({ id })).FANTOM_STREAM_transactions ?? []
  } else if (network === ChainId.GNOSIS) {
    return (await sdk.GnosisStreamTransactions({ id })).GNOSIS_STREAM_transactions ?? []
  } else if (network === ChainId.HARMONY) {
    return (await sdk.HarmonyStreamTransactions({ id })).HARMONY_STREAM_transactions ?? []
  } else if (network === ChainId.MOONBEAM) {
    return (await sdk.MoonbeamStreamTransactions({ id })).MOONBEAM_STREAM_transactions ?? []
  } else if (network === ChainId.MOONRIVER) {
    return (await sdk.MoonriverStreamTransactions({ id })).MOONRIVER_STREAM_transactions ?? []
  } else if (network === ChainId.OPTIMISM) {
    return (await sdk.OptimismStreamTransactions({ id })).OPTIMISM_STREAM_transactions ?? []
  } else if (network === ChainId.POLYGON) {
    return (await sdk.PolygonStreamTransactions({ id })).POLYGON_STREAM_transactions ?? []
  }
}

export const getVesting = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return {}
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumVesting({ id })).ETHEREUM_VESTING_vesting ?? {}
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliVesting({ id })).GOERLI_VESTING_vesting ?? {}
  } else if (network === ChainId.ARBITRUM) {
    return (await sdk.ArbitrumVesting({ id })).ARBITRUM_VESTING_vesting ?? {}
  } else if (network === ChainId.AVALANCHE) {
    return (await sdk.AvalancheVesting({ id })).AVALANCHE_VESTING_vesting ?? {}
  } else if (network === ChainId.BSC) {
    return (await sdk.BscVesting({ id })).BSC_VESTING_vesting ?? {}
  } else if (network === ChainId.FANTOM) {
    return (await sdk.FantomVesting({ id })).FANTOM_VESTING_vesting ?? {}
  } else if (network === ChainId.GNOSIS) {
    return (await sdk.GnosisVesting({ id })).GNOSIS_VESTING_vesting ?? {}
  } else if (network === ChainId.HARMONY) {
    return (await sdk.HarmonyVesting({ id })).HARMONY_VESTING_vesting ?? {}
  } else if (network === ChainId.MOONBEAM) {
    return (await sdk.MoonbeamVesting({ id })).MOONBEAM_VESTING_vesting ?? {}
  } else if (network === ChainId.MOONRIVER) {
    return (await sdk.MoonriverVesting({ id })).MOONRIVER_VESTING_vesting ?? {}
  } else if (network === ChainId.OPTIMISM) {
    return (await sdk.OptimismVesting({ id })).OPTIMISM_VESTING_vesting ?? {}
  } else if (network === ChainId.POLYGON) {
    return (await sdk.PolygonVesting({ id })).POLYGON_VESTING_vesting ?? {}
  }
}

export const getVestingTransactions = async (chainId: string, id: string) => {
  const network = Number(chainId)
  if (!isNetworkSupported(network)) return []
  const sdk = await getBuiltGraphSDK()
  if (network === ChainId.ETHEREUM) {
    return (await sdk.EthereumVestingTransactions({ id })).ETHEREUM_VESTING_transactions ?? []
  } else if (network === ChainId.GÖRLI) {
    return (await sdk.GoerliVestingTransactions({ id })).GOERLI_VESTING_transactions ?? []
  } else if (network === ChainId.ARBITRUM) {
    return (await sdk.ArbitrumVestingTransactions({ id })).ARBITRUM_VESTING_transactions ?? []
  } else if (network === ChainId.AVALANCHE) {
    return (await sdk.AvalancheVestingTransactions({ id })).AVALANCHE_VESTING_transactions ?? []
  } else if (network === ChainId.BSC) {
    return (await sdk.BscVestingTransactions({ id })).BSC_VESTING_transactions ?? []
  } else if (network === ChainId.FANTOM) {
    return (await sdk.FantomVestingTransactions({ id })).FANTOM_VESTING_transactions ?? []
  } else if (network === ChainId.GNOSIS) {
    return (await sdk.GnosisVestingTransactions({ id })).GNOSIS_VESTING_transactions ?? []
  } else if (network === ChainId.HARMONY) {
    return (await sdk.HarmonyVestingTransactions({ id })).HARMONY_VESTING_transactions ?? []
  } else if (network === ChainId.MOONBEAM) {
    return (await sdk.MoonbeamVestingTransactions({ id })).MOONBEAM_VESTING_transactions ?? []
  } else if (network === ChainId.MOONRIVER) {
    return (await sdk.MoonriverVestingTransactions({ id })).MOONRIVER_VESTING_transactions ?? []
  } else if (network === ChainId.OPTIMISM) {
    return (await sdk.OptimismVestingTransactions({ id })).OPTIMISM_VESTING_transactions ?? []
  } else if (network === ChainId.POLYGON) {
    return (await sdk.PolygonVestingTransactions({ id })).POLYGON_VESTING_transactions ?? []
  }
}
