import { Connector } from '../../connectors';
import { Provider } from '../../types';
import { GetAccountResult } from './getAccount';
export declare type WatchAccountCallback<TProvider extends Provider = Provider> = (data: GetAccountResult<TProvider>) => void;
export declare type WatchAccountConfig = {
    selector?({ address, connector, status, }: {
        address?: string;
        connector?: Connector;
        status: GetAccountResult['status'];
    }): any;
};
export declare function watchAccount<TProvider extends Provider>(callback: WatchAccountCallback<TProvider>, { selector }?: WatchAccountConfig): () => void;
