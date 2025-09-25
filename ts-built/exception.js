"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolError = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(message, options) {
        super(message);
        this.message = message;
        this.args = options === null || options === void 0 ? void 0 : options.args;
        this.kwargs = options === null || options === void 0 ? void 0 : options.kwargs;
    }
    toString() {
        let errStr = this.message;
        if (this.args && this.args.length > 0) {
            const argsStr = this.args.map(arg => arg.toString()).join(", ");
            errStr += `: ${argsStr}`;
        }
        if (this.kwargs && Object.keys(this.kwargs).length > 0) {
            const kwargsStr = Object.entries(this.kwargs)
                .map(([key, value]) => `${key}=${value}`)
                .join(", ");
            errStr += `: ${kwargsStr}`;
        }
        return errStr;
    }
}
exports.ApplicationError = ApplicationError;
class ProtocolError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.message = message;
    }
}
exports.ProtocolError = ProtocolError;
