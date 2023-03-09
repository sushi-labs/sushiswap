import {isAddress} from "@ethersproject/address";
import { ChainId } from '@sushiswap/chain'
import { Token } from '@sushiswap/currency'
import { useQuery } from '@tanstack/react-query'
import {useCallback} from "react";

interface UseTokenParams {
    chainId: ChainId | undefined
    address: string | undefined
}

type Data = {
    id: string
    address: string
    name: string
    symbol: string
    decimals: number
}

const hydrate = (chainId: ChainId | undefined, data: Data) => {
    if (data && chainId) {
        const { address, name, symbol, decimals } = data
        return new Token({
            chainId,
            name,
            decimals,
            symbol,
            address,
        })
    }

    return undefined
}

export const useToken = ({ chainId, address }: UseTokenParams) => {
    const select = useCallback((data: Data) => hydrate(chainId, data), [chainId])

    return useQuery({
        queryKey: ['token', { chainId, address }],
        queryFn: async () =>
            fetch(`https://tokens.sushi.com/v0/${chainId}/${address}`).then((response) => {
                if (response.status === 200) {
                    return response.json()
                }

                throw Error(`https://tokens.sushi.com/v0/${chainId}/${address}: Token not found`)
            }),
        enabled: Boolean(chainId && address && isAddress(address)),
        select,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 900, // 15 mins
        cacheTime: 86400 // 24hs
    })
}
