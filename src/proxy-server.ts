import http from "http";
import httpProxy from "http-proxy";
import { proxify } from "./proxify";
import { liveApiTarget, activeRules } from "../config.local";
import { formatAsJsonWithNotice } from "./utils";
import { logger } from "./main";

export const proxy = httpProxy.createProxyServer({
  secure: false,
});

proxy.on("error", function (err) {
  logger.error("Proxy error", err);
});

export const overwriteWith = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  data: object
): void => {
  logger.info(`Replacing API result for: ${req.url}`, data);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(formatAsJsonWithNotice(data));
  res.end();
};

export const startProxyServer = (
  port: number
): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> => {
  const server = http.createServer((req, res) => {
    const url = req.url ?? "";

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    const throttle = activeRules.find(
      (entry) =>
        !entry.disabled &&
        (entry.startsWith ? url.startsWith(entry.startsWith) : true) &&
        (entry.match ? url.match(entry.match) : true)
    );
    const delay = throttle && (throttle.delayMilis ?? 0);

    if (delay) {
      logger.info(`Delaying by ${delay} ms request to: ${req.url}`);
      setTimeout(() => {
        proxify(req, res);
      }, delay);
    } else {
      proxify(req, res);
    }
  });

  server.on("upgrade", function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  server.listen(port);

  logger.debug(`Listening on port ${port}`);
  logger.info(`Live API target: ${liveApiTarget}`);

  if (!activeRules.length) {
    logger.info(`No rules are enabled!`);
  } else {
    logger.info(
      `Active rules: ${activeRules.filter((r) => !r.disabled).length}`
    );
  }

  return server;
};
