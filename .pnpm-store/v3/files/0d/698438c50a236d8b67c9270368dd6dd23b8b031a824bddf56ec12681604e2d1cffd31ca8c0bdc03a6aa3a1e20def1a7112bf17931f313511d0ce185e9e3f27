export function parseRequest(request) {
    const { method } = request.requestContext.http;
    let url = request.rawPath;
    const { stage } = request.requestContext;
    if (url.startsWith("/" + stage))
        url = url.substring(stage.length + 1);
    if (request.rawQueryString)
        url += "?" + request.rawQueryString;
    const headers = request.headers;
    const text = async () => request.body || "";
    return { method, url, headers, text };
}
