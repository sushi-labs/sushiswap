import gql from 'graphql-tag'

export const misoCommitmentsQuery = gql`
  query misoCommitmentsQuery($where: Commitment_filter!) {
    commitments(where: $where) {
      id
      user {
        id
      }
      amount
      block
      transactionHash
    }
  }
`
