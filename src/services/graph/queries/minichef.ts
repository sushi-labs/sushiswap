import gql from 'graphql-tag'

export const miniChefPoolsQuery = gql`
  query miniChefPoolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
    $block: Block_height
    $where: Pool_filter! = { allocPoint_gt: 0 } # $where: Pool_filter! = { allocPoint_gt: 0, accSushiPerShare_gt: 0 }
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, block: $block) {
      id
      pair
      rewarder {
        id
        rewardToken
        rewardPerSecond
      }
      allocPoint
      lastRewardTime
      accSushiPerShare
      slpBalance
      userCount
      miniChef {
        id
        sushiPerSecond
        totalAllocPoint
      }
    }
  }
`

export const miniChefPoolsQueryV2 = gql`
  query miniChefPoolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
    $block: Block_height
    $where: Pool_filter! = { allocPoint_gt: 0 } # $where: Pool_filter! = { allocPoint_gt: 0, accSushiPerShare_gt: 0 }
  ) {
    pools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
      block: $block
      where: $where
    ) {
      id
      pair
      rewarder {
        id
        rewardToken
        rewardPerSecond
        totalAllocPoint
      }
      allocPoint
      lastRewardTime
      accSushiPerShare
      slpBalance
      userCount
      miniChef {
        id
        sushiPerSecond
        totalAllocPoint
      }
    }
  }
`

export const miniChefPairAddressesQuery = gql`
  query miniChefPairAddresses(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
    $where: Pool_filter! = { allocPoint_gt: 0, accSushiPerShare_gt: 0 }
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      allocPoint
      accSushiPerShare
      pair {
        id
      }
    }
  }
`
