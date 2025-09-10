#!/usr/bin/env node

/**
 * Validates that critical peer dependencies are consistent across the monorepo
 * to prevent multiple package instances that break instanceof checks
 */

import { execSync } from 'node:child_process'

// Packages that frequently cause instanceof failures due to peer dep mismatches
const CRITICAL_PACKAGES = ['sushi', 'viem', 'typescript', 'zod', 'abitype']

console.log('🧹 Pruning unused packages from store...')
try {
  execSync('pnpm prune --ignore-scripts', {
    encoding: 'utf8',
    stdio: 'inherit',
  })
  console.log('✅ Store pruned successfully')
} catch (error) {
  console.warn('⚠️  Could not prune store:', error.message)
}

console.log('\n🔍 Checking for multiple instances of critical packages...')

for (const pkg of CRITICAL_PACKAGES) {
  try {
    const output = execSync(
      `pnpm list ${pkg} --depth=Infinity --parseable --recursive`,
      {
        encoding: 'utf8',
        cwd: process.cwd(),
      },
    )

    const instances = new Set()
    const lines = output.split('\n').filter((line) => line.includes(`/${pkg}@`))

    for (const line of lines) {
      const match = line.match(new RegExp(`/${pkg}@([^/]+)`))
      if (match) instances.add(match[1])
    }

    if (instances.size > 1) {
      console.error(`❌ Multiple ${pkg} versions found:`, Array.from(instances))
      console.error('   This can cause instanceof checks to fail!')
      process.exit(1)
    } else if (instances.size === 1) {
      console.log(`✅ ${pkg}: ${Array.from(instances)[0]}`)
    } else {
      console.log(`ℹ️  ${pkg}: not found in dependency tree`)
    }
  } catch (error) {
    console.warn(`⚠️  Could not check ${pkg}:`, error.message)
  }
}

// Check for potential zod cascade issues by finding all packages that depend on zod
console.log('\n🔍 Checking for zod cascade issues...')
try {
  const output = execSync('pnpm why zod', {
    encoding: 'utf8',
    cwd: process.cwd(),
  })

  // Parse the output to find packages that depend on zod
  const zodDependents = new Set()
  const lines = output.split('\n')

  for (const line of lines) {
    // Look for dependency paths that show which packages depend on zod
    const match = line.match(/^[^@]+@[^@]+ > ([^@]+)@/)
    if (match && match[1] !== 'zod') {
      zodDependents.add(match[1])
    }
  }

  if (zodDependents.size > 0) {
    console.log('⚠️  Packages that depend on zod (ensure consistent versions):')
    for (const pkg of Array.from(zodDependents).sort()) {
      console.log(`   - ${pkg}`)
    }
  } else {
    console.log('✅ No additional zod dependents found')
  }
} catch {
  console.log('⚠️  Could not analyze zod dependencies')
}

console.log('✅ All critical dependencies have single instances')
