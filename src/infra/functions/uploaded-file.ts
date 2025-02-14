import { UploadedFileFactory } from "@/domain/uploads/factories/uploaded-file-factory";
import type { S3CreateEvent } from "aws-lambda";

export const handler = async (event: S3CreateEvent) => {
  const useCase = UploadedFileFactory.create();
  await useCase.execute({
    fileKeys: event.Records.map(({ s3 }) => s3.object.key),
  });
};
