const test = require('ava')
const { stringify, parse } = require('./index')

test('exports functions', t => {
  t.is(typeof stringify, 'function')
  t.is(typeof parse, 'function')
})

test('parse returns an array of objects', t => {
  const arr = parse('1px')
  t.true(Array.isArray(arr))
  t.is(typeof arr[0], 'object')
})

test('parse gets full values', t => {
  const [ obj ] = parse('1px 2px 3px 4px rgba(5, 6, 7, .5)')
  t.is(obj.inset, false)
  t.is(obj.offsetX, 1)
  t.is(obj.offsetY, 2)
  t.is(obj.blurRadius, 3)
  t.is(obj.spreadRadius, 4)
  t.is(obj.color, 'rgba(5, 6, 7, .5)')
})

test('parse gets values without spread radius', t => {
  const [ obj ] = parse('1px 2px 3px rgba(5, 6, 7, .5)')
  t.is(obj.offsetX, 1)
  t.is(obj.offsetY, 2)
  t.is(obj.blurRadius, 3)
  t.is(obj.spreadRadius, undefined)
  t.is(obj.color, 'rgba(5, 6, 7, .5)')
})

test('parse gets values without blur radius', t => {
  const [ obj ] = parse('1px 2px rgba(5, 6, 7, .5)')
  t.is(obj.offsetX, 1)
  t.is(obj.offsetY, 2)
  t.is(obj.blurRadius, undefined)
  t.is(obj.spreadRadius, undefined)
  t.is(obj.color, 'rgba(5, 6, 7, .5)')
})

test('parse gets inset values ', t => {
  const [ obj ] = parse('inset 1px 2px 3px 4px rgba(5, 6, 7, .5)')
  t.is(obj.inset, true)
  t.is(obj.offsetX, 1)
  t.is(obj.offsetY, 2)
  t.is(obj.blurRadius, 3)
  t.is(obj.spreadRadius, 4)
  t.is(obj.color, 'rgba(5, 6, 7, .5)')
})

test('parse gets hsla values ', t => {
  const [ obj ] = parse('1px 2px 3px 4px hsla(160, 100%, 50%, .5)')
  t.is(obj.offsetX, 1)
  t.is(obj.offsetY, 2)
  t.is(obj.blurRadius, 3)
  t.is(obj.spreadRadius, 4)
  t.is(obj.color, 'hsla(160, 100%, 50%, .5)')
})

test('parse gets hex values ', t => {
  const [ obj ] = parse('1px 2px 3px 4px #f00')
  t.is(obj.offsetX, 1)
  t.is(obj.offsetY, 2)
  t.is(obj.blurRadius, 3)
  t.is(obj.spreadRadius, 4)
  t.is(obj.color, '#f00')
})

test('parse handles multiple shadows', t => {
  const arr = parse('0 0 0 32px tomato, 0 0 0 16px rgba(0, 0, 0, .25)')
  const [ a, b ] = arr
  t.is(arr.length, 2)
  t.is(a.inset, false)
  t.is(a.offsetX, 0)
  t.is(a.offsetY, 0)
  t.is(a.blurRadius, 0)
  t.is(a.spreadRadius, 32)
  t.is(a.color, 'tomato')
  t.is(b.inset, false)
  t.is(b.offsetX, 0)
  t.is(b.offsetY, 0)
  t.is(b.blurRadius, 0)
  t.is(b.spreadRadius, 16)
  t.is(b.color, 'rgba(0, 0, 0, .25)')
})

test('parse does not convert em values to numbers', t => {
  const [ obj ] = parse('0 .2em 1em tomato')
  t.is(obj.offsetX, 0)
  t.is(obj.offsetY, '.2em')
  t.is(obj.blurRadius, '1em')
})

test('parse properly handles zero values', t => {
  const [ a ] = parse('0 0 0 4px tomato')
  const [ b ] = parse('0 0 0 4px')
  const [ c ] = parse('0 0 0 0')
  t.is(a.offsetX, 0)
  t.is(a.offsetY, 0)
  t.is(a.blurRadius, 0)
  t.is(a.spreadRadius, 4)
  t.is(a.color, 'tomato')
  t.is(b.offsetX, 0)
  t.is(b.offsetY, 0)
  t.is(b.blurRadius, 0)
  t.is(b.spreadRadius, 4)
  t.is(b.color, undefined)
  t.is(c.offsetX, 0)
  t.is(c.offsetY, 0)
  t.is(c.blurRadius, 0)
  t.is(c.spreadRadius, 0)
  t.is(c.color, undefined)
})

test('parse does not interpret numbers as color', t => {
  const [ obj ] = parse('0 0 0 4px')
  t.is(obj.color, undefined)
  t.is(obj.spreadRadius, 4)
})

test('stringify returns a string', t => {
  const str = stringify([])
  t.is(typeof str, 'string')
})

test('stringify returns a box-shadow value', t => {
  const str = stringify([
    {
      offsetX: 0,
      offsetY: 0,
      blurRadius: 0,
      spreadRadius: '32px',
      color: 'tomato'
    }
  ])
  t.is(str, '0 0 0 32px tomato')
})

test('stringify handles multiple values', t => {
  const str = stringify([
    {
      offsetX: 0,
      offsetY: 0,
      blurRadius: 0,
      spreadRadius: '32px',
      color: 'tomato'
    },
    {
      inset: true,
      offsetX: 0,
      offsetY: 0,
      blurRadius: '4px',
      color: 'lime'
    }
  ])
  t.is(str, '0 0 0 32px tomato, inset 0 0 4px lime')
})

test('stringify converts numbers to pixels', t => {
  const str = stringify([
    {
      offsetX: 4,
      offsetY: 8,
      blurRadius: 0,
      color: 'tomato'
    }
  ])
  t.is(str, '4px 8px 0 tomato')
})

test('stringify handles partial values', t => {
  const a = stringify([
    {
      spreadRadius: 4,
      color: 'tomato'
    }
  ])
  const b = stringify([
    {
      offsetY: 4,
      spreadRadius: 4,
      color: 'tomato'
    }
  ])
  const c = stringify([
    {
      offsetX: 4,
      blurRadius: 3,
      color: 'tomato'
    }
  ])
  t.is(a, '0 0 0 4px tomato')
  t.is(b, '0 4px 0 4px tomato')
  t.is(c, '4px 0 3px tomato')
})

test('works both ways', t => {
  const str = '0 0 0 32px tomato'
  const arr = parse(str)
  const b = stringify(arr)
  t.is(str, b)
})
