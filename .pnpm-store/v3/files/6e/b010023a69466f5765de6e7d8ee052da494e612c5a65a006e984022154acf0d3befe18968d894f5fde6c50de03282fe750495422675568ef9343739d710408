interface SemaphoreInterface {
    acquire(): Promise<[number, SemaphoreInterface.Releaser]>;
    runExclusive<T>(callback: SemaphoreInterface.Worker<T>): Promise<T>;
    isLocked(): boolean;
    release(): void;
}
declare namespace SemaphoreInterface {
    interface Releaser {
        (): void;
    }
    interface Worker<T> {
        (value: number): Promise<T> | T;
    }
}
export default SemaphoreInterface;
