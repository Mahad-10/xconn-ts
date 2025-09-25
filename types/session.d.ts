import { IBaseSession, Result, Invocation, Registration, Event, Subscription } from "./types";
export declare class Session {
    private _baseSession;
    private _wampSession;
    private _idGen;
    private _callRequests;
    private _registerRequests;
    private _registrations;
    private _unregisterRequests;
    private _publishRequests;
    private _subscribeRequests;
    private _subscriptions;
    private _unsubscribeRequests;
    constructor(baseSession: IBaseSession);
    private get _nextID();
    close(): Promise<void>;
    private _processIncomingMessage;
    call(procedure: string, callOptions?: {
        args?: any[] | null;
        kwargs?: {
            [key: string]: any;
        } | null;
        options?: {
            [key: string]: any;
        } | null;
    }): Promise<Result>;
    register(procedure: string, endpoint: (invocation: Invocation) => Result, options?: {
        [key: string]: any;
    } | null): Promise<Registration>;
    unregister(reg: Registration): Promise<void>;
    publish(topic: string, publishOptions?: {
        args?: any[] | null;
        kwargs?: {
            [key: string]: any;
        } | null;
        options?: {
            [key: string]: any;
        } | null;
    }): Promise<void | null>;
    subscribe(topic: string, endpoint: (event: Event) => void, options?: {
        [key: string]: any;
    } | null): Promise<Subscription>;
    unsubscribe(sub: Subscription): Promise<void>;
}
