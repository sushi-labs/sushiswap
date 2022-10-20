import { Observable } from "rxjs";
export interface LinkFlowOptions {
    darkMode: boolean;
    version: string;
    sessionId: string;
    sessionSecret: string;
    linkAPIUrl: string;
    isParentConnection: boolean;
    connected$: Observable<boolean>;
}
export declare class LinkFlow {
    private readonly darkMode;
    private readonly version;
    private readonly sessionId;
    private readonly sessionSecret;
    private readonly linkAPIUrl;
    private readonly isParentConnection;
    private readonly connected$;
    private readonly extensionUI$;
    private readonly subscriptions;
    private isConnected;
    private isOpen;
    private onCancel;
    private root;
    private connectDisabled;
    constructor(options: Readonly<LinkFlowOptions>);
    attach(el: Element): void;
    detach(): void;
    setConnectDisabled(connectDisabled: boolean): void;
    open(options: {
        onCancel: () => void;
    }): void;
    close(): void;
    private render;
}
