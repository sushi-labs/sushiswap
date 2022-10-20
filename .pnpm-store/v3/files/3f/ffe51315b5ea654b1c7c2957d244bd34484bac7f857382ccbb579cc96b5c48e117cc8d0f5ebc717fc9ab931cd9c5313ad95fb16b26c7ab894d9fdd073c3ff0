import MutexInterface from './MutexInterface';
declare class Mutex implements MutexInterface {
    acquire(): Promise<MutexInterface.Releaser>;
    runExclusive<T>(callback: MutexInterface.Worker<T>): Promise<T>;
    isLocked(): boolean;
    release(): void;
    private _semaphore;
}
export default Mutex;
