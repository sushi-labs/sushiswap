import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import eslintNextPlugin from '@next/eslint-plugin-next'
import { defineConfig } from 'eslint/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const scopedDirs = [
  'apps/web/app/**/*.{js,jsx,ts,tsx}',
  'apps/web/components/**/*.{js,jsx,ts,tsx}',
  'apps/web/functions/**/*.{js,jsx,ts,tsx}',
  'apps/web/lib/**/*.{js,jsx,ts,tsx}',
  'apps/web/pages/**/*.{js,jsx,ts,tsx}',
  'apps/web/providers/**/*.{js,jsx,ts,tsx}',
  'apps/web/types/**/*.{js,jsx,ts,tsx}',
  'apps/web/ui/**/*.{js,jsx,ts,tsx}',
]

const eslintConfig = defineConfig([
  {
    files: scopedDirs,
    plugins: {
      next: eslintNextPlugin,
    },
    settings: {
      next: {
        rootDir: 'apps/web/',
      },
    },
  },
])

/** @type {import('eslint').Linter.Config[]} */
const configs = [
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  ...eslintConfig,
]

export default configs
