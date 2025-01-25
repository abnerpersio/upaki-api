import { Env } from "@/config/env";
import { HttpError } from "@/infra/errors/http-error";
import { dynamoClient } from "@/lib/dynamo";
import { s3 } from "@/lib/s3";
import { HttpRequest, HttpResponse, UseCase } from "@/types/http";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

type Data = {
  fileNames: string[];
};

const UPLOAD_TTL = 60 * 1000;

export class PrepareUploadUseCase implements UseCase {
  async execute(request: HttpRequest<Data>): Promise<HttpResponse> {
    const { fileNames } = request.body;

    if (!fileNames?.length) {
      throw new HttpError(400, "File name is required");
    }

    const urls = await Promise.all(
      fileNames.map(async (fileName) => {
        const fileKey = `uploads/${randomUUID()}-${fileName}`;

        const putObjectCommand = new PutObjectCommand({
          Bucket: Env.bucketName,
          Key: fileKey,
        });

        const putCommand = new PutCommand({
          TableName: Env.tableName,
          Item: {
            fileKey,
            originalFileName: fileName,
            status: "PENDING",
            createdAt: new Date().toISOString(),
            expiresAt: (Date.now() + UPLOAD_TTL).toString(),
          },
        });

        await dynamoClient.send(putCommand);

        return await getSignedUrl(s3, putObjectCommand, {
          expiresIn: Env.uploadExpiration,
        });
      })
    );

    return { status: 200, data: { urls } };
  }
}
