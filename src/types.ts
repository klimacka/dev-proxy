import http from "http";

export interface Rule {
  disabled?: boolean;
  startsWith?: string;
  match?: RegExp;
  delayMilis?: number;
  proxifyFn?: (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => void;
}
