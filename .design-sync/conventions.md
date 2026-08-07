# Sushi UI — how to build with this library

React + Tailwind. Components are imported from the bundle; you write layout glue with
Tailwind utility classes. Every name below was verified against the compiled artifacts.

## Wrapping and setup

Wrap the app once in `BaseProviders`. It is a `next-themes` provider
(`attribute="class"`, `themes={['light','black','dark']}`) plus three portal mount points
(`#network-check-portal`, `#popover-portal`, `#footer-portal`).

```jsx
<BaseProviders forcedTheme="light">
  <YourScreen />
</BaseProviders>
```

Design tokens live in `:root` in the stylesheet, **not** in the provider, so components are
correctly styled even without the wrapper. What you lose without it is theme switching and
the portal mounts — wrap anyway, and pass `forcedTheme` to pin a theme.

Themes are **classes on an ancestor**, applied by the provider: default light,
`.dark`, and `.black`. `.paper` is a frosted-glass surface (backdrop blur/saturate).

## The styling idiom

Tailwind utilities, **unprefixed** (`inline-flex gap-2 px-4`). Ignore the `ui-` prefix in
`packages/ui/tailwind.js` — the components emit unprefixed classes.

Semantic colors are the important part of the vocabulary; each maps to a CSS variable that
re-themes automatically under `.dark` / `.black`. Use these instead of raw palette values:

| Family | Real class names |
|---|---|
| surfaces | `bg-background`, `bg-secondary`, `bg-muted`, `bg-accent` |
| text | `text-muted-foreground`, `text-accent-foreground`, `text-white`, `text-blue` |
| borders / rings | `border-accent`, `ring-blue` |
| brand / status | `bg-blue`, `bg-red` (also `pink`, `green`, `yellow`, and the `perps-*` set) |
| radii used by the DS | `rounded-lg`, `rounded-xl`, `rounded-2xl` |

Underlying tokens, if you need `var()` directly: `--background`, `--background-color`,
`--color`, `--secondary`, `--muted`, `--muted-foreground`, `--accent`,
`--accent-foreground`, `--green`, `--red`, `--font-sans`, `--font-orbitron`.

**Two traps, both verified:**

1. **Never write `font-sans`.** The Tailwind preset maps `fontFamily.sans` to
   `var(--font-inter)`, which this design system never defines — the class resolves to
   nothing and text falls back to the browser default. Inter Variable is already applied
   to `html, body` via `--font-sans`, so just inherit it. `font-orbitron` is likewise not
   in the shipped stylesheet; use `style={{ fontFamily: 'var(--font-orbitron)' }}` for the
   display face.
2. **The stylesheet is content-scanned, so it is not the full Tailwind universe.** It
   contains the utilities this component library itself uses (~1,280 rules), plus most
   common layout ones. Verified present: `p-4`, `p-6`, `grid`, `grid-cols-2`,
   `grid-cols-3`, `flex-col`, `gap-6`, `w-full`, `max-w-md`, `max-w-2xl`, `text-lg`,
   `text-2xl`, `font-semibold`, `font-bold`, `shadow-lg`, `space-y-4`, `justify-between`,
   `text-center`, `border`, `hidden`. Verified **absent**: `p-8`, `gap-8`,
   `md:grid-cols-2`, `lg:px-8` — responsive variants in particular exist only where the DS
   uses them. Prefer the classes above; if a layout needs something exotic or a
   breakpoint variant, use an inline `style` rather than assuming the class resolves.

## Where the truth lives

- The bound `styles.css` and its `@import` closure is the authoritative stylesheet —
  grep it before inventing a class name.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component usage notes.
- `components/<group>/<Name>/<Name>.d.ts` — the real `<Name>Props` contract.

## An idiomatic example

Library components for the controls, DS utilities for your own layout:

```jsx
<BaseProviders forcedTheme="light">
  <div className="w-full max-w-md flex flex-col gap-6 p-6">
    <Card>
      <CardHeader>
        <CardTitle>Position</CardTitle>
        <CardDescription>Review before confirming</CardDescription>
      </CardHeader>
      <CardContent>
        <List>
          <List.Control>
            <List.KeyValue title="Network">Ethereum</list.KeyValue>
            <List.KeyValue title="Fee">0.05%</list.KeyValue>
          </list.Control>
        </list>
      </CardContent>
      <CardFooter>
        <Button size="lg">Confirm</Button>
      </CardFooter>
    </Card>
    <Message variant="warning" size="sm">Prices update every few seconds.</Message>
  </div>
</BaseProviders>
```

Two compound namespaces: `List` exposes `List.Item`, `List.MenuItem`, `List.Label`,
`List.Control` and `List.KeyValue`; `Currency` exposes `Currency.Icon`,
`Currency.IconList` and `Currency.List`.
Note that currency-amount components (e.g. `CardCurrencyAmountItem`) require real `sushi`
SDK objects (`new Amount(SUSHI[ChainId.ETHEREUM], 100)`); `Amount`, `ChainId`, `SUSHI` and
`USDT` are exported on the bundle for that purpose.
