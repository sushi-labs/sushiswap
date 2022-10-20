# Open Graph Image Generation

Generate Open Graph images with Vercel’s [Edge Function](https://vercel.com/docs/concepts/functions/edge-functions).

## Quick Start

Install `@vercel/og`, then use it inside an API route with **Edge Runtime** configured in your Next.js project:

```jsx
// /pages/api/og.jsx
import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'experimental-edge',
}

export default function () {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 128,
          background: 'lavender',
        }}
      >
        Hello!
      </div>
    )
  )
}
```

Then run `next dev` and access localhost:3000/api/og, the React element will be rendered and responded as a PNG from that endpoint:

![Rendered OG image](.github/demo.png)

Read more about the API, supported features and check out the examples in the following sections.

## API Reference

`@vercel/og` only supports the [Edge Runtime](https://vercel.com/docs/concepts/functions/edge-functions/quickstart). The Node.js runtime will not work.

The package exposes an `ImageResponse` constructor, with the following options available:

```jsx
import { ImageResponse } from '@vercel/og'

// ...
new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' | 'fluent' | 'fluentFlat' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
      style: 'normal' | 'italic'
    }[]
    debug?: boolean = false

    // Options that will be passed to the HTTP response
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

When running in production, these headers will be included by `@vercel/og`:

```jsx
'content-type': 'image/png',
'cache-control': 'public, immutable, no-transform, max-age=31536000',
```

During development, the `cache-control: no-cache, no-store` header is used instead.

### Supported HTML and CSS Features

Please refer to [Satori’s documentation](https://github.com/vercel/satori#documentation) for a list of supported HTML and CSS features.

By default, `@vercel/og` only has the Noto Sans font included. If you need to use other fonts, you can pass them in the `fonts` option. Check the **Custom Font** example below for more details.

## Examples

- Basic · [_source_](/examples/next/pages/api/vercel.tsx) · [_demo_](https://og-examples.vercel.sh/api/vercel)
- Embed SVG Image · [_source_](/examples/next/pages/api/image-svg.tsx) · [_demo_](https://og-examples.vercel.sh/api/image-svg)
- Dynamic PNG Image Based on URL Queries · [_source_](/examples/next/pages/api/dynamic-image.tsx) · [_demo_](https://og-examples.vercel.sh/api/dynamic-image?username=vercel)
-   Fetch External Data · [_source_](/examples/next/pages/api/external-data.tsx) · [_demo_](https://og-examples.vercel.sh/api/external-data?username=rauchg)
- Custom Font · [_source_](/examples/next/pages/api/custom-font.tsx) · [_demo_](https://og-examples.vercel.sh/api/custom-font)
- Emoji · [_source_](/examples/next/pages/api/emoji.tsx) · [_demo_](https://og-examples.vercel.sh/api/emoji)
- Languages · [_source_](/examples/next/pages/api/language.tsx) · [_demo_](https://og-examples.vercel.sh/api/language)
- Encrypted Token · [_source_](/examples/next/pages/api/encrypted.tsx) · [_demo_](https://og-examples.vercel.sh/encrypted/a)


## Development / Contributing

### Playground
  - `pnpm i` inside the `playground/` directory
  - `pnpm dev` to start the Next.js app

### Package
  - `pnpm i` inside the root directory
  - `pnpm build` to build the library
  - `pnpm types` to generate the types

## Acknowledgements

This project will not be possible without the following projects:

- [Satori](https://github.com/vercel/satori)
- [Twemoji](https://github.com/twitter/twemoji)
- [Google Fonts](https://fonts.google.com) and [Noto Sans](https://www.google.com/get/noto/)
- [Resvg](https://github.com/RazrFalcon/resvg) and [Resvg.js](https://github.com/yisibl/resvg-js)

---

<a aria-label="Vercel logo" href="https://vercel.com">
  <img src="https://badgen.net/badge/icon/Made%20by%20Vercel?icon=zeit&label&color=black&labelColor=black">
</a>
