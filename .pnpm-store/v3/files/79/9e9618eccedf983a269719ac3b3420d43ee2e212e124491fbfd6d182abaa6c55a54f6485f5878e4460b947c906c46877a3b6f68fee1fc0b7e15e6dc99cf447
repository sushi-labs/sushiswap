import { Page } from './transactions';
export declare enum RPC_AUTHENTICATION {
    API_KEY_PATH = "API_KEY_PATH",
    NO_AUTHENTICATION = "NO_AUTHENTICATION",
    UNKNOWN = "UNKNOWN"
}
export declare type RpcUri = {
    authentication: RPC_AUTHENTICATION;
    value: string;
};
export declare type BlockExplorerUriTemplate = {
    address: string;
    txHash: string;
    api: string;
};
export declare type NativeCurrency = {
    name: string;
    symbol: string;
    decimals: number;
    logoUri: string;
};
export declare type Theme = {
    textColor: string;
    backgroundColor: string;
};
export declare enum GAS_PRICE_TYPE {
    ORACLE = "ORACLE",
    FIXED = "FIXED",
    UNKNOWN = "UNKNOWN"
}
export declare type GasPriceOracle = {
    type: GAS_PRICE_TYPE.ORACLE;
    uri: string;
    gasParameter: string;
    gweiFactor: string;
};
export declare type GasPriceFixed = {
    type: GAS_PRICE_TYPE.FIXED;
    weiValue: string;
};
export declare type GasPriceUnknown = {
    type: GAS_PRICE_TYPE.UNKNOWN;
};
export declare type GasPrice = (GasPriceOracle | GasPriceFixed | GasPriceUnknown)[];
export declare enum FEATURES {
    ERC721 = "ERC721",
    SAFE_APPS = "SAFE_APPS",
    CONTRACT_INTERACTION = "CONTRACT_INTERACTION",
    DOMAIN_LOOKUP = "DOMAIN_LOOKUP",
    SPENDING_LIMIT = "SPENDING_LIMIT",
    EIP1559 = "EIP1559",
    SAFE_TX_GAS_OPTIONAL = "SAFE_TX_GAS_OPTIONAL",
    TX_SIMULATION = "TX_SIMULATION"
}
export declare type ChainInfo = {
    transactionService: string;
    chainId: string;
    chainName: string;
    shortName: string;
    l2: boolean;
    description: string;
    rpcUri: RpcUri;
    safeAppsRpcUri: RpcUri;
    publicRpcUri: RpcUri;
    blockExplorerUriTemplate: BlockExplorerUriTemplate;
    nativeCurrency: NativeCurrency;
    theme: Theme;
    ensRegistryAddress?: string;
    gasPrice: GasPrice;
    disabledWallets: string[];
    features: FEATURES[];
};
export declare type ChainListResponse = Page<ChainInfo>;
