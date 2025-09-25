"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
exports.connect = connect;
exports.connectAnonymous = connectAnonymous;
exports.connectTicket = connectTicket;
exports.connectCRA = connectCRA;
exports.connectCryptosign = connectCryptosign;
const wampproto_1 = require("wampproto");
const session_1 = require("./session");
const joiner_1 = require("./joiner");
class Client {
    constructor(clientOptions = {}) {
        this._authenticator = clientOptions.authenticator;
        this._serializer = clientOptions.serializer;
    }
    async connect(uri, realm) {
        return connect(uri, realm, { authenticator: this._authenticator, serializer: this._serializer });
    }
}
exports.Client = Client;
async function connect(uri, realm, clientOptions = {}) {
    var _a;
    const serializer = (_a = clientOptions.serializer) !== null && _a !== void 0 ? _a : new wampproto_1.CBORSerializer();
    const joiner = new joiner_1.WAMPSessionJoiner({ authenticator: clientOptions.authenticator, serializer: serializer });
    const baseSession = await joiner.join(uri, realm);
    return new session_1.Session(baseSession);
}
async function connectAnonymous(uri, realm) {
    return connect(uri, realm);
}
async function connectTicket(uri, realm, authid, ticket) {
    const ticketAuthenticator = new wampproto_1.TicketAuthenticator(authid, ticket, null);
    return connect(uri, realm, { authenticator: ticketAuthenticator });
}
async function connectCRA(uri, realm, authid, secret) {
    const craAuthenticator = new wampproto_1.WAMPCRAAuthenticator(authid, secret, null);
    return connect(uri, realm, { authenticator: craAuthenticator });
}
async function connectCryptosign(uri, realm, authid, privateKey) {
    const cryptosignAuthenticator = new wampproto_1.CryptoSignAuthenticator(authid, privateKey, {});
    return connect(uri, realm, { authenticator: cryptosignAuthenticator });
}
