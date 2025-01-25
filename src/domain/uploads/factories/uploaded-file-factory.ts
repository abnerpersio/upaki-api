import { UploadedFileUseCase } from "../use-cases/uploaded-file-use-case";

export class UploadedFileFactory {
  static create() {
    return new UploadedFileUseCase();
  }
}
