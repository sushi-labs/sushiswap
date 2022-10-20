# Next.js + Transpile `node_modules`

![Build Status](https://github.com/martpie/next-transpile-modules/workflows/tests/badge.svg)
![Dependencies](https://img.shields.io/david/martpie/next-transpile-modules)
[![sponsor: Creative Tim](https://img.shields.io/badge/sponsor-Creative%20Tim-blue)](https://creative-tim.com/?affiliate_id=140482)

Transpile modules from `node_modules` using the Next.js Babel configuration.

Makes it easy to have local libraries and keep a slick, manageable dev experience.

- Supports transpilation of all extensions supported by Next.js: `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.css`, `.scss` and `.sass`
- Enable hot-reloading on local packages
- Most setups should work out of the box (npm, yarn, pnpm, ...)

## What problems does it solve?

This plugin aims to solve the following challenges:

- code transpilation from local packages (think: a monorepo with a `styleguide` package)
- code transpilation from NPM modules using ES6 imports (e.g `lodash-es`)

What this plugin **does not aim** to solve:

- any-package IE11-compatible maker

## Compatibility table

| Next.js version   | Plugin version     |
| ----------------- | ------------------ |
| Next.js 12        | 9.x                |
| Next.js 11        | 8.x                |
| Next.js 9.5+ / 10 | 4.x, 5.x, 6.x, 7.x |
| Next.js 9.2       | 3.x                |
| Next.js 8 / 9     | 2.x                |
| Next.js 6 / 7     | 1.x                |

Latest Next.js version tested: **12.0.1**.

## Installation

```
npm install --save next-transpile-modules
```

or

```
yarn add next-transpile-modules
```

## Usage

### withTM(transpileModules [, options])

- `transpileModules` String[]: modules to be transpiled
- `options` Object (optional)
  - `resolveSymlinks` Boolean: Enable symlinks resolution to their real path by Webpack (default to `true`)
  - `debug` Boolean: Display some informative logs in the console (can get noisy!) (default to `false`)
  - `__unstable_matcher` (path) => boolean: Custom matcher that will override the default one. Don't use it.

#### Note on `resolveSymlinks`

Node.js resolution is based on the fact that symlinks are resolved. Not resolving them will alter the behavior, but there are some cases where the alternative behavior makes things a lot easier.

If:

- You are using `npm/yarn link` to link packages into node_modules.
- You are using `npm` with `file:` dependencies that live outside of your project directory
  - `npm` will create symlinks in this case. Yarn will copy instead.

**you should set `resolveSymlinks: false`**, which results which will make things work as expected.

For other scenarios like:

- `pnpm`
- `yarn/npm` workspaces
- `yarn 2` portals

you should keep `resolveSymlinks: true` (default).

#### Examples

```js
// next.config.js
const withTM = require('next-transpile-modules')(['somemodule', 'and-another']); // pass the modules you would like to see transpiled

module.exports = withTM({});
```

**Notes:**

- please declare `withTM` as your last plugin (the outermost one).
- ~~make sure all your packages have [a valid `main` field](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#main).~~ (not needed anymore since `7.1.0`)
- there is currently no way to transpile only parts of a package, it's all or nothing

### Scoped packages

You can include scoped packages or nested ones:

```js
const withTM = require('next-transpile-modules')(['@shared/ui', '@shared/utils']);

// ...
```

```js
const withTM = require('next-transpile-modules')(['styleguide/node_modules/lodash-es']);

// ...
```

### With `next-compose-plugins`:

```js
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['some-module', 'and-another']);

module.exports = withPlugins([withTM], {
  // ...
});
```

### CSS/SCSS support

Since `next-transpile-modules@3` and `next@>9.2`, this plugin can also transpile CSS included in your transpiled packages. SCSS/SASS is also supported since `next-transpile-modules@3.1.0`.

In your transpiled package:

```js
// shared-ui/components/Button.js
import styles from './Button.module.css';

function Button(props) {
  return (
    <button type='button' className={styles.error}>
      {props.children}
    </button>
  );
}

export default Button;
```

```css
/* shared-ui/components/Button.module.css */
.error {
  color: white;
  background-color: red;
}
```

In your app:

```js
// next.config.js
const withTM = require('next-transpile-modules')(['shared-ui']);

// ...
```

```jsx
// pages/home.jsx
import React from 'react';
import Button from 'shared-ui/components/Button';

const HomePage = () => {
  return (
    <main>
      {/* will output <button class="Button_error__xxxxx"> */}
      <Button>Styled button</Button>
    </main>
  );
};

export default HomePage;
```

It also supports global CSS import packages located in `node_modules`:

```jsx
// pages/_app.js
import 'shared-ui/styles/global.css'; // will be imported globally

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

## FAQ

### What is the difference with `@weco/next-plugin-transpile-modules`?

- it is maintained, `@weco`'s seems dead
- it supports TypeScript
- it supports CSS modules (since Next.js 9.2)
- it supports `.mjs`

### Where can I find a setup that works?

[Here you go](https://github.com/martpie/monorepo-typescript-next-the-sane-way)!

### A new version of Next.js is available/I just setup my project, and my build is breaking because of this plugin

It is important to understand that this plugin is a big hack of the Next.js Webpack configuration. When the Next.js team pushes an update to their build configuration, the changes `next-transpile-modules` bring may be outdated, and the plugin needs to be updated (which is a breaking change for this plugin, as the updated plugin is usually not retro-compatible with the previous versions of Next.js).

Now, this build problem can happen when you install your dependencies with `npm install`/`yarn install` (in your CI pipeline for example). Those commands **may re-resolve your `next` dependency of your `package.json` to a newer one**, and this newer one may have critical Webpack changes, hence breaking your build.

The way to fix it is easy, and it is what you should always do: **install your dependencies with `npm ci` ("clean install") or `yarn --frozen-lockfile`**. This will force `npm` or `yarn` to use the version of Next.js declared in your lock file, instead of downloading the latest one compatible with the version accepted by your `package.json`.

So basically: use your lock files right, and understand what problems they are solving ;)

more:

- check the [compatibility table](#compatibility-table) of this plugin
- read more about semver and version resolutions: https://docs.npmjs.com/misc/semver

### I have trouble making it work after upgrading to v5/v6

Please make sure to [read the changelog](https://github.com/martpie/next-transpile-modules/releases).

### I have trouble with transpilation and my custom `.babelrc`

If you get a transpilation error when using a custom Babel configuration, make sure you are using a `babel.config.js` and not a `.babelrc`.

The former is [a project-wide Babel configuration](https://babeljs.io/docs/en/config-files), when the latter works for relative paths only (and may not work for Yarn for example, as it installs dependencies in a parent directory).

### I have trouble with Yarn and hot reloading

If you add a local library (let's say with `yarn add ../some-shared-module`), Yarn will copy those files by default, instead of symlinking them. So your changes to the initial folder won't be copied to your Next.js `node_modules` directory.

You can go back to `npm`, or use Yarn workspaces. See [an example](https://github.com/zeit/next.js/tree/canary/examples/with-yarn-workspaces) in the official Next.js repo.

### How do I find out which package is causing a runtime exception?

- add `config.optimization.minimize = false;` to you `next.config.js`'s Webpack configuration
- run a production build
- run it on the browser throwing the error
- open the console, jump to the line where it failed
- goes a little bit up in the lines of code, and check the Webpack comments telling you which module is affected

### I have trouble making it work with Lerna

Lerna's purpose is to publish different packages from a monorepo, **it does not help for and does not intend to help local development with local modules** (<- this, **IN CAPS**).

This is not coming from me, but [from Lerna's maintainer](https://github.com/lerna/lerna/issues/1243#issuecomment-401396850).

So you are probably [using it wrong](https://github.com/martpie/next-transpile-modules/issues/5#issuecomment-441501107), and I advice you to use `npm` or Yarn workspaces instead.

### But... I really need to make it work with Lerna!

Again, most probably a bad idea. You may need to tell your Webpack configuration how to properly resolve your scoped packages, as they won't be installed in your Next.js directory, but the root of your Lerna setup.

```js
const withTM = require('next-transpile-modules')(['@your-project/shared', '@your-project/styleguide']);

module.exports = withTM({
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Will make webpack look for these modules in parent directories
      '@your-project/shared': require.resolve('@your-project/shared'),
      '@your-project/styleguide': require.resolve('@your-project/styleguide'),
      // ...
    };
    return config;
  },
});
```

### I have trouble with duplicated dependencies or the `Invalid hook call` error in `react`

It can happen that when using `next-transpile-modules` with a local package and `npm`, you end up with duplicated dependencies in your final Next.js build. It is important to understand _why_ it happens.

Let's take the following setup: one Next.js app ("Consumer"), and one Styleguide library.

You will probably have `react` as a `peerDependencies` and as a `devDependecy` of the Styleguide. If you use `npm i`, it will create a symlink to your Styleguide package in your "Consumer" `node_modules`.

The thing is in this shared package, you also have a `node_modules`. So when your shared modules requires, let's say `react`, Webpack will resolve it to the version in your Styleguide's `node_modules`, and not your Consumer's `node_modules`. Hence the duplicated `react` in your final bundles.

You can tell Webpack how to resolve the `react` of your Styleguide to use the version in your Next.js app like that:

```diff
const withTM = require('next-transpile-modules')(['styleguide']);

module.exports = withTM({
  webpack: (config, options) => {
+   if (options.isServer) {
+     config.externals = ['react', ...config.externals];
+   }
+
+   config.resolve.alias['react'] = path.resolve(__dirname, '.', 'node_modules', 'react');

    return config
  },
});
```

Please note, the above [will only work](https://github.com/zeit/next.js/issues/9022#issuecomment-610255555) if `react` is properly declared as `peerDependencies` or `devDependencies` in your referenced package.

It is not a great solution, but it works. Any help to find a more future-proof solution is welcome.

## Credits

All the honor goes to [James Gorrie](https://github.com/jamesgorrie) who created the first version of this plugin.
