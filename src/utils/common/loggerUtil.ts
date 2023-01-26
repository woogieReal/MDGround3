import * as log4js from "log4js";

/* level
 * ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF
 * OFF is intended to be used to turn off logging, not as a level for actual logging
 * if set to 'error' then the appenders will only receive log events of level 'error' 'fatal', 'mark'
 */

let appenders: { [name: string]: log4js.Appender } = {
  out: { type: "stdout" }
};

if (process.env.NODE_ENV === 'development') {
  appenders = {
    ...appenders,
    app: { type: "file", filename: "logs/app.log" },
    auth: { type: "file", filename: "logs/tree.log" },
    tree: { type: "file", filename: "logs/auth.log" },
  };
} else {
  // produnction 모드일 때 추가 필요
}


log4js.configure({
  appenders: appenders,
  categories: {
    default: { appenders: ["out"], level: "trace" },
    app: { appenders: ["app"], level: "debug" },
    "app.auth": { appenders: ["auth"], level: "warn" },
    "app.tree": { appenders: ["tree"], level: "error" },
  },
});


export const consoleLogger = log4js.getLogger();
// logger.trace("This will use the default category and go to stdout");

export const appLogger = log4js.getLogger("app");
// logger.trace("This will use the default category and go to stdout");

export const treeLogger = log4js.getLogger("app.tree");
// treeLogger.error("This will go to **");
