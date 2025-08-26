export type AnyAsyncFunction = (...args: any[]) => Promise<any>;
export interface AsyncCall<F extends AnyAsyncFunction> {
    asyncFn: F;
    timeout?: number;
}
export declare function withFallback<F extends AnyAsyncFunction>(calls: AsyncCall<F>[]): (...args: Parameters<F>) => Promise<any>;
export type WithFallbackOptions<F extends AnyAsyncFunction> = {
    fallbacks?: F[];
    fallbackTimeout?: number;
};
export declare function createAsyncCallWithFallbacks<F extends AnyAsyncFunction>(defaultCall: F, options?: WithFallbackOptions<F>): (...args: Parameters<F>) => Promise<any>;
//# sourceMappingURL=withFallback.d.ts.map