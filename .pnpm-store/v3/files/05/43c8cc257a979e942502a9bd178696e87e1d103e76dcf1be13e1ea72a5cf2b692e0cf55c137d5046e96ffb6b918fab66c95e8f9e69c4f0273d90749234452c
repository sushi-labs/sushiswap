/* jshint esversion: 6 */

const tap = require('tap');
const and = require('.');

tap.equal(and(['John', 'Frank', 'Jimmy']), 'John, Frank & Jimmy');

tap.equal(and(['John', 'Frank']), 'John & Frank');

tap.equal(and(['Frank']), 'Frank');

tap.equal(and('Frank'), 'Frank');

tap.equal(and(['John', 'Frank', 'Jimmy'], 'and'), 'John, Frank and Jimmy');

tap.equal(and(['John', 'Frank', 'Jimmy'], 'or'), 'John, Frank or Jimmy');

tap.equal(and(['John', 'Frank', 'Jimmy'], 'and', true), 'John, Frank, and Jimmy');

tap.equal(and(['John', 'Frank'], 'and', true), 'John and Frank');
