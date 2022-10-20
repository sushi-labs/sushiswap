interface MutexInterface {
    acquire(): Promise<MutexInterface.Releaser>;
    runExclusive<T>(callback: MutexInterface.Worker<T>): Promise<T>;
    isLocked(): boolean;
    release(): void;
}
declare namespace MutexInterface {
    interface Releaser {
        (): void;
    }
    interface Worker<T> {
        (): Promise<T> | T;
    }
}
export default MutexInterface;
