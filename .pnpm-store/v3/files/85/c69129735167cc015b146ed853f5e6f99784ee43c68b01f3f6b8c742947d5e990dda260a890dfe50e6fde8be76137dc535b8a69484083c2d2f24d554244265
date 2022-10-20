"use strict";
/*--------------------------------------------------------------------------

@sinclair/typebox/value

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueCast = void 0;
const Types = require("../typebox");
const create_1 = require("./create");
const check_1 = require("./check");
// --------------------------------------------------------------------------
// Specialized Union Cast. Because a union can be one of many varying types
// with properties potentially overlapping, we need a strategy to determine
// which of those types we should cast into. This strategy needs to factor
// the value provided by the user to make this decision.
//
// The following will score each union type found within the types anyOf
// array. Typically this is executed for objects only, so the score is a
// essentially a tally of how many properties are valid. The reasoning
// here is the discriminator field would tip the scales in favor of that
// union if other properties overlap and match.
// --------------------------------------------------------------------------
var UnionValueCast;
(function (UnionValueCast) {
    function Score(schema, references, value) {
        let score = 0;
        if (schema[Types.Kind] === 'Object' && typeof value === 'object' && value !== null) {
            const objectSchema = schema;
            const entries = globalThis.Object.entries(objectSchema.properties);
            score += entries.reduce((acc, [key, schema]) => acc + (check_1.ValueCheck.Check(schema, references, value[key]) ? 1 : 0), 0);
        }
        return score;
    }
    function Select(schema, references, value) {
        let select = schema.anyOf[0];
        let best = 0;
        for (const subschema of schema.anyOf) {
            const score = Score(subschema, references, value);
            if (score > best) {
                select = subschema;
                best = score;
            }
        }
        return select;
    }
    function Create(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : ValueCast.Cast(Select(schema, references, value), references, value);
    }
    UnionValueCast.Create = Create;
})(UnionValueCast || (UnionValueCast = {}));
var ValueCast;
(function (ValueCast) {
    function Any(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Array(schema, references, value) {
        if (check_1.ValueCheck.Check(schema, references, value))
            return value;
        if (!globalThis.Array.isArray(value))
            return create_1.ValueCreate.Create(schema, references);
        return value.map((val) => Visit(schema.items, references, val));
    }
    function Boolean(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Constructor(schema, references, value) {
        if (check_1.ValueCheck.Check(schema, references, value))
            return create_1.ValueCreate.Create(schema, references);
        const required = new Set(schema.returns.required || []);
        const result = function () { };
        for (const [key, property] of globalThis.Object.entries(schema.returns.properties)) {
            if (!required.has(key) && value.prototype[key] === undefined)
                continue;
            result.prototype[key] = Visit(property, references, value.prototype[key]);
        }
        return result;
    }
    function Enum(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Function(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Integer(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Literal(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Null(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Number(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Object(schema, references, value) {
        if (check_1.ValueCheck.Check(schema, references, value))
            return value;
        if (value === null || typeof value !== 'object')
            return create_1.ValueCreate.Create(schema, references);
        const required = new Set(schema.required || []);
        const result = {};
        for (const [key, property] of globalThis.Object.entries(schema.properties)) {
            if (!required.has(key) && value[key] === undefined)
                continue;
            result[key] = Visit(property, references, value[key]);
        }
        return result;
    }
    function Promise(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Record(schema, references, value) {
        if (check_1.ValueCheck.Check(schema, references, value))
            return value;
        if (value === null || typeof value !== 'object' || globalThis.Array.isArray(value))
            return create_1.ValueCreate.Create(schema, references);
        const subschemaKey = globalThis.Object.keys(schema.patternProperties)[0];
        const subschema = schema.patternProperties[subschemaKey];
        const result = {};
        for (const [propKey, propValue] of globalThis.Object.entries(value)) {
            result[propKey] = Visit(subschema, references, propValue);
        }
        return result;
    }
    function Recursive(schema, references, value) {
        throw new Error('ValueCast.Recursive: Cannot cast recursive schemas');
    }
    function Ref(schema, references, value) {
        const reference = references.find((reference) => reference.$id === schema.$ref);
        if (reference === undefined)
            throw new Error(`ValueCast.Ref: Cannot find schema with $id '${schema.$ref}'.`);
        return Visit(reference, references, value);
    }
    function Self(schema, references, value) {
        const reference = references.find((reference) => reference.$id === schema.$ref);
        if (reference === undefined)
            throw new Error(`ValueCast.Self: Cannot find schema with $id '${schema.$ref}'.`);
        return Visit(reference, references, value);
    }
    function String(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Tuple(schema, references, value) {
        if (check_1.ValueCheck.Check(schema, references, value))
            return value;
        if (!globalThis.Array.isArray(value))
            return create_1.ValueCreate.Create(schema, references);
        if (schema.items === undefined)
            return [];
        return schema.items.map((schema, index) => Visit(schema, references, value[index]));
    }
    function Undefined(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Union(schema, references, value) {
        return UnionValueCast.Create(schema, references, value);
    }
    function Uint8Array(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Unknown(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Void(schema, references, value) {
        return check_1.ValueCheck.Check(schema, references, value) ? value : create_1.ValueCreate.Create(schema, references);
    }
    function Visit(schema, references, value) {
        const anyReferences = schema.$id === undefined ? references : [schema, ...references];
        const anySchema = schema;
        switch (schema[Types.Kind]) {
            case 'Any':
                return Any(anySchema, anyReferences, value);
            case 'Array':
                return Array(anySchema, anyReferences, value);
            case 'Boolean':
                return Boolean(anySchema, anyReferences, value);
            case 'Constructor':
                return Constructor(anySchema, anyReferences, value);
            case 'Enum':
                return Enum(anySchema, anyReferences, value);
            case 'Function':
                return Function(anySchema, anyReferences, value);
            case 'Integer':
                return Integer(anySchema, anyReferences, value);
            case 'Literal':
                return Literal(anySchema, anyReferences, value);
            case 'Null':
                return Null(anySchema, anyReferences, value);
            case 'Number':
                return Number(anySchema, anyReferences, value);
            case 'Object':
                return Object(anySchema, anyReferences, value);
            case 'Promise':
                return Promise(anySchema, anyReferences, value);
            case 'Record':
                return Record(anySchema, anyReferences, value);
            case 'Rec':
                return Recursive(anySchema, anyReferences, value);
            case 'Ref':
                return Ref(anySchema, anyReferences, value);
            case 'Self':
                return Self(anySchema, anyReferences, value);
            case 'String':
                return String(anySchema, anyReferences, value);
            case 'Tuple':
                return Tuple(anySchema, anyReferences, value);
            case 'Undefined':
                return Undefined(anySchema, anyReferences, value);
            case 'Union':
                return Union(anySchema, anyReferences, value);
            case 'Uint8Array':
                return Uint8Array(anySchema, anyReferences, value);
            case 'Unknown':
                return Unknown(anySchema, anyReferences, value);
            case 'Void':
                return Void(anySchema, anyReferences, value);
            default:
                throw Error(`ValueCast.Visit: Unknown schema kind '${schema[Types.Kind]}'`);
        }
    }
    ValueCast.Visit = Visit;
    function Cast(schema, references, value) {
        return schema.$id === undefined ? Visit(schema, references, value) : Visit(schema, [schema, ...references], value);
    }
    ValueCast.Cast = Cast;
})(ValueCast = exports.ValueCast || (exports.ValueCast = {}));
