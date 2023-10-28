import handler from "@aaron-usecase/core/handler"
export const main = handler(async (_event) => {

    return JSON.stringify({
        status: 'alive',
        time: new Date().toISOString()
    });
});