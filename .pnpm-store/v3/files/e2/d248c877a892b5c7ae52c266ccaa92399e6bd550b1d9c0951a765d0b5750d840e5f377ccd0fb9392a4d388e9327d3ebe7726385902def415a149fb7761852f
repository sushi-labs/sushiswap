import SemaphoreInterface from './SemaphoreInterface';
declare class Semaphore implements SemaphoreInterface {
    private _maxConcurrency;
    constructor(_maxConcurrency: number);
    acquire(): Promise<[number, SemaphoreInterface.Releaser]>;
    runExclusive<T>(callback: SemaphoreInterface.Worker<T>): Promise<T>;
    isLocked(): boolean;
    release(): void;
    private _dispatch;
    private _queue;
    private _currentReleaser;
    private _value;
}
export default Semaphore;
