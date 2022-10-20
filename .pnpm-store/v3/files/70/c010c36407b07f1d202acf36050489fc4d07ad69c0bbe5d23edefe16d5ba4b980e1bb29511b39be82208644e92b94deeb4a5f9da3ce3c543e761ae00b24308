import { Client } from '../../client';
import { Connector, ConnectorData } from '../../connectors';
import { Provider } from '../../types';
export declare type ConnectArgs = {
    /** Chain ID to connect to */
    chainId?: number;
    /** Connector to connect */
    connector: Connector;
};
declare type Data<TProvider extends Provider = Provider> = Required<ConnectorData<TProvider>>;
export declare type ConnectResult<TProvider extends Provider = Provider> = {
    account: Data<TProvider>['account'];
    chain: Data<TProvider>['chain'];
    connector: Client<TProvider>['connector'];
    provider: Data<TProvider>['provider'];
};
export declare function connect<TProvider extends Provider = Provider>({ chainId, connector, }: ConnectArgs): Promise<ConnectResult<TProvider>>;
export {};
