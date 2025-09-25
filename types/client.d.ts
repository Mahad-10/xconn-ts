import { ClientAuthenticator, Serializer } from "wampproto";
import { Session } from "./session";
export declare class Client {
    private readonly _authenticator?;
    private readonly _serializer?;
    constructor(clientOptions?: {
        authenticator?: ClientAuthenticator;
        serializer?: Serializer;
    });
    connect(uri: string, realm: string): Promise<Session>;
}
export declare function connect(uri: string, realm: string, clientOptions?: {
    authenticator?: ClientAuthenticator;
    serializer?: Serializer;
}): Promise<Session>;
export declare function connectAnonymous(uri: string, realm: string): Promise<Session>;
export declare function connectTicket(uri: string, realm: string, authid: string, ticket: string): Promise<Session>;
export declare function connectCRA(uri: string, realm: string, authid: string, secret: string): Promise<Session>;
export declare function connectCryptosign(uri: string, realm: string, authid: string, privateKey: string): Promise<Session>;
