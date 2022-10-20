import { smartEscape } from "./smartEscape.js";
export function finalize_source(source, format, url_suffix) {
    let source_to_sign;
    source = source.replace(/([^:])\/\//g, '$1/');
    if (source.match(/^https?:\//i)) {
        source = smartEscape(source);
        source_to_sign = source;
    }
    else {
        source = encodeURIComponent(decodeURIComponent(source)).replace(/%3A/g, ":").replace(/%2F/g, "/");
        source_to_sign = source;
        if (url_suffix) {
            if (url_suffix.match(/[\.\/]/)) {
                throw new Error('url_suffix should not include . or /');
            }
            source = source + '/' + url_suffix;
        }
        if (format != null) {
            source = source + '.' + format;
            source_to_sign = source_to_sign + '.' + format;
        }
    }
    return [source, source_to_sign];
}
