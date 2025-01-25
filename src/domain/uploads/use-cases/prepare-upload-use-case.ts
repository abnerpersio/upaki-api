import { Env } from "@/config/env";
import { HttpError } from "@/infra/errors/http-error";
import { s3 } from "@/lib/s3";
import { HttpRequest, HttpResponse, UseCase } from "@/types/http";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

type Data = {
  fileNames: string[];
};

export class PrepareUploadUseCase implements UseCase {
  async execute(request: HttpRequest<Data>): Promise<HttpResponse> {
    const { fileNames } = request.body;

    if (!fileNames?.length) {
      throw new HttpError(400, "File name is required");
    }

    const urls = Promise.all(
      fileNames.map(async (fileName) => {
        const fileKey = `${randomUUID()}-${fileName}`;

        const command = new PutObjectCommand({
          Bucket: Env.bucketName,
          Key: fileKey,
        });

        return await getSignedUrl(s3, command, {
          expiresIn: Env.uploadExpiration,
        });
      })
    );

    return { status: 200, data: { urls } };
  }
}
