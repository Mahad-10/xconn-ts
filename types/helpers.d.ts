import { Serializer, Error as ErrorMsg } from "wampproto";
export declare function getSubProtocol(serializer: Serializer): string;
export declare function wampErrorString(err: ErrorMsg): string;
