export async function getYTokenPrice(amount_in: number = 0, coinX: string, coinY: string) {
  console.log(amount_in, coinX, coinY)
  let outputData
  await fetch(
    `https://fullnode.testnet.aptoslabs.com/v1/accounts/e8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2/resource/0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::TokenPairReserve<${coinX},${coinY}>`
  )
    .then((res) => res.json())
    .then(async (data) => {
      if (data.error_code == 'resource_not_found') {
        await fetch(
          `https://fullnode.testnet.aptoslabs.com/v1/accounts/e8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2/resource/0xe8c9cd6be3b05d3d7d5e09d7f4f0328fe7639b0e41d06e85e3655024ad1a79c2::swap::TokenPairReserve<${coinY},${coinX}>`
        )
          .then((res) => res.json())
          .then((data) => {
            // if (amount_in > 0) {
            if (data.data.reserve_x > 0 && data.data.reserve_x > 0) {
              let amount_in_with_fee = amount_in * 9975
              let numerator = amount_in_with_fee * data.data.reserve_x
              let denominator = data.data.reserve_y * 10000 + amount_in_with_fee
              outputData = numerator / denominator
            } else {
              outputData = 'ERROR_INSUFFICIENT_LIQUIDITY'
              console.log('ERROR_INSUFFICIENT_LIQUIDITY')
              // return data.error_code
            }
            // } else {
            //   outputData = 'ERROR_INSUFFICIENT_INPUT_AMOUNT'
            //   console.log('ERROR_INSUFFICIENT_INPUT_AMOUNT')
            // }
          })
          .catch((err) => {
            outputData = err
            console.log(err)
          })
      } else {
        // if (amount_in > 0) {
        if (data.data.reserve_x > 0 && data.data.reserve_x > 0) {
          let amount_in_with_fee = amount_in * 9975
          let numerator = amount_in_with_fee * data.data.reserve_y
          let denominator = data.data.reserve_x * 10000 + amount_in_with_fee
          outputData = numerator / denominator
        } else {
          outputData = 'ERROR_INSUFFICIENT_LIQUIDITY'
          console.log('ERROR_INSUFFICIENT_LIQUIDITY')
          // return data.error_code
        }
        // } else {
        //   outputData = 'ERROR_INSUFFICIENT_INPUT_AMOUNT'
        //   console.log('ERROR_INSUFFICIENT_INPUT_AMOUNT')
        // }
      }
    })
    .catch((err) => {
      outputData = err
      console.log(err)
    })
  return outputData
}
