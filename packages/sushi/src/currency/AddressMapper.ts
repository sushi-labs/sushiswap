export class AddressMapper {
  static generate(
    addressLists: (Record<number, string[]> | Record<number, string>)[],
  ) {
    const result: Record<string, { chainId: number; tokenAddress: string }[]> =
      {}

    for (const addressesByChain of addressLists) {
      Object.entries(addressesByChain).forEach(([chainId, address]) => {
        const sisterAddresses: string[] = Array.isArray(address)
          ? address
          : [address]

        sisterAddresses.forEach((address) => {
          const currentId = `${chainId}:${address.toLowerCase()}`

          Object.entries(addressesByChain).forEach(([chainId, addresses]) => {
            const currentSisterAddresses: string[] = Array.isArray(addresses)
              ? addresses
              : [addresses]

            currentSisterAddresses.forEach((address) => {
              const id = `${chainId}:${address.toLowerCase()}`

              if (currentId !== id) {
                if (!result[currentId]) {
                  result[currentId] = []
                }

                if (
                  !result[currentId]?.some(
                    (item) =>
                      item.chainId === Number(chainId) &&
                      item.tokenAddress === address.toLowerCase(),
                  )
                ) {
                  result[currentId]?.push({
                    chainId: Number(chainId),
                    tokenAddress: address.toLowerCase(),
                  })
                }
              }
            })
          })
        })
      })
    }

    return result
  }

  static merge(...addressLists: Record<number, string>[]) {
    const merged: Record<number, string[]> = {}

    for (const addressList of addressLists) {
      Object.entries(addressList).forEach(([chainId, address]) => {
        if (!merged[Number(chainId)]) {
          merged[Number(chainId)] = [address.toLowerCase()]
        } else {
          merged[Number(chainId)]?.push(address.toLowerCase())
        }
      })
    }

    return merged
  }
}
