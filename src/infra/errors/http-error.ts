export class HttpError extends Error {
  constructor(public readonly statusCode: number, message?: string) {
    super(message || 'Http error');
    this.name = 'HttpError';
  }
}
