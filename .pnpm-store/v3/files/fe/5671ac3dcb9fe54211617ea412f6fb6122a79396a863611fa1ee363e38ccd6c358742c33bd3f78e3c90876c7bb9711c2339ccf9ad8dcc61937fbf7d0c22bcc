import * as queryStringUtils from "query-string";
export function getQueryString(url) {
    const pathEnd = url.indexOf("?") !== -1 ? url.indexOf("?") : undefined;
    const queryString = typeof pathEnd !== "undefined" ? url.substr(pathEnd) : "";
    return queryString;
}
export function appendToQueryString(queryString, newQueryParams) {
    let queryParams = parseQueryString(queryString);
    queryParams = Object.assign(Object.assign({}, queryParams), newQueryParams);
    queryString = formatQueryString(queryParams);
    return queryString;
}
export function parseQueryString(queryString) {
    return queryStringUtils.parse(queryString);
}
export function formatQueryString(queryParams) {
    return queryStringUtils.stringify(queryParams);
}
//# sourceMappingURL=url.js.map