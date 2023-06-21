

export class AddressMapper {

    // constructor(...addressLists: Record<number, string>[]) {
    //     this.initialize(addressLists)
    // }

    //  static generate(...addressLists: Record<number, string>[] | Record<number, string[]>[]) {
    //     const addresses: Record<string, Record<number, string[]>> = {}
    //     for (const addressList of addressLists) {
            
    //         Object.entries(addressList).forEach(([chainId, address]) => {
    //             const id = `${chainId}:${address.toLowerCase()}`
    //             if (!addresses[id]) {
    //                 addresses[id] = {}
    //             }
    //             for (const [chainId, address] of Object.entries(addressList)) {
    //                 const currentId = `${chainId}:${address.toLowerCase()}`
    //                 if (id !== currentId) {
    //                     if (!addresses[id][Number(chainId)]) {
    //                         addresses[id][Number(chainId)] = []
    //                     }
    //                     addresses[id][Number(chainId)].push(address.toLowerCase())
    //                 }
    //             }
    //         })
    //     }
    //     return addresses
    // }
    static generate(addressLists: (Record<number, string[]> | Record<number, string>)[]): Record<string, Record<number, string[]>> {
        const result: Record<string, Record<number, string[]>> = {};

    for (const addressList of addressLists) {
        
            Object.entries(addressList).forEach(([chainId, addresses]) => {
                const hehe = Array.isArray(addresses) ? addresses : [addresses]
                
        //     Object.entries(hehe).forEach(([chainId, add]) => {
        //         const id = `${chainId}:${add.toLowerCase()}`
        //         if (!result[id]) {
        //             result[id] = {}
        //         }
        //         for (const [chainId, address] of Object.entries(addressList)) {
        //             const currentId = `${chainId}:${address.toLowerCase()}`
        //             if (id !== currentId) {
        //                 if (!result[id][Number(chainId)]) {
        //                     result[id][Number(chainId)] = []
        //                 }
        //                 result[id][Number(chainId)].push(address.toLowerCase())
        //             }
        //         }
        //     })
        //     })
        // }
        console.log({result})
        return result;
    }
    // getAddresses(chainId: number, address: string, filterChainIds?: number[]) {
    //     const id = `${chainId}:${address.toLowerCase()}`
    //     if (!addresses.has(id)) return undefined
    //     return !filterChainIds ? addresses.get(id) : new Map([...(addresses.get(id)?.entries() ?? [])].filter(([key]) => filterChainIds.includes(key)))
    // }

    static merge(...addressLists: Record<number, string>[]) {
        const merged: Record<number, string[]> = {}
        for (const addressList of addressLists) {   
            Object.entries(addressList).forEach(([chainId, address]) => {
                if (!merged[chainId]) {
                    merged[chainId] = [address.toLowerCase()]
                } else {
                    merged[chainId].push(address.toLowerCase())
                }
            })
        }
        return merged
    
    }

}