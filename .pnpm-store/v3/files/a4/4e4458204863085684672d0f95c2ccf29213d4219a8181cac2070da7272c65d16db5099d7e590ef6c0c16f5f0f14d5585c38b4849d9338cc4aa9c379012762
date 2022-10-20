const { fileURLToPath } = require('url');
const { createReadStream } = require('fs');
module.exports = function handleFileRequest(url, Response) {
    return new Response(
        createReadStream(fileURLToPath(url)),
    )
}
