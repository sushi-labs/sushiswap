json-bigint-patch
===========

[![NPM](https://nodei.co/npm/json-bigint-patch.png?downloads=true&stars=true)](https://nodei.co/npm/json-bigint-patch/)

JSON.parse/stringify with bigints support. Based on Douglas Crockford [JSON.js](https://github.com/douglascrockford/JSON-js) package and [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) feature of JavaScript.

While most JSON parsers assume numeric values have same precision restrictions as IEEE 754 double, JSON specification _does not_ say anything about number precision. Any floating point number in decimal (optionally scientific) notation is valid JSON value. It's a good idea to serialize values which might fall out of IEEE 754 integer precision as strings in your JSON api, but `{ "value" : 9223372036854775807}`, for example, is still a valid RFC4627 JSON string, and in most JS runtimes the result of `JSON.parse` is this object: `{ value: 9223372036854776000 }`

==========

example:

```js

var json = '{ "value" : 9223372036854775807, "v2": 123 }';
console.log('Input:', json);
console.log('');

console.log('JavaScript built-in JSON:')
var r = JSON.parse(json);
console.log('Native JSON.parse(input).value : ', r.value.toString());
console.log('Native JSON.stringify(JSON.parse(input)):', JSON.stringify(r));

require('json-bigint-patch');

console.log('\n\nPatched JSON:');
var r1 = JSON.parse(json);
console.log('Patched JSON.parse(input).value : ', r1.value.toString());
console.log('Patched JSON.stringify(JSON.parse(input)):', JSON.stringify(r1));
```

Output:

```
Input: { "value" : 9223372036854775807, "v2": 123 }

JavaScript built-in JSON:
Native JSON.parse(input).value :  9223372036854776000
Native JSON.stringify(JSON.parse(input)): {"value":9223372036854776000,"v2":123}


Patched JSON:
Patched JSON.parse(input).value :  9223372036854775807
Patched JSON.stringify(JSON.parse(input)): {"value":9223372036854775807,"v2":123}
```

### Links:
- [RFC4627: The application/json Media Type for JavaScript Object Notation (JSON)](http://www.ietf.org/rfc/rfc4627.txt)
- [Re: \[Json\] Limitations on number size?](http://www.ietf.org/mail-archive/web/json/current/msg00297.html)
- [Is there any proper way to parse JSON with large numbers? (long, bigint, int64)](http://stackoverflow.com/questions/18755125/node-js-is-there-any-proper-way-to-parse-json-with-large-numbers-long-bigint)
- [What is JavaScript's Max Int? What's the highest Integer value a Number can go to without losing precision?](http://stackoverflow.com/questions/307179/what-is-javascripts-max-int-whats-the-highest-integer-value-a-number-can-go-t)
- [Large numbers erroneously rounded in Javascript](http://stackoverflow.com/questions/1379934/large-numbers-erroneously-rounded-in-javascript)

