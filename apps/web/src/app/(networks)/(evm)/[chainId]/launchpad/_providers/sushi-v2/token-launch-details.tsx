import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import type { EvmAddress } from 'sushi/evm'
import { getEvmChainById } from 'sushi/evm'
import { formatRawAmount, formatUsd, shortenAddress } from '../../_lib/format'
import { LaunchDetailsCard } from '../launch-details-card'
import type { LaunchpadTokenFor } from '../provider-types'

const FEE_DISPOSITION_LABELS = {
  DIRECT_PAYOUT: 'Direct payout',
  BURN_LAUNCH_TOKEN_FEES: 'Burn token fees',
  BUYBACK_AND_BURN: 'Buyback & burn',
} as const

function AddressLink({
  address,
  href,
}: {
  address: EvmAddress
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-perps-blue hover:underline"
    >
      {shortenAddress(address, 6)}
    </a>
  )
}

export function SushiV2TokenLaunchDetails({
  token,
}: {
  token: LaunchpadTokenFor<'SUSHI_V2'>
}) {
  const chain = getEvmChainById(token.chainId)

  return (
    <>
      <LaunchDetailsCard
        sections={[
          {
            title: 'Market',
            items: [
              {
                label: 'Supply',
                value: `${formatRawAmount(token.currentSupply, token.decimals, 0)} ${token.symbol}`,
              },
              {
                label: 'Launched',
                value: formatDistanceToNow(new Date(token.poolInitializedAt), {
                  addSuffix: true,
                }),
              },
            ],
          },
          {
            title: 'Liquidity & fees',
            items: [
              {
                label: 'Mode',
                value: token.liquidityMode === 'MOON' ? 'Moon' : 'Standard',
              },
              {
                label: 'Fee mode',
                value: FEE_DISPOSITION_LABELS[token.feeDisposition],
              },
              {
                label: 'Fee split',
                value: `${token.feeSplit.sushiFeeBps / 100}% Sushi · ${token.feeSplit.nonSushiFeeBps / 100}% other`,
              },
            ],
          },
          {
            title: 'Activity',
            items: [
              {
                label: 'Total burned',
                value: `${formatRawAmount(token.burns.totalBurned, token.decimals, 4)} ${token.symbol}`,
              },
              {
                label: 'Developer buy',
                value: token.devBuy
                  ? `${formatRawAmount(token.devBuy.launchTokenReceived, token.decimals, 2)} ${token.symbol}`
                  : 'None',
              },
            ],
          },
        ]}
      />

      <LaunchDetailsCard
        title="Launch roles"
        sections={[
          {
            items: [
              {
                label: 'Launch creator',
                value: (
                  <AddressLink
                    address={token.launchCreator}
                    href={chain.getAccountUrl(token.launchCreator)}
                  />
                ),
              },
              {
                label: 'Current creator',
                value: (
                  <AddressLink
                    address={token.creator}
                    href={chain.getAccountUrl(token.creator)}
                  />
                ),
              },
              {
                label: 'Fee receiver',
                value: (
                  <AddressLink
                    address={token.feeReceiver}
                    href={chain.getAccountUrl(token.feeReceiver)}
                  />
                ),
              },
            ],
          },
        ]}
      />
    </>
  )
}
