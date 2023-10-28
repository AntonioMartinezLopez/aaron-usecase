import { Context, APIGatewayProxyEvent } from "aws-lambda";
import { ApiError } from "./apiError";

export default function handler(
    lambda: (evt: APIGatewayProxyEvent, context: Context) => Promise<string>
) {
    return async function (event: APIGatewayProxyEvent, context: Context) {
        let body, statusCode;

        try {
            // Run the Lambda
            body = await lambda(event, context);
            statusCode = 200;
        } catch (error) {

            // Set body
            body = JSON.stringify({
                error: error instanceof ApiError ? error.getMessage() : error instanceof Error ? error.message : String(error),
            });

            // Set status code
            statusCode = error instanceof ApiError ? error.getStatusCode() : 500;
        }

        // Return HTTP response
        return {
            body,
            statusCode,
        };
    };
}
