"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsubscribeRequest = exports.Event = exports.SubscribeRequest = exports.Subscription = exports.UnregisterRequest = exports.Invocation = exports.RegisterRequest = exports.Registration = exports.Result = exports.BaseSession = exports.IBaseSession = void 0;
class IBaseSession {
    id() {
        throw new Error("UnimplementedError");
    }
    realm() {
        throw new Error("UnimplementedError");
    }
    authid() {
        throw new Error("UnimplementedError");
    }
    authrole() {
        throw new Error("UnimplementedError");
    }
    serializer() {
        throw new Error("UnimplementedError");
    }
    send(data) {
        throw new Error("UnimplementedError");
    }
    async receive() {
        throw new Error("UnimplementedError");
    }
    sendMessage(msg) {
        throw new Error("UnimplementedError");
    }
    async receiveMessage() {
        throw new Error("UnimplementedError");
    }
    async close() {
        throw new Error("UnimplementedError");
    }
}
exports.IBaseSession = IBaseSession;
class BaseSession extends IBaseSession {
    constructor(ws, wsMessageHandler, sessionDetails, serializer) {
        super();
        this._ws = ws;
        this._wsMessageHandler = wsMessageHandler;
        this.sessionDetails = sessionDetails;
        this._serializer = serializer;
        // close cleanly on abrupt client disconnect
        this._ws.addEventListener("close", async () => {
            await this.close();
        });
    }
    id() {
        return this.sessionDetails.sessionID;
    }
    realm() {
        return this.sessionDetails.realm;
    }
    authid() {
        return this.sessionDetails.authid;
    }
    authrole() {
        return this.sessionDetails.authrole;
    }
    serializer() {
        return this._serializer;
    }
    send(data) {
        this._ws.send(data);
    }
    sendMessage(msg) {
        this.send(this._serializer.serialize(msg));
    }
    async receive() {
        return new Promise((resolve) => {
            const messageHandler = async (event) => {
                let data = event.data;
                if (event.data instanceof Blob) {
                    data = new Uint8Array(await event.data.arrayBuffer());
                }
                resolve(data);
                this._ws.removeEventListener("message", messageHandler);
            };
            this._ws.addEventListener("message", messageHandler, { once: true });
        });
    }
    async receiveMessage() {
        return this._serializer.deserialize(await this.receive());
    }
    async close() {
        if (this._wsMessageHandler) {
            this._ws.removeEventListener("message", this._wsMessageHandler);
            this._ws.removeEventListener("close", this._wsMessageHandler);
        }
        this._ws.close();
    }
}
exports.BaseSession = BaseSession;
class Result {
    constructor(args, kwargs, details) {
        this.args = args || [];
        this.kwargs = kwargs || {};
        this.details = details || {};
    }
}
exports.Result = Result;
class Registration {
    constructor(registrationID) {
        this.registrationID = registrationID;
    }
}
exports.Registration = Registration;
class RegisterRequest {
    constructor(promise, endpoint) {
        this.promise = promise;
        this.endpoint = endpoint;
    }
}
exports.RegisterRequest = RegisterRequest;
class Invocation {
    constructor(args = [], kwargs = {}, details = {}) {
        this.args = args;
        this.kwargs = kwargs;
        this.details = details;
    }
}
exports.Invocation = Invocation;
class UnregisterRequest {
    constructor(promise, registrationID) {
        this.promise = promise;
        this.registrationID = registrationID;
    }
}
exports.UnregisterRequest = UnregisterRequest;
class Subscription {
    constructor(subscriptionID) {
        this.subscriptionID = subscriptionID;
        this.subscriptionID = subscriptionID;
    }
}
exports.Subscription = Subscription;
class SubscribeRequest {
    constructor(promise, endpoint) {
        this.promise = promise;
        this.endpoint = endpoint;
    }
}
exports.SubscribeRequest = SubscribeRequest;
class Event {
    constructor(args = [], kwargs = {}, details = {}) {
        this.args = args;
        this.kwargs = kwargs;
        this.details = details;
    }
}
exports.Event = Event;
class UnsubscribeRequest {
    constructor(promise, subscriptionID) {
        this.promise = promise;
        this.subscriptionID = subscriptionID;
    }
}
exports.UnsubscribeRequest = UnsubscribeRequest;
