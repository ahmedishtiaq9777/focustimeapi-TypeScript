import { s3 } from "../config/s3";
import { ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { User } from "../models/user";
import { LogFile } from "../types/LogFile";

export async function fetchLogsFromS3(): Promise<LogFile[]> {
  const command = new ListObjectsV2Command({
    Bucket: process.env.BUCKET_NAME_LOG!,
    Prefix: "logs/",
  });

  const result = await s3.send(command);

  return (
    result.Contents?.map((file: LogFile) => ({
      Key: file.Key ?? "unknown",
      LastModified: file.LastModified ?? new Date(0),
      Size: file.Size ?? 0,
    })) ?? []
  );
}

export async function getLogFileContent(key: string): Promise<string> {
  if (!key) throw new Error("File key is required");

  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME_LOG!,
    Key: key,
  });

  const data = await s3.send(command);

  return await streamToString(data.Body as NodeJS.ReadableStream);
}
function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}
export async function listAllUsers(): Promise<User[]> {
  return await User.findAll();
}
