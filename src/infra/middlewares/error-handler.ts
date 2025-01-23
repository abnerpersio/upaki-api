import { HttpError } from '@/infra/errors/http-error';
import { MiddlewareObj } from '@middy/core';

export function errorHandler(): MiddlewareObj {
  return {
    before: () => {
      // TODO: add sentry context
    },
    onError: async (event) => {
      const { error } = event;

      if (!(error instanceof HttpError)) {
        console.warn(`[Error handler] unhandled error`, error);
      }

      event.response = event.response ?? {};
      const headers = { ...event.response?.headers, 'Content-Type': 'application/json' };
      const statusCode = error instanceof HttpError ? error.statusCode : 500;
      const message = error instanceof HttpError ? error.message : 'Internal server error';

      event.response.statusCode = statusCode;
      event.response.body = JSON.stringify({ message });
      event.response.headers = headers;
      return event.response;
    },
  };
}
