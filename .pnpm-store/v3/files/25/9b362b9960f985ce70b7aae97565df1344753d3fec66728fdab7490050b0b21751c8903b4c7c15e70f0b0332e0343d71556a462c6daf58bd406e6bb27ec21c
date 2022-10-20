declare module "tiny-lru" {
  class Lru<T = any> {
    constructor(max?: number, ttl?: number);

    public max: number;
    public ttl: number;
    public size: number;
    public first: T | null;
    public last: T | null;

    public has(key: string): boolean;
    public get(key: string): T | undefined;
    public set(key: string, value: T, bypass?: boolean): this;
    public clear(): this;
    public delete(key: string): this;
    public evict(): this;
    public keys(): string[];
  }
  export default function factory<T = any>(max?: number, ttl?: number): Lru<T>;
}
