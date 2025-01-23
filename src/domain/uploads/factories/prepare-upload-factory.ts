import { PrepareUploadUseCase } from "../use-cases/prepare-upload-use-case";

export class PrepareUploadFactory {
  static create() {
    return new PrepareUploadUseCase();
  }
}
