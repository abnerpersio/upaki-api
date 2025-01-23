import { errorHandler } from '@/infra/middlewares/error-handler';
import { HttpResponse, MiddyEvent, UseCase } from '@/types/http';
import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpMultipartBodyParser from '@middy/http-multipart-body-parser';
import httpResponseSerializer from '@middy/http-response-serializer';

function prepareResponseBody(result: HttpResponse) {
  if (!result.data && !result.message) return undefined;

  if (result.message) {
    return { message: result.message };
  }

  return { ...result.data };
}

export function httpAdapt(useCase: UseCase) {
  return middy()
    .use(errorHandler())
    .use(httpJsonBodyParser({ disableContentTypeError: true }))
    .use(httpMultipartBodyParser({ disableContentTypeError: true }))
    .use(
      httpResponseSerializer({
        defaultContentType: 'application/json',
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body),
          },
        ],
      }),
    )
    .use(httpCors())
    .handler(async (event: MiddyEvent) => {
      const { body, queryStringParameters, pathParameters, requestContext } = event;
      const userId = (requestContext.authorizer?.jwt?.claims?.username as string | null) ?? null;

      const result = await useCase.execute({
        query: queryStringParameters,
        params: pathParameters,
        body: body ?? {},
        userId,
      } as any);

      return {
        statusCode: result.status,
        body: prepareResponseBody(result),
      };
    });
}
