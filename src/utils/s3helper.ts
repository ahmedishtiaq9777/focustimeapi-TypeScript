// src/utils/s3helpers.ts
import { s3 } from "../config/s3";
import {
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Upload a task image to S3
 */
export async function uploadTaskImage(
  buffer: Buffer,
  key: string,
  bucketName: string,
  contentType: string
): Promise<void> {
  const params: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
}

/**
 * Generate a signed URL for a task image
 */
export async function getTaskImageUrl(
  key: string,
  bucketName: string,
  expiresIn: number = 3600
): Promise<string> {
  const params: GetObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  return getSignedUrl(s3, command, { expiresIn });
}
