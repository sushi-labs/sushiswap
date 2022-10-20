"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormat = void 0;
function createFormat(opts = {}) {
    if (opts.customInspectSymbol === undefined) {
        opts.customInspectSymbol = Symbol.for('edge-runtime.inspect.custom');
    }
    if (opts.formatError === undefined) {
        opts.formatError = (error) => `[${Error.prototype.toString.call(error)}]`;
    }
    const { formatError, customInspectSymbol } = opts;
    function format(...args) {
        const [firstArg] = args;
        if (!kind(firstArg, 'string')) {
            if (hasCustomSymbol(firstArg, customInspectSymbol)) {
                return format(firstArg[customInspectSymbol]());
            }
            else {
                return args
                    .map((item) => inspect(item, { customInspectSymbol }))
                    .join(' ');
            }
        }
        let index = 1;
        let str = String(firstArg).replace(/%[sjdOoif%]/g, (token) => {
            if (token === '%%')
                return '%';
            if (index >= args.length)
                return token;
            switch (token) {
                case '%s': {
                    const arg = args[index++];
                    return hasCustomSymbol(arg, customInspectSymbol)
                        ? format(arg[customInspectSymbol]())
                        : String(arg);
                }
                case '%j':
                    return safeStringify(args[index++]);
                case '%d':
                    return String(Number(args[index++]));
                case '%O':
                    return inspect(args[index++], { customInspectSymbol });
                case '%o':
                    return inspect(args[index++], {
                        customInspectSymbol,
                        showHidden: true,
                        depth: 4,
                    });
                case '%i':
                    return String(parseInt(args[index++], 10));
                case '%f':
                    return String(parseFloat(args[index++]));
                default:
                    return token;
            }
        });
        for (let arg = args[index]; index < args.length; arg = args[++index]) {
            if (arg === null || !kind(arg, 'object')) {
                str += ' ' + arg;
            }
            else {
                str += ' ' + inspect(arg);
            }
        }
        return str;
    }
    function formatValue(ctx, value, recurseTimes) {
        if (hasCustomSymbol(value, customInspectSymbol)) {
            return format(value[customInspectSymbol]());
        }
        const formattedPrimitive = formatPrimitive(value);
        if (formattedPrimitive !== undefined) {
            return formattedPrimitive;
        }
        const keys = ctx.showHidden
            ? Object.getOwnPropertyNames(value)
            : Object.keys(value);
        const visibleKeys = new Set();
        keys.forEach((key) => visibleKeys.add(key));
        if (keys.length === 0) {
            if (kind(value, 'function')) {
                return `[Function${value.name ? ': ' + value.name : ''}]`;
            }
            else if (isRegExp(value)) {
                return RegExp.prototype.toString.call(value);
            }
            else if (isDate(value)) {
                return Date.prototype.toString.call(value);
            }
            else if (isError(value)) {
                return formatError(value);
            }
            else if (hasCustomSymbol(value, ctx.customInspectSymbol)) {
                return format(value[ctx.customInspectSymbol]());
            }
        }
        let base = '';
        if (kind(value, 'function')) {
            base = `[Function${value.name ? ': ' + value.name : ''}]`;
        }
        else if (isRegExp(value)) {
            base = ' ' + RegExp.prototype.toString.call(value);
        }
        else if (isDate(value)) {
            base = ' ' + Date.prototype.toUTCString.call(value);
        }
        else if (isError(value)) {
            base = ' ' + formatError(value);
        }
        else if (hasCustomSymbol(value, ctx.customInspectSymbol)) {
            base = ' ' + value[ctx.customInspectSymbol]();
        }
        const braces = Array.isArray(value) ? ['[', ']'] : ['{', '}'];
        if (keys.length === 0 && (!Array.isArray(value) || value.length === 0)) {
            return braces[0] + base + braces[1];
        }
        if (recurseTimes && recurseTimes < 0) {
            return isRegExp(value)
                ? RegExp.prototype.toString.call(value)
                : '[Object]';
        }
        ctx.seen.push(value);
        const output = Array.isArray(value)
            ? formatArray(ctx, value, recurseTimes, visibleKeys, keys)
            : keys.map((key) => formatProperty(ctx, value, recurseTimes, visibleKeys, key, false));
        ctx.seen.pop();
        return reduceToSingleString(output, base, braces);
    }
    function inspect(value, opts) {
        opts = Object.assign({ seen: [], depth: 2 }, opts);
        return formatValue(opts, value, opts.depth);
    }
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        let name;
        let str;
        const desc = Object.getOwnPropertyDescriptor(value, key) || {
            value: value[key],
        };
        if (desc.get) {
            str = desc.set ? '[Getter/Setter]' : '[Getter]';
        }
        else if (desc.set) {
            str = '[Setter]';
        }
        if (!visibleKeys.has(key)) {
            name = '[' + key + ']';
        }
        if (!str) {
            if (ctx.seen.indexOf(desc.value) < 0) {
                str = formatValue(ctx, desc.value, recurseTimes === null || recurseTimes === undefined
                    ? null
                    : recurseTimes - 1);
                if (str.indexOf('\n') > -1) {
                    if (array) {
                        str = str
                            .split('\n')
                            .map((line) => `  ${line}`)
                            .join('\n')
                            .slice(2);
                    }
                    else {
                        str =
                            '\n' +
                                str
                                    .split('\n')
                                    .map((line) => `   ${line}`)
                                    .join('\n');
                    }
                }
            }
            else {
                str = '[Circular]';
            }
        }
        if (name === undefined) {
            if (array && key.match(/^\d+$/)) {
                return str;
            }
            name = JSON.stringify('' + key);
            if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                name = name.slice(1, -1);
            }
            else {
                name = name
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"')
                    .replace(/(^"|"$)/g, "'");
            }
        }
        return `${name}: ${str}`;
    }
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        const output = [];
        for (let index = 0; index < value.length; ++index) {
            if (Object.prototype.hasOwnProperty.call(value, String(index))) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(index), true));
            }
            else {
                output.push('');
            }
        }
        keys.forEach((key) => {
            if (!key.match(/^\d+$/)) {
                output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
            }
        });
        return output;
    }
    return format;
}
exports.createFormat = createFormat;
function formatPrimitive(value) {
    if (value === null)
        return 'null';
    if (value === undefined)
        return 'undefined';
    if (kind(value, 'string')) {
        return `'${JSON.stringify(value)
            .replace(/^"|"$/g, '')
            .replace(/'/g, "\\'")
            .replace(/\\"/g, '"')}'`;
    }
    if (kind(value, 'boolean'))
        return '' + value;
    if (kind(value, 'number'))
        return '' + value;
    if (kind(value, 'bigint'))
        return '' + value;
    if (kind(value, 'symbol'))
        return value.toString();
}
function hasCustomSymbol(value, customInspectSymbol) {
    return (value !== null &&
        kind(value, 'object') &&
        customInspectSymbol in value &&
        kind(value[customInspectSymbol], 'function'));
}
function kind(value, type) {
    return typeof value === type;
}
function isRegExp(value) {
    return (kind(value, 'object') &&
        Object.prototype.toString.call(value) === '[object RegExp]');
}
function isDate(value) {
    return (kind(value, 'object') &&
        Object.prototype.toString.call(value) === '[object Date]');
}
function isError(value) {
    return (kind(value, 'object') &&
        (Object.prototype.toString.call(value) === '[object Error]' ||
            value instanceof Error));
}
function reduceToSingleString(output, base, braces) {
    const length = output.reduce((prev, cur) => {
        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
    }, 0);
    if (length > 60) {
        return (braces[0] +
            (base === '' ? '' : base + '\n ') +
            ' ' +
            output.join(',\n  ') +
            ' ' +
            braces[1]);
    }
    return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}
function safeStringify(object) {
    if (Array.isArray(object)) {
        object = object.map((element) => JSON.parse(JSON.stringify(element, makeCircularReplacer())));
    }
    return JSON.stringify(object, makeCircularReplacer());
}
function makeCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (value !== null && kind(value, 'object')) {
            if (seen.has(value))
                return '[Circular]';
            seen.add(value);
        }
        return value;
    };
}
//# sourceMappingURL=index.js.map