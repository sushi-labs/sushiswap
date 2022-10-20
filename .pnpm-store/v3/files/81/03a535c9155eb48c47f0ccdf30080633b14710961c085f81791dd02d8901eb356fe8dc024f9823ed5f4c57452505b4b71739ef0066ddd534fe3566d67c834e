export function sendResponse(octokitResponse, response) {
    response.writeHead(octokitResponse.status, octokitResponse.headers);
    response.end(octokitResponse.text);
}
