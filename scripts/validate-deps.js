#!/usr/bin/env node

/**
 * Validates that critical peer dependencies are consistent across the monorepo
 * to prevent multiple package instances that break instanceof checks
 */

import { execSync } from 'node:child_process'
import { readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Packages that frequently cause instanceof failures due to peer dep mismatches
const CRITICAL_PACKAGES = ['sushi', 'viem', 'typescript', 'zod', 'abitype']

// Additional packages that use zod as peer dep and can cause cascading issues
const ZOD_DEPENDENT_PACKAGES = ['@sentry/core', 'knip']

console.log('🔍 Checking for multiple instances of critical packages...')

for (const pkg of CRITICAL_PACKAGES) {
  try {
    const output = execSync(`pnpm list ${pkg} --depth=Infinity --parseable`, {
      encoding: 'utf8',
      cwd: process.cwd(),
    })

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
    }
  } catch (error) {
    console.warn(`⚠️  Could not check ${pkg}:`, error.message)
  }
}

// Check for potential zod cascade issues
console.log('\n🔍 Checking for zod cascade issues...')
for (const pkg of ZOD_DEPENDENT_PACKAGES) {
  try {
    const output = execSync(`pnpm why ${pkg}`, {
      encoding: 'utf8',
      cwd: process.cwd(),
    })
    if (output.includes('zod')) {
      console.log(`⚠️  ${pkg} uses zod - ensure consistent version`)
    }
  } catch {
    // Package not installed, skip
  }
}

// Check for duplicates in pnpm store
console.log('\n🔍 Checking for duplicates in pnpm store (.pnpm directory)...')
const pnpmDir = join(process.cwd(), 'node_modules', '.pnpm')

if (existsSync(pnpmDir)) {
  const packageMap = new Map()
  const entries = readdirSync(pnpmDir, { withFileTypes: true })
  
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    
    // Parse package directory names (format: package@version_dependencies)
    const match = entry.name.match(/^(.+?)@([^_]+)_/)
    if (!match) continue
    
    const [, packageName, version] = match
    
    if (CRITICAL_PACKAGES.includes(packageName)) {
      if (!packageMap.has(packageName)) {
        packageMap.set(packageName, new Set())
      }
      
      packageMap.get(packageName).add({
        version,
        fullPath: entry.name
      })
    }
  }

  let hasPnpmDuplicates = false
  for (const [packageName, installations] of packageMap) {
    if (installations.size > 1) {
      hasPnpmDuplicates = true
      const installationArray = Array.from(installations)
      
      console.error(`❌ Multiple ${packageName} installations in pnpm store:`)
      for (const installation of installationArray) {
        console.error(`   - ${installation.fullPath}`)
      }
      console.error('   This causes instanceof failures! Different dependency combinations create separate installations.')
    }
  }
  
  if (hasPnpmDuplicates) {
    console.error('\n💡 To fix: Add overrides to package.json to force consistent dependency versions')
    console.error('   Example: "utf-8-validate": "6.0.3" in pnpm.overrides')
    process.exit(1)
  }
}

console.log('✅ All critical dependencies have single instances')
