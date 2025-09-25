"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAMPSessionJoiner = void 0;
const wampproto_1 = require("wampproto");
if (typeof globalThis.WebSocket === 'undefined') {
    Promise.resolve().then(() => require('ws')).then((ws) => {
        globalThis.WebSocket = ws.default;
    });
}
const types_1 = require("./types");
const helpers_1 = require("./helpers");
class WAMPSessionJoiner {
    constructor(joinerOptions) {
        this._serializer = joinerOptions.serializer || new wampproto_1.JSONSerializer();
        this._authenticator = joinerOptions.authenticator;
    }
    async join(uri, realm) {
        const ws = new globalThis.WebSocket(uri, [(0, helpers_1.getSubProtocol)(this._serializer)]);
        const joiner = new wampproto_1.Joiner(realm, this._serializer, this._authenticator);
        ws.addEventListener('open', () => {
            ws.send(joiner.sendHello());
        });
        return new Promise((resolve, reject) => {
            const wsMessageHandler = async (event) => {
                try {
                    let data = event.data;
                    if (event.data instanceof Blob) {
                        data = new Uint8Array(await event.data.arrayBuffer());
                    }
                    const toSend = joiner.receive(data);
                    if (!toSend) {
                        ws.removeEventListener('message', wsMessageHandler);
                        ws.removeEventListener('close', closeHandler);
                        const baseSession = new types_1.BaseSession(ws, wsMessageHandler, joiner.getSessionDetails(), this._serializer);
                        resolve(baseSession);
                    }
                    else {
                        ws.send(toSend);
                    }
                }
                catch (error) {
                    reject(error);
                }
            };
            const closeHandler = () => {
                ws.removeEventListener('message', wsMessageHandler);
                reject(new Error('Connection closed before handshake completed'));
            };
            ws.addEventListener('message', wsMessageHandler);
            ws.addEventListener('error', (error) => reject(error));
            ws.addEventListener('close', closeHandler);
        });
    }
}
exports.WAMPSessionJoiner = WAMPSessionJoiner;
