export function onUnhandledRequestDefault(request) {
    return {
        status: 404,
        headers: { "content-type": "application/json" },
        text: JSON.stringify({
            error: `Unknown route: ${request.method} ${request.url}`,
        }),
    };
}
