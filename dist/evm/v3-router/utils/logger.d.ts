import debug from 'debug';
declare const SCOPE: {
    readonly metric: "metric";
    readonly log: "log";
    readonly error: "error";
};
type Scope = (typeof SCOPE)[keyof typeof SCOPE];
type CommaSeparated<T extends string, U extends T = T> = T extends string ? [U] extends [T] ? T : `${`${T},` | ''}${CommaSeparated<Exclude<U, T>>}` : never;
type Namespace = '*' | Scope | CommaSeparated<Scope> | (string & Record<never, never>);
export declare const metric: debug.Debugger;
export declare const log: debug.Debugger;
export declare const logger: {
    metric: debug.Debugger;
    log: debug.Debugger;
    error: debug.Debugger;
    enable: (namespace: Namespace) => void;
};
export {};
//# sourceMappingURL=logger.d.ts.map