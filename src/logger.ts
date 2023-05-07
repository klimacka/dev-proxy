import * as sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";

enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export class Logger {
  private readonly db?: sqlite3.Database;
  private ready = false;

  constructor(logToSqlite: boolean, dbFilePath: string) {
    if (!logToSqlite) {
      this.ready = true;
      return this;
    }

    const dir = path.resolve(path.dirname(dbFilePath));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    dbFilePath = path.resolve(dbFilePath);
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        this.error(`Error opening DB: ${err}`);
        return;
      }

      this.db!.run(`
        CREATE TABLE IF NOT EXISTS logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          level TEXT NOT NULL,
          message TEXT NOT NULL,
          data TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      setTimeout(() => {
        this.db!.run(`
          CREATE VIEW IF NOT EXISTS all_logs AS
          SELECT * FROM logs WHERE level IN ('debug', 'info', 'warn', 'error')
          ORDER BY timestamp DESC;
        `);

        this.db!.run(`
          CREATE VIEW IF NOT EXISTS info_plus_logs AS
          SELECT * FROM logs WHERE level IN ('info', 'warn', 'error')
          ORDER BY timestamp DESC;
        `);

        this.db!.run(`
          CREATE VIEW IF NOT EXISTS warn_plus_logs AS
          SELECT * FROM logs WHERE level IN ('warn', 'error')
          ORDER BY timestamp DESC;
        `);

        this.db!.run(`
          CREATE VIEW IF NOT EXISTS error_logs AS
          SELECT * FROM logs WHERE level = 'error'
          ORDER BY timestamp DESC;
        `);

        this.info(`Log DB: ${dbFilePath}`);
        this.ready = true;
      }, 50);
    });
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const logData = data ? JSON.stringify(data, null, 1) : null;

    console.log(`[${level}] ${message}`);

    if (typeof this.db === "undefined") return;

    this.db.run(
      `INSERT INTO logs (level, message, data) VALUES (?, ?, ?)`,
      [level, message, logData],
      (err) => {
        if (err) {
          console.error(`Error inserting log into DB: ${err}`);
        }
      }
    );
  }

  public debug(message: string, data?: unknown) {
    this.log(LogLevel.DEBUG, message, data);
  }

  public info(message: string, data?: unknown) {
    this.log(LogLevel.INFO, message, data);
  }

  public warn(message: string, data?: unknown) {
    this.log(LogLevel.WARN, message, data);
  }

  public error(message: string, data?: unknown) {
    this.log(LogLevel.ERROR, message, data);
  }

  public isReady() {
    return this.ready;
  }
}
