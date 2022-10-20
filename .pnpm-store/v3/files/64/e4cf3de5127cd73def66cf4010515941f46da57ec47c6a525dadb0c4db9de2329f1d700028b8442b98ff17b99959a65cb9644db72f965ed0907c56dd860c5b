import { CoinbaseWalletSDK } from "./CoinbaseWalletSDK";
import { CoinbaseWalletProvider } from "./provider/CoinbaseWalletProvider";
export { CoinbaseWalletSDK } from "./CoinbaseWalletSDK";
export { CoinbaseWalletProvider } from "./provider/CoinbaseWalletProvider";
export default CoinbaseWalletSDK;
declare global {
    interface Window {
        CoinbaseWalletSDK: typeof CoinbaseWalletSDK;
        CoinbaseWalletProvider: typeof CoinbaseWalletProvider;
        /**
         * For CoinbaseWalletSDK, window.ethereum is `CoinbaseWalletProvider`
         */
        ethereum?: unknown;
        coinbaseWalletExtension?: CoinbaseWalletProvider;
        /**
         * @deprecated Legacy API
         */
        WalletLink: typeof CoinbaseWalletSDK;
        /**
         * @deprecated Legacy API
         */
        WalletLinkProvider: typeof CoinbaseWalletProvider;
        /**
         * @deprecated Legacy API
         */
        walletLinkExtension?: CoinbaseWalletProvider;
    }
}
