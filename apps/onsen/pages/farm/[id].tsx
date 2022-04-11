import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'
import { isKashiPair, isLegacyPair, isTridentPool } from '../../functions'

interface Props {
  farm: Farm
}
interface Farm {
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
}

const FarmPage: FC<Props> = (props) => {
  const { farm } = props
  return (
    <>
      {farm ? (
        <div key={farm.id}>
          {farm.id} {``}
          {farm.token.id} {``}
          {farm.rewardToken.id} {``}
          {new Date(parseInt(farm.endTime) * 1000).toLocaleString()} {``}
          {new Date(parseInt(farm.lastRewardTime) * 1000).toLocaleString()} {``}
          {farm.rewardRemaining} {``}
          {farm.liquidityStaked} {``}
        </div>
      ) : (
        <div>
          <i>No farm found..</i>
        </div>
      )}
    </>
  )
}

export async function getServerSideProps({ query }) {
  const sdk = await getBuiltGraphSDK()
  const farm = await (await sdk.Farm({ id: query.id })).incentive
  let token

  if (isTridentPool(farm.token.name)) {
    console.log('Trident')
  } else if (isLegacyPair(farm.token.name)) {
    console.log('Legacy')
  } else if (isKashiPair(farm.token.name)) {
    console.log('Kashi')
  } else {
    console.log('Single token')
  }
  return {
    props: { farm },
  }
}

export default FarmPage
