export type AbortControl = {
    signal?: AbortSignal;
};
export declare class AbortError extends Error {
    constructor(message?: string);
}
export declare function abortInvariant(signal?: AbortSignal, message?: string): void;
export declare function isAbortError(error: any): boolean;
//# sourceMappingURL=abortControl.d.ts.map