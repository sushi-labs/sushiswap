# UI

UI library

## Goals

- Accessibility (jsx-a11y/strict enabled)

## Components

- App
  - Shell
  - Header
  - Nav
- Dialog
  - Actions
  - Content
  - Description
  - Header
- Menu
  - Button
  - List
  - Item
- Select
  - Button
  - Label
  - Option

## Lint

pnpm exec turbo run lint --scope=ui

## Component convention

FC is redudant, let's avoid unessasary inports and just use regular functions

type Props = {
children?: React.ReactNode
}

function Component({ children }: Props): JSX.Element {
return <>I'm a typed component</>
}

## Resources

https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#props-extracting-prop-types-of-a-component



"exports": {
  "./future/components/GlobalNav": "./future/components/GlobalNav/**/*.{ts,tsx}",
  "./index.css": "./index.css",
  "./DatePicker.css": "./DatePicker.css",
  "./tailwind.js": "./tailwind.js",
  "./package.json": "./package.json"
},