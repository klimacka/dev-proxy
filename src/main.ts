import { listenOnPort, logToSqlite } from "../config.local";
import { startProxyServer } from "./proxy-server";
import { rootDirPath } from "./root";
import { Logger } from "./logger";

export const logger = new Logger(
  logToSqlite,
  `${rootDirPath}/log/logs_${new Date().toISOString().slice(0, 7)}.db.sqlite`
);

const main = (): void => {
  // Giving FS time to create the log DB file.
  const interval = setInterval(() => {
    if (logger.isReady()) {
      clearInterval(interval);

      logger.debug(`Starting proxy...`);
      startProxyServer(listenOnPort);
    }
  }, 10);
};

export default main;
