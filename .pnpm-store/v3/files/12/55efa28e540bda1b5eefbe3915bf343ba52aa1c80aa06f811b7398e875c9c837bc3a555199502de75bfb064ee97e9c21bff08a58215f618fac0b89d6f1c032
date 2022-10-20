import { Observable } from "rxjs";
import { ScopedLocalStorage } from "../lib/ScopedLocalStorage";
export declare class Session {
    private readonly _id;
    private readonly _secret;
    private readonly _key;
    private readonly _storage;
    private _linked;
    constructor(storage: ScopedLocalStorage, id?: string, secret?: string, linked?: boolean);
    static load(storage: ScopedLocalStorage): Session | null;
    static get persistedSessionIdChange$(): Observable<{
        oldValue: string | null;
        newValue: string | null;
    }>;
    /**
     * Takes in a session ID and returns the sha256 hash of it.
     * @param sessionId session ID
     */
    static hash(sessionId: string): string;
    get id(): string;
    get secret(): string;
    get key(): string;
    get linked(): boolean;
    set linked(val: boolean);
    save(): Session;
    private persistLinked;
}
