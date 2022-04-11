
import { FC } from 'react'
import { getBuiltGraphSDK } from '../.graphclient'

interface Props {
  farms: Farm[]
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

const Farms: FC<Props> = (props) => {
  const {farms} = props
  return (
    <div className="px-2 pt-16">
       {farms.length ? (
          Object.values(farms).map((farm) => (
            <div key={farm.id}>
              {farm.id} {``}
              {farm.token.id} {``}
              {farm.rewardToken.id} {``}
              {new Date(parseInt(farm.endTime) * 1000).toLocaleString()} {``}
              {new Date(parseInt(farm.lastRewardTime) * 1000).toLocaleString()} {``}
              {farm.rewardRemaining} {``}
              {farm.liquidityStaked} {``}
            </div>
          ))
        ) : (
          <div>
            <i>No farms found..</i>
          </div>
        )}

      
    </div>
  )
}

export default Farms

export async function getServerSideProps() {
  const sdk = await getBuiltGraphSDK()
  const farms = (await sdk.Farms()).incentives
  return {
    props: {farms: farms},
  }

}
