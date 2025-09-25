import { ClientAuthenticator, Serializer } from 'wampproto';
import { BaseSession } from './types';
export declare class WAMPSessionJoiner {
    private readonly _authenticator?;
    private readonly _serializer;
    constructor(joinerOptions: {
        authenticator?: ClientAuthenticator;
        serializer?: Serializer;
    });
    join(uri: string, realm: string): Promise<BaseSession>;
}
