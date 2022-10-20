const busboy = require('busboy');
const { resolve } = require('path');
const streams = require("stream");

module.exports = function getFormDataMethod(File, limits) {
  function consumeStreamAsFile({
    name,
    filename,
    mimeType,
    fileStream,
    formData,
  }) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      fileStream.on('limit', () => {
        reject(new Error(`File size limit exceeded: ${limits.fileSize} bytes`));
      })
      fileStream.on('data', (chunk) => {
        chunks.push(...chunk);
      })
      fileStream.on('close', () => {
        if (fileStream.truncated) {
          reject(new Error(`File size limit exceeded: ${limits.fileSize} bytes`));
        }
        const file = new File([new Uint8Array(chunks)], filename, { type: mimeType });
        formData.set(name, file);
        resolve(file);
      });
    })
  }

  return function formData() {
    if (this.body == null) {
      return null;
    }
    const contentType = this.headers.get('Content-Type');
    const nodeReadable = this.body.on ? this.body : streams.Readable.from(this.body);
    const bb = busboy({
      headers: {
        'content-type': contentType
      },
      limits,
      defParamCharset: 'utf-8'
    });
    return new Promise((resolve, reject) => {
      const formData = new Map();
      bb.on('field', (name, value, { nameTruncated, valueTruncated }) => {
        if (nameTruncated) {
          reject(new Error(`Field name size exceeded: ${limits.fieldNameSize} bytes`));
        }
        if (valueTruncated) {
          reject(new Error(`Field value size exceeded: ${limits.fieldSize} bytes`));
        }
        formData.set(name, value)
      })
      bb.on('fieldsLimit', () => {
        reject(new Error(`Fields limit exceeded: ${limits.fields}`));
      })
      bb.on('file', (name, fileStream, { filename, mimeType }) => {
        let file$;
        if (limits && limits.fieldsFirst) {
          resolve(formData);
          const fakeFileObj = {
            name: filename,
            type: mimeType,
          }
          Object.setPrototypeOf(fakeFileObj, File.prototype);
          formData.set(name, new Proxy(fakeFileObj, {
            get: (target, prop) => {
              switch(prop) {
                case 'name':
                  return filename;
                case 'type':
                  return mimeType;
                case 'stream':
                  return () => fileStream;
                case 'size':
                  throw new Error(`Cannot access file size before consuming the stream.`);
                case 'slice':
                  throw new Error(`Cannot slice file before consuming the stream.`);
                case 'text':
                case 'arrayBuffer':
                  return () => {
                    if (!file$) {
                      file$ = consumeStreamAsFile({
                        name,
                        filename,
                        mimeType,
                        fileStream,
                        formData,
                      })
                    }
                    return file$.then(file => file[prop]());
                  }
              }
            },
          }))
        } else {
          if (!file$) {
            file$ = consumeStreamAsFile({
              name,
              filename,
              mimeType,
              fileStream,
              formData,
            })
          }
          file$.catch(reject);
        }
      })
      bb.on('filesLimit', () => {
        reject(new Error(`Files limit exceeded: ${limits.files}`));
      })
      bb.on('partsLimit', () => {
        reject(new Error(`Parts limit exceeded: ${limits.parts}`));
      })
      bb.on('close', () => {
        resolve(formData);
      });
      bb.on('error', err => {
        reject(err);
      })
      nodeReadable.pipe(bb);
    })
  }
}
