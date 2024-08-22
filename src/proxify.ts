import http from "http";
import { proxy } from "./proxy-server";
import { liveApiTarget, activeRules } from "../config.local";
import { logger } from "./main";

export const proxify = (
  req: http.IncomingMessage,
  res: http.ServerResponse
): void => {
  const url = req.url ?? "";
  logger.debug(`Proxying request to: ${url}`, url);

  proxy.web(req, res, {
    target: liveApiTarget,
    changeOrigin: true,
  });

  const rule = activeRules.find(
    (rule) =>
      !rule.disabled &&
      (rule.startsWith ? url.startsWith(rule.startsWith) : true) &&
      (rule.match ? url.match(rule.match) : true)
  );

  if (rule && rule.proxifyFn) {
    try {
      rule.proxifyFn(req, res);
    } catch (error) {
      logger.error(`ERROR: `, error);
    }
  }
};
