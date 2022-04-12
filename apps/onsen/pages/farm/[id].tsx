import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'
import { isKashiPair, isLegacyPair, isTridentPool } from '../../functions'

interface Props {
  incentive: Incentive
  tridentFarm: TridentPool
}

interface Incentive {
  id: string
  token: Token
  rewardToken: Token
  endTime: string
  lastRewardTime: string
  rewardRemaining: string
  liquidityStaked: string
}

interface Token {
  id: string
  name: string
  symbol: string
}

interface TridentPool {
  id: string
  assets: {
    token: Token
  }
  kpi: {
    volume: string
    volumeUSD: string
  }
}

const FarmPage: FC<Props> = (props) => {
  const { incentive, tridentFarm } = props
  console.log(props)
  const trident = (pool: TridentPool) => {
    return (
      <div key={pool.id}>
        <div>
          {' '}
          Pool: {pool.assets[0].token.symbol}
          {`/`}
          {pool.assets[1].token.symbol}
        </div>
        <div> Volume: {pool.kpi.volume}</div>
        <div> Volume USD: {pool.kpi.volumeUSD}</div>
      </div>
    )
  }

  return (
    <>
    <h1>Farm</h1>
      {tridentFarm ? (
        trident(tridentFarm)
      ) : (
        <div>
          <i>No Farm found..</i>
        </div>
      )}

    <h2>Reward</h2>
      {incentive ? (
        <div key={incentive.id}>
          {incentive.id} {``}
          {incentive.token.name} {``}
          {incentive.rewardToken.name} {``}
          {new Date(parseInt(incentive.endTime) * 1000).toLocaleString()} {``}
          {new Date(parseInt(incentive.lastRewardTime) * 1000).toLocaleString()} {``}
          {incentive.rewardRemaining} {``}
          {incentive.liquidityStaked} {``}
        </div>
      ) : (
        <div>
          <i>No Incentive found..</i>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const incentive = await (await sdk.Incentive({ id: query.id })).incentive
  let tridentFarm
  let legacyFarm
  let kashiFarm
  let singleTokenFarm

  if (isTridentPool(incentive.token.name)) {
    tridentFarm = await (await sdk.Pool({ id: incentive.token.id })).pool
  } else if (isLegacyPair(incentive.token.name)) {
    console.log('Legacy')
  } else if (isKashiPair(incentive.token.name)) {
    console.log('Kashi')
  } else {
    console.log('Single token')
  }
  return {
    props: { incentive, tridentFarm },
  }
}

export default FarmPage
