export declare function defer<T>(resolved?: boolean): {
    readonly promise: Promise<void> | Promise<T>;
    resolve(value: T | PromiseLike<T>): void;
    reject(reason?: any): void;
    reset(): void;
};
export declare class DeferredNode<T = void> {
    #private;
    private constructor();
    static create<T>(onResolve: (value: T) => void, id?: string): DeferredNode<T>;
    add(child: DeferredNode<T>): void;
    remove(child: DeferredNode<T>): void;
    get settled(): boolean;
    resolve(value: T): void;
    reset(): void;
    static debugAll(indent?: string): string;
    debugDescription(indent?: string): string;
    debugLines(indent: string, level?: number): Iterable<string>;
}
