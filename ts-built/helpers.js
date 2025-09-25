"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubProtocol = getSubProtocol;
exports.wampErrorString = wampErrorString;
const wampproto_1 = require("wampproto");
const jsonSubProtocol = "wamp.2.json";
const cborSubProtocol = "wamp.2.cbor";
const msgpackSubProtocol = "wamp.2.msgpack";
function getSubProtocol(serializer) {
    if (serializer instanceof wampproto_1.JSONSerializer) {
        return jsonSubProtocol;
    }
    else if (serializer instanceof wampproto_1.CBORSerializer) {
        return cborSubProtocol;
    }
    else if (serializer instanceof wampproto_1.MsgPackSerializer) {
        return msgpackSubProtocol;
    }
    else {
        throw new Error("invalid serializer");
    }
}
function wampErrorString(err) {
    let errStr = err.uri;
    if (err.args && err.args.length > 0) {
        const args = err.args.map((arg) => arg.toString()).join(", ");
        errStr += `: ${args}`;
    }
    if (err.kwargs && Object.keys(err.kwargs).length > 0) {
        const kwargs = Object.entries(err.kwargs)
            .map(([key, value]) => `${key}=${value}`)
            .join(", ");
        errStr += `: ${kwargs}`;
    }
    return errStr;
}
