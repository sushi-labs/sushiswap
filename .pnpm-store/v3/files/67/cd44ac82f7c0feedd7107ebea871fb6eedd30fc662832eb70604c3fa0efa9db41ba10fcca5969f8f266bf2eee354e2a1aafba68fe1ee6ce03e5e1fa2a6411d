"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrettyError = exports.NowBuildError = void 0;
/**
 * This error should be thrown from a Builder in
 * order to stop the build and print a message.
 * This is necessary to avoid printing a stack trace.
 */
class NowBuildError extends Error {
    constructor({ message, code, link, action }) {
        super(message);
        this.hideStackTrace = true;
        this.code = code;
        this.link = link;
        this.action = action;
    }
}
exports.NowBuildError = NowBuildError;
function getPrettyError(obj) {
    const docsUrl = 'https://vercel.com/docs/configuration';
    try {
        const { dataPath, params, message: ajvMessage } = obj;
        const prop = getTopLevelPropertyName(dataPath);
        let message = dataPath && dataPath.startsWith('.') ? `\`${dataPath.slice(1)}\` ` : '';
        if (params && typeof params.additionalProperty === 'string') {
            const suggestion = getSuggestion(prop, params.additionalProperty);
            message += `should NOT have additional property \`${params.additionalProperty}\`. ${suggestion}`;
        }
        else if (params && typeof params.missingProperty === 'string') {
            message += `missing required property \`${params.missingProperty}\`.`;
        }
        else {
            message += `${ajvMessage}.`;
        }
        return new NowBuildError({
            code: 'DEV_VALIDATE_CONFIG',
            message: message,
            link: prop ? `${docsUrl}#project/${prop.toLowerCase()}` : docsUrl,
            action: 'View Documentation',
        });
    }
    catch (e) {
        return new NowBuildError({
            code: 'DEV_VALIDATE_CONFIG',
            message: `Failed to validate configuration.`,
            link: docsUrl,
            action: 'View Documentation',
        });
    }
}
exports.getPrettyError = getPrettyError;
/**
 * Get the top level property from the dataPath.
 * `.cleanUrls` => `cleanUrls`
 * `.headers[0].source` => `headers`
 * `.headers[0].headers[0]` => `headers`
 * `` => ``
 */
function getTopLevelPropertyName(dataPath) {
    if (dataPath && dataPath.startsWith('.')) {
        const lastIndex = dataPath.indexOf('[');
        return lastIndex > -1 ? dataPath.slice(1, lastIndex) : dataPath.slice(1);
    }
    return '';
}
const mapTypoToSuggestion = {
    '': {
        builder: 'builds',
        'build.env': '{ "build": { "env": {"name": "value"} } }',
        'builds.env': '{ "build": { "env": {"name": "value"} } }',
    },
    rewrites: { src: 'source', dest: 'destination' },
    redirects: { src: 'source', dest: 'destination', status: 'statusCode' },
    headers: { src: 'source', header: 'headers' },
    routes: {
        source: 'src',
        destination: 'dest',
        header: 'headers',
        method: 'methods',
    },
};
function getSuggestion(topLevelProp, additionalProperty) {
    const choices = mapTypoToSuggestion[topLevelProp];
    const choice = choices ? choices[additionalProperty] : undefined;
    return choice ? `Did you mean \`${choice}\`?` : 'Please remove it.';
}
