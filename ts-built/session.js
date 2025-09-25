"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const wampproto_1 = require("wampproto");
const helpers_1 = require("./helpers");
const exception_1 = require("./exception");
const types_1 = require("./types");
class Session {
    constructor(baseSession) {
        this._idGen = new wampproto_1.SessionScopeIDGenerator();
        this._callRequests = new Map();
        this._registerRequests = new Map();
        this._registrations = new Map();
        this._unregisterRequests = new Map();
        this._publishRequests = new Map();
        this._subscribeRequests = new Map();
        this._subscriptions = new Map();
        this._unsubscribeRequests = new Map();
        this._baseSession = baseSession;
        this._wampSession = new wampproto_1.WAMPSession(baseSession.serializer());
        (async () => {
            for (;;) {
                const message = await this._baseSession.receive();
                this._processIncomingMessage(this._wampSession.receive(message));
            }
        })();
    }
    get _nextID() {
        return this._idGen.next();
    }
    async close() {
        await this._baseSession.close();
    }
    _processIncomingMessage(message) {
        if (message instanceof wampproto_1.Result) {
            const promiseHandler = this._callRequests.get(message.requestID);
            promiseHandler.resolve(new types_1.Result(message.args, message.kwargs, message.options));
        }
        else if (message instanceof wampproto_1.Registered) {
            const request = this._registerRequests.get(message.requestID);
            if (request) {
                this._registrations.set(message.registrationID, request.endpoint);
                request.promise.resolve(new types_1.Registration(message.registrationID));
                this._registerRequests.delete(message.requestID);
            }
        }
        else if (message instanceof wampproto_1.Invocation) {
            const endpoint = this._registrations.get(message.registrationID);
            if (endpoint) {
                const result = endpoint(new types_1.Invocation(message.args, message.kwargs, message.details));
                this._baseSession.send(this._wampSession.sendMessage(new wampproto_1.Yield(new wampproto_1.YieldFields(message.requestID, result.args, result.kwargs, result.details))));
            }
        }
        else if (message instanceof wampproto_1.Unregistered) {
            const request = this._unregisterRequests.get(message.requestID);
            if (request) {
                this._registrations.delete(request.registrationID);
                this._unregisterRequests.delete(message.requestID);
                request.promise.resolve();
            }
        }
        else if (message instanceof wampproto_1.Published) {
            const request = this._publishRequests.get(message.requestID);
            if (request) {
                request.resolve();
                this._publishRequests.delete(message.requestID);
            }
        }
        else if (message instanceof wampproto_1.Subscribed) {
            const request = this._subscribeRequests.get(message.requestID);
            if (request) {
                this._subscriptions.set(message.subscriptionID, request.endpoint);
                request.promise.resolve(new types_1.Subscription(message.subscriptionID));
                this._subscribeRequests.delete(message.requestID);
            }
        }
        else if (message instanceof wampproto_1.Event) {
            const endpoint = this._subscriptions.get(message.subscriptionID);
            if (endpoint) {
                endpoint(new types_1.Event(message.args, message.kwargs, message.details));
            }
        }
        else if (message instanceof wampproto_1.Unsubscribed) {
            const request = this._unsubscribeRequests.get(message.requestID);
            if (request) {
                this._subscriptions.delete(request.subscriptionID);
                request.promise.resolve();
                this._unsubscribeRequests.delete(message.requestID);
            }
        }
        else if (message instanceof wampproto_1.Error) {
            switch (message.messageType) {
                case wampproto_1.Call.TYPE: {
                    const promiseHandler = this._callRequests.get(message.requestID);
                    promiseHandler.reject(new exception_1.ApplicationError(message.uri, { args: message.args, kwargs: message.kwargs }));
                    this._callRequests.delete(message.requestID);
                    break;
                }
                case wampproto_1.Register.TYPE: {
                    const registerRequest = this._registerRequests.get(message.requestID);
                    registerRequest.promise.reject(new exception_1.ApplicationError(message.uri, { args: message.args, kwargs: message.kwargs }));
                    this._registerRequests.delete(message.requestID);
                    break;
                }
                case wampproto_1.Unregister.TYPE: {
                    const unregisterRequest = this._unregisterRequests.get(message.requestID);
                    unregisterRequest.promise.reject(new exception_1.ApplicationError(message.uri, { args: message.args, kwargs: message.kwargs }));
                    this._unregisterRequests.delete(message.requestID);
                    break;
                }
                case wampproto_1.Publish.TYPE: {
                    const publishRequest = this._publishRequests.get(message.requestID);
                    publishRequest.reject(new exception_1.ApplicationError(message.uri, { args: message.args, kwargs: message.kwargs }));
                    this._publishRequests.delete(message.requestID);
                    break;
                }
                case wampproto_1.Subscribe.TYPE: {
                    const subscribeRequest = this._subscribeRequests.get(message.requestID);
                    if (subscribeRequest) {
                        subscribeRequest.promise.reject(new exception_1.ApplicationError(message.uri, { args: message.args, kwargs: message.kwargs }));
                        this._subscribeRequests.delete(message.requestID);
                    }
                    break;
                }
                case wampproto_1.Unsubscribe.TYPE: {
                    const unsubscribeRequest = this._unsubscribeRequests.get(message.requestID);
                    if (unsubscribeRequest) {
                        unsubscribeRequest.promise.reject(new exception_1.ApplicationError(message.uri, { args: message.args, kwargs: message.kwargs }));
                        this._unsubscribeRequests.delete(message.requestID);
                    }
                    break;
                }
                default:
                    throw new exception_1.ProtocolError((0, helpers_1.wampErrorString)(message));
            }
        }
        else {
            throw new exception_1.ProtocolError(`Unexpected message type ${typeof message}`);
        }
    }
    async call(procedure, callOptions = {}) {
        const call = new wampproto_1.Call(new wampproto_1.CallFields(this._nextID, procedure, callOptions.args, callOptions.kwargs, callOptions.options));
        let promiseHandler;
        const promise = new Promise((resolve, reject) => {
            promiseHandler = { resolve, reject };
        });
        this._callRequests.set(call.requestID, promiseHandler);
        this._baseSession.send(this._wampSession.sendMessage(call));
        return promise;
    }
    async register(procedure, endpoint, options) {
        const register = new wampproto_1.Register(new wampproto_1.RegisterFields(this._nextID, procedure, options));
        let promiseHandler;
        const promise = new Promise((resolve, reject) => {
            promiseHandler = { resolve, reject };
        });
        const request = new types_1.RegisterRequest(promiseHandler, endpoint);
        this._registerRequests.set(register.requestID, request);
        this._baseSession.send(this._wampSession.sendMessage(register));
        return promise;
    }
    async unregister(reg) {
        const unregister = new wampproto_1.Unregister(new wampproto_1.UnregisterFields(this._nextID, reg.registrationID));
        let promiseHandler;
        const promise = new Promise((resolve, reject) => {
            promiseHandler = { resolve, reject };
        });
        const request = new types_1.UnregisterRequest(promiseHandler, reg.registrationID);
        this._unregisterRequests.set(unregister.requestID, request);
        this._baseSession.send(this._wampSession.sendMessage(unregister));
        return promise;
    }
    async publish(topic, publishOptions = {}) {
        var _a;
        const publish = new wampproto_1.Publish(new wampproto_1.PublishFields(this._nextID, topic, publishOptions.args, publishOptions.kwargs, publishOptions.options));
        this._baseSession.send(this._wampSession.sendMessage(publish));
        if ((_a = publishOptions.options) === null || _a === void 0 ? void 0 : _a["acknowledge"]) {
            let promiseHandler;
            const promise = new Promise((resolve, reject) => {
                promiseHandler = { resolve, reject };
            });
            this._publishRequests.set(publish.requestID, promiseHandler);
            return promise;
        }
        return null;
    }
    async subscribe(topic, endpoint, options) {
        const subscribe = new wampproto_1.Subscribe(new wampproto_1.SubscribeFields(this._nextID, topic, options));
        let promiseHandler;
        const promise = new Promise((resolve, reject) => {
            promiseHandler = { resolve, reject };
        });
        const request = new types_1.SubscribeRequest(promiseHandler, endpoint);
        this._subscribeRequests.set(subscribe.requestID, request);
        this._baseSession.send(this._wampSession.sendMessage(subscribe));
        return promise;
    }
    async unsubscribe(sub) {
        const unsubscribe = new wampproto_1.Unsubscribe(new wampproto_1.UnsubscribeFields(this._nextID, sub.subscriptionID));
        let promiseHandler;
        const promise = new Promise((resolve, reject) => {
            promiseHandler = { resolve, reject };
        });
        const request = new types_1.UnsubscribeRequest(promiseHandler, sub.subscriptionID);
        this._unsubscribeRequests.set(unsubscribe.requestID, request);
        this._baseSession.send(this._wampSession.sendMessage(unsubscribe));
        return promise;
    }
}
exports.Session = Session;
