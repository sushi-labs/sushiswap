import { ethers } from "ethers"
import { Limited } from "../Limited"
import { Network, Token } from "../networks/Network"
import { PoolCode } from "../pools/PoolCode"

export abstract class LiquidityProvider {
    limited: Limited
    chainDataProvider: ethers.providers.BaseProvider
    network: Network

    constructor(
        chainDataProvider: ethers.providers.BaseProvider,
        network: Network,
        l: Limited
    ) {
        this.limited = l
        this.chainDataProvider = chainDataProvider
        this.network = network
    }

    abstract getPoolProviderName(): string;
    abstract getPools(t0: Token, t1: Token): Promise<PoolCode[]>;
}