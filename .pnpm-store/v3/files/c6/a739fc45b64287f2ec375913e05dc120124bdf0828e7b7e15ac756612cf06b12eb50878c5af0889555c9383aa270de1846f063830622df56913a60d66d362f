import { HandlerOptions } from "../types";
import { OAuthApp } from "../../index";
import { Options, ClientType } from "../../types";
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from "aws-lambda";
export declare function createAWSLambdaAPIGatewayV2Handler(app: OAuthApp<Options<ClientType>>, { pathPrefix, onUnhandledRequest, }?: HandlerOptions & {
    onUnhandledRequest?: (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyStructuredResultV2>;
}): (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyStructuredResultV2>;
