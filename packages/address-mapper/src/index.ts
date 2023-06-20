

export class AddressMapper {
    private addresses: Map<string, Map<number, string>> = new Map()

    constructor(...addressLists: Record<number, string>[]) {
        this.initialize(addressLists)
    }

    initialize(addressLists: Record<number, string>[]) {

        this.addresses = new Map()
        for (const addressList of addressLists) {
            Object.entries(addressList).forEach(([chainId, address]) => {
                const id = `${chainId}:${address.toLowerCase()}`
                if (!this.addresses?.has(id)) {
                    this.addresses?.set(id, new Map())
                }
                for (const [chainId, address] of Object.entries(addressList)) {
                    const currentId = `${chainId}:${address.toLowerCase()}`
                    if (id !== currentId) {
                        this.addresses.get(id)?.set(Number(chainId), address.toLowerCase())
                    }
                }
            })
        }
    }

    allAddresses() {
        return this.addresses;
    }

    getAddresses(chainId: number, address: string, filterChainIds?: number[]) {
        const id = `${chainId}:${address.toLowerCase()}`
        if (!this.addresses.has(id)) return undefined
        return !filterChainIds ? this.addresses.get(id) : new Map([...(this.addresses.get(id)?.entries() ?? [])].filter(([key]) => filterChainIds.includes(key)))
    }

}