interface Tag<T extends string, RealType> {
    __tag__: T;
    __realType__: RealType;
}
export declare type OpaqueType<T extends string, U> = U & Tag<T, U>;
export declare function OpaqueType<T extends Tag<any, any>>(): (value: T extends Tag<any, infer U> ? U : never) => T;
export declare type HexString = OpaqueType<"HexString", string>;
export declare const HexString: (value: string) => HexString;
export declare type AddressString = OpaqueType<"AddressString", string>;
export declare const AddressString: (value: string) => AddressString;
export declare type BigIntString = OpaqueType<"BigIntString", string>;
export declare const BigIntString: (value: string) => BigIntString;
export declare type IntNumber = OpaqueType<"IntNumber", number>;
export declare function IntNumber(num: number): IntNumber;
export declare type RegExpString = OpaqueType<"RegExpString", string>;
export declare const RegExpString: (value: string) => RegExpString;
export declare type Callback<T> = (err: Error | null, result: T | null) => void;
export declare enum ProviderType {
    CoinbaseWallet = "CoinbaseWallet",
    MetaMask = "MetaMask",
    Unselected = ""
}
export {};
