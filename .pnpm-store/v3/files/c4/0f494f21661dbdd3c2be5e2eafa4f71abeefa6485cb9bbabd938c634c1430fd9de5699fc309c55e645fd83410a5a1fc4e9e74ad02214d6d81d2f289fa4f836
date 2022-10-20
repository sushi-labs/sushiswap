const postcss = require('postcss')

let expectedV3 = `
.aspect-w-1 {
    position: relative;
    padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
    --tw-aspect-w: 1
}
.aspect-w-1 > * {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
}
.aspect-w-2 {
    position: relative;
    padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
    --tw-aspect-w: 2
}
.aspect-w-2 > * {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
}
.aspect-h-2 {
    --tw-aspect-h: 2
}
.aspect-w-\\[123\\] {
    position: relative;
    padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
    --tw-aspect-w: 123
}
.aspect-w-\\[123\\] > * {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
}
.aspect-w-\\[var\\(--width\\)\\] {
    position: relative;
    padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%);
    --tw-aspect-w: var(--width)
}
.aspect-w-\\[var\\(--width\\)\\] > * {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0
}
.aspect-h-\\[123\\] {
    --tw-aspect-h: 123
}
.aspect-h-\\[var\\(--height\\)\\] {
    --tw-aspect-h: var(--height)
}
.aspect-none {
    position: static;
    padding-bottom: 0
}
.aspect-none > * {
    position: static;
    height: auto;
    width: auto;
    top: auto;
    right: auto;
    bottom: auto;
    left: auto
}
`

it('v3', () => {
  let css = postcss([
    require('tailwindcss')({
      content: [
        {
          raw: 'aspect-none aspect-w-1 aspect-w-2 aspect-h-2 aspect-w-[123] aspect-w-[var(--width)] aspect-h-[123] aspect-h-[var(--height)]',
        },
      ],
      plugins: [require('../')],
    }),
  ]).process('@tailwind components').css

  expect(css).toBe(expectedV3.trim())
})

let expectedV2 = `
.aspect-w-1,
.aspect-w-2 {
  position: relative;
  padding-bottom: calc(var(--tw-aspect-h) / var(--tw-aspect-w) * 100%)
}

.aspect-w-1 > *,
.aspect-w-2 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0
}

.aspect-none {
  position: static;
  padding-bottom: 0
}

.aspect-none > * {
  position: static;
  height: auto;
  width: auto;
  top: auto;
  right: auto;
  bottom: auto;
  left: auto
}

.aspect-w-1 {
  --tw-aspect-w: 1
}

.aspect-w-2 {
  --tw-aspect-w: 2
}

.aspect-h-2 {
  --tw-aspect-h: 2
}
`

it('v2', () => {
  postcss([
    require('tailwindcss-v2')({
      purge: { enabled: true, content: [{ raw: 'aspect-none aspect-w-1 aspect-w-2 aspect-h-2' }] },
      variants: [],
      plugins: [require('../')],
    }),
  ])
    .process('@tailwind components', { from: undefined })
    .then(({ css }) => {
      expect(css).toBe(expectedV2.trim())
    })
})
