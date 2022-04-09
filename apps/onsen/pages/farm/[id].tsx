import { FC } from 'react'
import { getBuiltGraphSDK } from '../../.graphclient'

interface Props {
  farm: Farm
}
interface Farm {
  id: string
  token: {
    id: string
  }
  rewardToken: {
    id: string
  }
  endTime: string
  lastRewardTime: string
  rewardRemaining: string
  liquidityStaked: string
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
  const farm = await (await sdk.Farm({id: query.id})).incentive
  return {
    props: { farm },
  }
}

export default FarmPage
