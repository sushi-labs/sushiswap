import { TXs } from './txs';
import { Eth } from './eth';
import { Safe } from './safe';
import { Wallet } from './wallet';
export declare type Opts = {
    allowedDomains?: RegExp[];
    debug?: boolean;
};
declare class SafeAppsSDK {
    private readonly communicator;
    readonly eth: Eth;
    readonly txs: TXs;
    readonly safe: Safe;
    readonly wallet: Wallet;
    constructor(opts?: Opts);
}
export default SafeAppsSDK;
