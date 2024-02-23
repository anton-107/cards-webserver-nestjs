import { IncomingHttpHeaders } from "http";

type IncomingHttpHeader = keyof IncomingHttpHeaders;

export const AUTHORIZATION_HEADER = "Authorization";
export const INCOMING_HTTP_HEADER: IncomingHttpHeader = "authorization";
