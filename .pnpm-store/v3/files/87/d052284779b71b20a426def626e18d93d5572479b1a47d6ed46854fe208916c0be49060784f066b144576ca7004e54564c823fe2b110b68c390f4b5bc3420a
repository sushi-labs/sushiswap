import { AbstractCurrency } from './AbstractCurrency';
import { Currency } from './Currency';
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export declare class Token extends AbstractCurrency {
    readonly chainId: number;
    readonly address: string;
    readonly isNative: false;
    readonly isToken: true;
    constructor(chainId: number, address: string, decimals: number, symbol?: string, name?: string);
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other: Currency): boolean;
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other: Token): boolean;
    /**
     * Return this token, which does not need to be wrapped
     */
    get wrapped(): Token;
}
/**
 * Compares two currencies for equality
 */
export declare function currencyEquals(currencyA: Currency, currencyB: Currency): boolean;
