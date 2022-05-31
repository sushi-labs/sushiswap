import gql from 'graphql-tag'

export const poolsV2Query = gql`
  query poolsV2Query(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      pair
      allocPoint
      slpBalance
      masterChef {
        id
        totalAllocPoint
      }
      rewarder {
        id
        rewardToken
        rewardPerSecond
      }
    }
  }
`

export const masterChefV2PairAddressesQuery = gql`
  query masterChefV2PairAddresses(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      allocPoint
      accSushiPerShare
      pair {
        id
      }
    }
  }
`

export const masterChefV2PoolsQuery = gql`
  query masterChefV2Pools(
    $first: Int! = 1000
    $skip: Int! = 0
    $where: Pool_filter!
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
  ) {
    pools(first: $first, skip: $skip, where: $where, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      allocPoint
      accSushiPerShare
      pair
      slpBalance
      userCount
      masterChef {
        id
        totalAllocPoint
      }
      users(first: 1000, orderBy: "amount", orderDirection: "desc") {
        id
        address
        amount
        block
        rewardDebt
        sushiHarvested
      }
    }
  }
`
