import { PrepareUploadFactory } from "@/domain/uploads/factories/prepare-upload-factory";
import { httpAdapt } from "@/infra/adapters/http";

export const handler = httpAdapt(PrepareUploadFactory.create());
