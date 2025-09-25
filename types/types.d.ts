import { Serializer, Message, SessionDetails } from "wampproto";
import { ApplicationError } from "./exception";
export declare abstract class IBaseSession {
    id(): number;
    realm(): string;
    authid(): string;
    authrole(): string;
    serializer(): Serializer;
    send(data: any): void;
    receive(): Promise<any>;
    sendMessage(msg: Message): void;
    receiveMessage(): Promise<Message>;
    close(): Promise<void>;
}
export declare class BaseSession extends IBaseSession {
    private readonly _ws;
    private readonly _wsMessageHandler;
    private readonly sessionDetails;
    private readonly _serializer;
    constructor(ws: WebSocket, wsMessageHandler: any, sessionDetails: SessionDetails, serializer: Serializer);
    id(): number;
    realm(): string;
    authid(): string;
    authrole(): string;
    serializer(): Serializer;
    send(data: any): void;
    sendMessage(msg: Message): void;
    receive(): Promise<any>;
    receiveMessage(): Promise<Message>;
    close(): Promise<void>;
}
export declare class Result {
    args: any[];
    kwargs: {
        [key: string]: any;
    };
    details: {
        [key: string]: any;
    };
    constructor(args?: any[], kwargs?: {
        [key: string]: any;
    }, details?: {
        [key: string]: any;
    });
}
export declare class Registration {
    readonly registrationID: number;
    constructor(registrationID: number);
}
export declare class RegisterRequest {
    readonly promise: {
        resolve: (value: Registration) => void;
        reject: (reason: ApplicationError) => void;
    };
    readonly endpoint: (invocation: Invocation) => Result;
    constructor(promise: {
        resolve: (value: Registration) => void;
        reject: (reason: ApplicationError) => void;
    }, endpoint: (invocation: Invocation) => Result);
}
export declare class Invocation {
    readonly args: any[];
    readonly kwargs: {
        [key: string]: any;
    };
    readonly details: {
        [key: string]: any;
    };
    constructor(args?: any[], kwargs?: {
        [key: string]: any;
    }, details?: {
        [key: string]: any;
    });
}
export declare class UnregisterRequest {
    readonly promise: {
        resolve: () => void;
        reject: (reason: ApplicationError) => void;
    };
    readonly registrationID: number;
    constructor(promise: {
        resolve: () => void;
        reject: (reason: ApplicationError) => void;
    }, registrationID: number);
}
export declare class Subscription {
    readonly subscriptionID: number;
    constructor(subscriptionID: number);
}
export declare class SubscribeRequest {
    readonly promise: {
        resolve: (value: Subscription) => void;
        reject: (reason: ApplicationError) => void;
    };
    readonly endpoint: (event: Event) => void;
    constructor(promise: {
        resolve: (value: Subscription) => void;
        reject: (reason: ApplicationError) => void;
    }, endpoint: (event: Event) => void);
}
export declare class Event {
    readonly args: any[];
    readonly kwargs: {
        [key: string]: any;
    };
    readonly details: {
        [key: string]: any;
    };
    constructor(args?: any[], kwargs?: {
        [key: string]: any;
    }, details?: {
        [key: string]: any;
    });
}
export declare class UnsubscribeRequest {
    readonly promise: {
        resolve: () => void;
        reject: (reason: ApplicationError) => void;
    };
    readonly subscriptionID: number;
    constructor(promise: {
        resolve: () => void;
        reject: (reason: ApplicationError) => void;
    }, subscriptionID: number);
}
