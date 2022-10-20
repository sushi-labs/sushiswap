import { Currency } from '../Currency';
import { NativeCurrency } from '../NativeCurrency';
import { Token } from '../Token';
/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export declare class Ether extends NativeCurrency {
    protected constructor(chainId: number);
    get wrapped(): Token;
    private static _etherCache;
    static onChain(chainId: number): Ether;
    equals(other: Currency): boolean;
}
