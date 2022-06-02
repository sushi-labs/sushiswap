import gql from 'graphql-tag'

export const poolsQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc"
    $block: Block_height # $where: Pool_filter! = { allocPoint_gt: 0, accSushiPerShare_gt: 0 }
  ) {
    pools(first: $first, skip: $skip, orderBy: $orderBy, orderDirection: $orderDirection, block: $block) {
      id
      pair
      allocPoint
      lastRewardBlock
      accSushiPerShare
      balance
      userCount
      owner {
        id
        sushiPerBlock
        totalAllocPoint
      }
    }
  }
`

export const masterChefV1PairAddressesQuery = gql`
  query masterChefV1PairAddresses(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "id"
    $orderDirection: String! = "desc" # $where: Pool_filter! = { allocPoint_gt: 0, accSushiPerShare_gt: 0 }
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

export const masterChefV1TotalAllocPointQuery = gql`
  query masterChefV1TotalAllocPoint($id: String! = "0xc2edad668740f1aa35e4d8f227fb8e17dca888cd") {
    masterChef(id: $id) {
      id
      totalAllocPoint
    }
  }
`

export const masterChefV1SushiPerBlockQuery = gql`
  query masterChefV1SushiPerBlock($id: String! = "0xc2edad668740f1aa35e4d8f227fb8e17dca888cd") {
    masterChef(id: $id) {
      id
      sushiPerBlock
    }
  }
`

export const masterChefV1PoolsQuery = gql`
  query masterChefV1Pools(
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
      balance
      userCount
      owner {
        id
        sushiPerBlock
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

export const masterChefV1PoolHistoriesQuery = gql`
  query masterChefV1PoolHistories(
    $first: Int! = 1000
    $skip: Int! = 0
    $where: PoolHistory_filter!
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    poolHistories(first: $first, skip: $skip, where: $where, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      slpBalance
      userCount
      timestamp
      pool {
        id
        allocPoint
        accSushiPerShare
        pair
        balance
        userCount
        owner {
          id
          sushiPerBlock
          totalAllocPoint
        }
      }
    }
  }
`
