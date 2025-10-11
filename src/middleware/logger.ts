import winston, { Logger } from "winston";
import { s3 } from "../config/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const fileTransport = new winston.transports.File({
  filename: "logs/errors.log",
  level: "error",
});

/**
 * Console transport
 */
const consoleTransport = new winston.transports.Console({
  format: winston.format.simple(),
});
const logger: Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [fileTransport, consoleTransport],
});

async function uploadLogToS3(message: string): Promise<void> {
  try {
    const params = {
      Bucket: process.env.BUCKET_NAME_LOG!,
      Key: `logs/${new Date().toISOString().split("T")[0]}/${uuidv4()}.log`,
      Body: message,
      ContentType: "text/plain",
    };

    await s3.send(new PutObjectCommand(params));
  } catch (err) {
    console.error("❌ Failed to upload log to S3:", err);
  }
}

const originalError = logger.error.bind(logger);
logger.error = ((message: unknown, ...meta: unknown[]) => {
  const logMessage =
    typeof message === "string" ? message : JSON.stringify(message, null, 2);

  originalError(logMessage, ...meta);
  uploadLogToS3(logMessage);
}) as typeof logger.error;

export default logger;
