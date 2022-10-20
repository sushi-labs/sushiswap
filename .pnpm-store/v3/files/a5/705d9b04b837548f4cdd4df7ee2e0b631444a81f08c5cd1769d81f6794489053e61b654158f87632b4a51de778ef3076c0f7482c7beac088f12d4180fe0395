'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const lodashGet = _interopDefault(require('lodash.get'));
const JsonPointer = _interopDefault(require('json-pointer'));
const dayjs = _interopDefault(require('dayjs'));

const defaultOptions = {
    delimiter: ['{', '}'],
};

const uppercase = value => value.toUpperCase();

const lowercase = value => value.toLowerCase();

const titlecase = value => value.replace(/\w\S*/g, s => s.charAt(0).toUpperCase() + s.substr(1).toLowerCase());

const defaultModifiers = [
    {
        key: 'uppercase',
        transform: uppercase,
    },
    {
        key: 'lowercase',
        transform: lowercase,
    },
    {
        key: 'title',
        transform: titlecase,
    },
];

class Interpolator {
    constructor(options = defaultOptions) {
        this.options = options;
        this.modifiers = [];
        this.aliases = [];
        this.registerBuiltInModifiers();
    }
    registerBuiltInModifiers() {
        defaultModifiers.forEach(modifier => this.registerModifier(modifier.key, modifier.transform));
        return this;
    }
    get delimiter() {
        return this.options.delimiter;
    }
    delimiterStart() {
        return this.options.delimiter[0];
    }
    delimiterEnd() {
        return this.options.delimiter[1];
    }
    registerModifier(key, transform) {
        if (!key) {
            return new Error('Modifiers must have a key');
        }
        if (typeof transform !== 'function') {
            return new Error('Modifiers must have a transformer. Transformers must be a function that returns a value.');
        }
        this.modifiers.push({ key: key.toLowerCase(), transform });
        return this;
    }
    parseRules(str) {
        const regex = `${this.delimiterStart()}([^}]+)${this.delimiterEnd()}`;
        const execRegex = new RegExp(regex, 'gi');
        const matches = str.match(execRegex);
        // const parsableMatches = matches.map((match) => ({ key: removeDelimiter(match), replaceWith: match }));
        return matches ? this.extractRules(matches) : [];
    }
    extractRules(matches) {
        return matches.map(match => {
            const alternativeText = this.getAlternativeText(match);
            const modifiers = this.getModifiers(match);
            return {
                key: this.getKeyFromMatch(match),
                replace: match,
                modifiers,
                alternativeText,
            };
        });
    }
    getKeyFromMatch(match) {
        const removeReservedSymbols = [':', '|'];
        return this.removeDelimiter(removeReservedSymbols.reduce((val, sym) => (val.indexOf(sym) > 0 ? this.removeAfter(val, sym) : val), match));
    }
    removeDelimiter(val) {
        return val.replace(new RegExp(this.delimiterStart(), 'g'), '').replace(new RegExp(this.delimiterEnd(), 'g'), '');
    }
    removeAfter(str, val) {
        return str.substring(0, str.indexOf(val));
    }
    extractAfter(str, val) {
        return str.substring(str.indexOf(val) + 1);
    }
    getAlternativeText(str) {
        if (str.indexOf(':') > 0) {
            const altText = this.removeDelimiter(this.extractAfter(str, ':'));
            if (altText.indexOf('|') > 0) {
                return this.removeAfter(altText, '|');
            }
            return altText;
        }
        return '';
    }
    getModifiers(str) {
        if (str.indexOf('|') > 0) {
            const strModifiers = this.removeDelimiter(this.extractAfter(str, '|')).split(',');
            return strModifiers.map(modifier => this.getModifier(modifier.toLowerCase()));
        }
        return [];
    }
    parse(str = '', data = {}) {
        const rules = this.parseRules(str);
        if (rules && rules.length > 0) {
            return this.parseFromRules(str, data, rules);
        }
        return str;
    }
    parseFromRules(str, data, rules) {
        return rules.reduce((reducedStr, rule) => this.applyRule(reducedStr, rule, data), str);
    }
    applyRule(str, rule, data = {}) {
        const dataToReplace = this.applyData(rule.key, data);
        if (dataToReplace) {
            return str.replace(rule.replace, this.applyModifiers(rule.modifiers, dataToReplace, data));
        }
        else if (rule.alternativeText) {
            return str.replace(rule.replace, this.applyModifiers(rule.modifiers, rule.alternativeText, data));
        }
        const defaultModifier = this.applyModifiers(rule.modifiers, rule.key, data);
        if (defaultModifier === rule.key) {
            return str.replace(rule.replace, '');
        }
        return str.replace(rule.replace, defaultModifier);
    }
    getFromAlias(key) {
        return this.aliases.find(alias => alias.key.toLowerCase() === key.toLowerCase());
    }
    applyData(key, data) {
        const [prop, ptr] = key.split('#');
        const propData = lodashGet(data, prop);
        if (ptr) {
            try {
                return JsonPointer.get(propData, ptr);
            }
            catch (e) {
                if (e.message.startsWith('Invalid reference')) {
                    return undefined;
                }
                throw e;
            }
        }
        return propData;
    }
    getModifier(key) {
        return this.modifiers.find(modifier => modifier.key === key);
    }
    applyModifiers(modifiers, str, rawData) {
        try {
            const transformers = modifiers.map(modifier => modifier && modifier.transform);
            return transformers.reduce((str, transform) => (transform ? transform(str, rawData) : str), str);
        }
        catch (e) {
            console.error(`An error occurred while applying modifiers to ${str}`, modifiers, e);
            return str;
        }
    }
    addAlias(key, ref) {
        if (typeof ref === 'function') {
            this.aliases.push({ key, ref: ref() });
        }
        else {
            this.aliases.push({ key, ref });
        }
        return this;
    }
    removeAlias(key) {
        this.aliases = this.aliases.filter(alias => alias.key !== key);
        return this;
    }
}

