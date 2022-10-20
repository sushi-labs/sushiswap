function nodeBufferToArrayBuffer(buffer) {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }

    return ab;
}

function checkArgument(expression, message) {
    if (!expression) {
        throw message;
    }
}

export { nodeBufferToArrayBuffer, checkArgument };
