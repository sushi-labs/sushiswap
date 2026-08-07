import { execFileSync } from 'node:child_process'
import path from 'node:path'

const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx'])
const EXCLUDED_PATH_PARTS = ['/abi/', '/abis/', '/contract-bindings/']
const GENERATED_GRAPH_TYPES =
  /^packages\/graph-client\/src\/subgraphs\/[^/]+\/types\//
const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isExcluded(file) {
  return (
    EXCLUDED_PATH_PARTS.some((part) => file.includes(part)) ||
    GENERATED_GRAPH_TYPES.test(file)
  )
}

function isFrameworkDirectory(directory) {
  return /^[([@_]/.test(directory) || directory.includes('.')
}

function getViolations(file) {
  if (isExcluded(file) || !SOURCE_EXTENSIONS.has(path.extname(file))) {
    return []
  }

  const parts = file.split('/')
  const filename = parts.pop()
  const stem = filename.split('.')[0]
  const violations = []

  if (!KEBAB_CASE.test(stem)) {
    violations.push(file)
  }

  for (const directory of parts) {
    if (!isFrameworkDirectory(directory) && !KEBAB_CASE.test(directory)) {
      violations.push(file)
      break
    }
  }

  return violations
}

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean)
const violations = files.flatMap(getViolations)

if (violations.length > 0) {
  console.error('Source file and directory names must use kebab-case:')
  for (const file of new Set(violations)) {
    console.error(`- ${file}`)
  }
  process.exitCode = 1
}
