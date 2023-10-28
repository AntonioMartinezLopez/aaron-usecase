import { ApiError } from "@aaron-usecase/core/apiError";
import handler from "@aaron-usecase/core/handler"
export const main = handler(async (event) => {

    if (!event.pathParameters?.name) {
        throw new ApiError("Missing name path parameter", 400);
    }

    let name = event.pathParameters.name;


    return JSON.stringify({
        message: `Hi, ${name}`

    });
});