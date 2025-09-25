export declare class ApplicationError extends Error {
    readonly message: string;
    readonly args?: any[];
    readonly kwargs?: {
        [key: string]: any;
    } | null;
    constructor(message: string, options?: {
        args?: any[];
        kwargs?: {
            [key: string]: any;
        } | null;
    });
    toString(): string;
}
export declare class ProtocolError extends Error {
    readonly message: string;
    constructor(message: string);
}
