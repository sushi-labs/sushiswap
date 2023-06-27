export function helloCLG(name: string) {
  console.log(`hello ${name}`)
}
export async function getYTokenPrice(amount_in: number, coinX: string, coinY: string) {
  console.log(coinX, coinY)
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
            console.log(data)
            if (amount_in > 0) {
              if (data.data.reserve_x > 0 && data.data.reserve_x > 0) {
                let amount_in_with_fee = amount_in * 9975
                let numerator = amount_in_with_fee * data.data.reserve_x
                let denominator = data.data.reserve_y * 10000 + amount_in_with_fee
                console.log(numerator / denominator)
              } else {
                console.log('ERROR_INSUFFICIENT_LIQUIDITY')
              }
            } else {
              console.log('ERROR_INSUFFICIENT_INPUT_AMOUNT')
            }
          })
      } else {
        console.log(data)
        if (amount_in > 0) {
          if (data.data.reserve_x > 0 && data.data.reserve_x > 0) {
            let amount_in_with_fee = amount_in * 9975
            let numerator = amount_in_with_fee * data.data.reserve_y
            let denominator = data.data.reserve_x * 10000 + amount_in_with_fee
            console.log(numerator / denominator)
          } else {
            console.log('ERROR_INSUFFICIENT_LIQUIDITY')
          }
        } else {
          console.log('ERROR_INSUFFICIENT_INPUT_AMOUNT')
        }
      }
    })
}
