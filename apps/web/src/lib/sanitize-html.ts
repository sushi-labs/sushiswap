import sanitizeHtml from 'sanitize-html'

/**
 * Sanitizes untrusted HTML (CMS content, token metadata) before rendering with
 * `dangerouslySetInnerHTML`. The app CSP currently allows inline scripts, so
 * unsanitized HTML would execute inline event handlers and `javascript:` URLs.
 */

const ALLOWED_IFRAME_HOSTNAMES = [
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
  'open.spotify.com',
  'w.soundcloud.com',
  'codepen.io',
]

/**
 * Conservative inline-style allowlist for CMS content. Verified against the
 * inline styles actually present across all published Ghost posts (pasted
 * documents produce bordered tables, line-heights and font sizes). Only
 * typographic/table-cosmetic properties are permitted; layout properties
 * (`position`, `z-index`, `display`, `float`, ...) and value-level loaders
 * (`url(...)`, `expression(...)`) are deliberately excluded so a style
 * attribute cannot create overlays or remote beacons.
 */
const SAFE_COLOR =
  /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.,%\s]+\)|hsla?\(\s*[\d.,%\s]+\)|transparent|inherit|currentColor|[a-z]+)$/i
const SAFE_LENGTH = /^\d+(\.\d+)?(pt|px|em|rem|%)$/
const SAFE_MARGIN = /^-?\d+(\.\d+)?(pt|px|em|rem)$/
const SAFE_BORDER = /^(?!.*\burl\b)(?!.*expression)[\w\s#(),.%-]*$/i

/** Profile for Ghost CMS article/legal bodies (rich editorial markup). */
export function sanitizeCmsHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'h1',
      'h2',
      'img',
      'figure',
      'figcaption',
      'picture',
      'video',
      'audio',
      'source',
      'iframe',
      'section',
      'article',
      'aside',
      'header',
      'footer',
      'del',
      'ins',
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      // `style` is admitted here but filtered per-property/value by
      // allowedStyles below — layout properties and url()/expression()
      // values never survive.
      '*': ['class', 'id', 'dir', 'lang', 'style'],
      a: [
        ...(sanitizeHtml.defaults.allowedAttributes.a ?? []),
        'target',
        'rel',
      ],
      img: [
        'src',
        'srcset',
        'sizes',
        'alt',
        'title',
        'width',
        'height',
        'loading',
      ],
      video: [
        'src',
        'controls',
        'poster',
        'width',
        'height',
        'preload',
        // GIF-style looping videos used by CMS posts.
        'loop',
        'muted',
        'autoplay',
        'playsinline',
      ],
      audio: ['src', 'controls', 'preload'],
      source: ['src', 'srcset', 'type', 'media'],
      iframe: [
        'src',
        'width',
        'height',
        'allow',
        'allowfullscreen',
        'frameborder',
        'loading',
        'title',
      ],
      ol: ['start', 'type', 'reversed'],
      col: ['width'],
    },
    allowedStyles: {
      '*': {
        color: [SAFE_COLOR],
        'background-color': [SAFE_COLOR],
        'text-align': [/^(left|right|center|justify|start|end)$/i],
        'font-size': [SAFE_LENGTH],
        'font-weight': [/^(normal|bold|bolder|lighter|[1-9]00)$/i],
        'font-family': [/^[a-zA-Z\s,'"-]+$/],
        'line-height': [/^\d+(\.\d+)?$/],
        'white-space': [/^(normal|pre|pre-wrap|pre-line|nowrap)$/i],
        'margin-top': [SAFE_MARGIN],
        'margin-bottom': [SAFE_MARGIN],
        'margin-left': [SAFE_MARGIN],
        'margin-right': [SAFE_MARGIN],
        'padding-top': [SAFE_MARGIN],
        'padding-bottom': [SAFE_MARGIN],
        'padding-left': [SAFE_MARGIN],
        'padding-right': [SAFE_MARGIN],
        height: [SAFE_LENGTH],
        width: [SAFE_LENGTH],
        border: [SAFE_BORDER],
        'border-left': [SAFE_BORDER],
        'border-right': [SAFE_BORDER],
        'border-top': [SAFE_BORDER],
        'border-bottom': [SAFE_BORDER],
        'border-width': [SAFE_BORDER],
        'border-style': [
          /^(none|solid|dashed|dotted|double|groove|ridge|inset|outset)(\s+(none|solid|dashed|dotted|double|groove|ridge|inset|outset)){0,3}$/i,
        ],
        'border-color': [SAFE_BORDER],
        'border-collapse': [/^(collapse|separate)$/i],
        'border-spacing': [/^[\d\s.]+(pt|px|em|rem)?$/],
      },
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowedIframeHostnames: ALLOWED_IFRAME_HOSTNAMES,
    // Links opened in a new tab must not gain access to window.opener.
    transformTags: {
      a: (_tagName, attribs) => {
        if (attribs.target === '_blank') {
          return {
            tagName: 'a',
            attribs: { ...attribs, rel: 'noopener noreferrer' },
          }
        }
        return { tagName: 'a', attribs }
      },
    },
  })
}

/** Profile for token metadata descriptions (basic inline formatting only). */
export function sanitizeTokenDescriptionHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'a',
      'b',
      'blockquote',
      'br',
      'code',
      'div',
      'em',
      'i',
      'li',
      'ol',
      'p',
      'pre',
      's',
      'span',
      'strong',
      'u',
      'ul',
    ],
    allowedAttributes: {
      // transformTags forces safe values for target/rel on every link.
      a: ['href', 'target', 'rel'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: {
          ...attribs,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    },
  })
}
