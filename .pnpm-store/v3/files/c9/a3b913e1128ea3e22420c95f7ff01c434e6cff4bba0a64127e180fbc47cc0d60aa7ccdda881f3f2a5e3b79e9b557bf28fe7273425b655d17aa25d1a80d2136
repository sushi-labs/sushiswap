import { Provider } from '../../types';
import { GetProviderArgs, GetProviderResult } from './getProvider';
export declare type WatchProviderCallback<TProvider extends Provider = Provider> = (provider: GetProviderResult<TProvider>) => void;
export declare function watchProvider<TProvider extends Provider = Provider>(args: GetProviderArgs, callback: WatchProviderCallback<TProvider>): () => void;
