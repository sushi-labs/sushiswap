"use strict";
exports.__esModule = true;
exports.withXMLResponse = void 0;
/**
 * Send XML response
 * @param ctx
 * @param content
 * @returns
 */
var withXMLResponse = function (ctx, content) {
    if (ctx === null || ctx === void 0 ? void 0 : ctx.res) {
        var res = ctx.res;
        // Set header
        res.setHeader('Content-Type', 'text/xml');
        // Write the sitemap context to resonse
        res.write(content);
        // End response
        res.end();
    }
    // Empty props
    return {
        props: {}
    };
};
exports.withXMLResponse = withXMLResponse;
