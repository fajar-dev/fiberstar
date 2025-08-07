import { createLogger, transports, format } from 'winston';
import 'winston-daily-rotate-file';
import * as dotenv from 'dotenv';
import { existsSync, mkdirSync } from 'fs';
dotenv.config();

const logDir = process.env.LOG_DIR

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: 'info', 
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: `${logDir}/log-info-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxFiles: '1d', 
    }),

    new transports.DailyRotateFile({
      filename: `${logDir}/log-error-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '1d',
    }),

    new transports.Console({
      format: format.simple(),
    }),
  ],
});

export default logger;