function getInterpolationKeys(...interpolationStrings) {
    return interpolationStrings.reduce((keys, str) => [...keys, ...(str ? stringInterpolator.parseRules(str).map((match) => match.key) : [])], []);
}
function parseInterpolationStrings(interpolationStrings, argTypeMap) {
    const interpolationKeys = getInterpolationKeys(...interpolationStrings);
    const args = {};
    const contextVariables = {};
    for (const interpolationKey of interpolationKeys) {
        const interpolationKeyParts = interpolationKey.split('.');
        const varName = interpolationKeyParts[interpolationKeyParts.length - 1];
        const initialObject = interpolationKeyParts[0];
        const argType = argTypeMap && varName in argTypeMap ? argTypeMap[varName] : interpolationKeyParts.length > 2 ? 'JSON' : 'ID';
        switch (initialObject) {
            case 'args':
                args[varName] = {
                    type: argType,
                };
                break;
            case 'context':
                contextVariables[varName] = `Scalars['${argType}']`;
                break;
        }
    }
    return {
        args,
        contextVariables,
    };
}
function getInterpolatedStringFactory(nonInterpolatedString) {
    return resolverData => stringInterpolator.parse(nonInterpolatedString, resolverData);
}
function getInterpolatedHeadersFactory(nonInterpolatedHeaders = {}) {
    return resolverData => {
        const headers = {};
        for (const headerName in nonInterpolatedHeaders) {
            const headerValue = nonInterpolatedHeaders[headerName];
            if (headerValue) {
                headers[headerName.toLowerCase()] = stringInterpolator.parse(headerValue, resolverData);
            }
        }
        return headers;
    };
}

const hashCode = (s) => s.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
function hashObject(value) {
    return hashCode(JSON.stringify(value)).toString();
}
const stringInterpolator = new Interpolator({
    delimiter: ['{', '}'],
});
stringInterpolator.addAlias('typeName', 'info.parentType.name');
stringInterpolator.addAlias('type', 'info.parentType.name');
stringInterpolator.addAlias('parentType', 'info.parentType.name');
stringInterpolator.addAlias('fieldName', 'info.fieldName');
stringInterpolator.registerModifier('date', (formatStr) => dayjs(new Date()).format(formatStr));
stringInterpolator.registerModifier('hash', (value) => hashObject(value));
stringInterpolator.registerModifier('base64', (value) => {
    if (globalThis.Buffer.from) {
        return globalThis.Buffer.from(value).toString('base64');
    }
    else {
        return btoa(value);
    }
});

exports.Interpolator = Interpolator;
exports.getInterpolatedHeadersFactory = getInterpolatedHeadersFactory;
exports.getInterpolatedStringFactory = getInterpolatedStringFactory;
exports.getInterpolationKeys = getInterpolationKeys;
exports.hashObject = hashObject;
exports.parseInterpolationStrings = parseInterpolationStrings;
exports.stringInterpolator = stringInterpolator;
