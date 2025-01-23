import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

export type MiddyEvent = Omit<
  APIGatewayProxyEventV2WithJWTAuthorizer,
  "body"
> & {
  body?: Record<string, unknown>;
};

export type DefaultData = Record<string, unknown> | undefined;

export type HttpRequest<
  TData extends DefaultData = undefined,
  TParams = Record<string, string>
> = {
  body: TData;
  params: TParams;
  query: Record<string, string>;
  userId: string | null;
};

export type HttpResponse =
  | {
      status: number;
      data?: Record<string, any>;
      message?: never;
    }
  | {
      status: number;
      message?: string;
      data?: never;
    };

export interface UseCase {
  execute(request: HttpRequest<any>): Promise<HttpResponse>;
}
