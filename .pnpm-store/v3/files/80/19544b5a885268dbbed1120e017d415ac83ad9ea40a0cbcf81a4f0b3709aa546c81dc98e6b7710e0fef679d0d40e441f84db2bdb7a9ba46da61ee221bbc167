import { WebSocketProvider } from '../../types';
import { GetWebSocketProviderArgs, GetWebSocketProviderResult } from './getWebSocketProvider';
export declare type WatchWebSocketProviderCallback<TWebSocketProvider extends WebSocketProvider = WebSocketProvider> = (webSocketProvider: GetWebSocketProviderResult<TWebSocketProvider>) => void;
export declare function watchWebSocketProvider<TWebSocketProvider extends WebSocketProvider = WebSocketProvider>(args: GetWebSocketProviderArgs, callback: WatchWebSocketProviderCallback<TWebSocketProvider>): () => void;
