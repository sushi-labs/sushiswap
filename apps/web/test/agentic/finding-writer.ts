import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import type { AgenticFinding } from './finding-schema'
import { findingSchema } from './finding-schema'

export interface FindingFingerprintInput {
  readonly chainId: number
  readonly contractFunction?: string
  readonly errorClass: string
  readonly flowStep: string
  readonly receiptStatus?: string
  readonly topTraceFrames: readonly string[]
  readonly uiStateSignature: string
}

export interface DeduplicatedFinding {
  readonly finding: AgenticFinding
  readonly occurrences: number
}

export function deduplicateFindings(
  findings: readonly AgenticFinding[],
): readonly DeduplicatedFinding[] {
  const grouped = new Map<string, DeduplicatedFinding>()
  for (const finding of findings) {
    const existing = grouped.get(finding.fingerprint)
    grouped.set(
      finding.fingerprint,
      existing
        ? { finding: existing.finding, occurrences: existing.occurrences + 1 }
        : { finding, occurrences: 1 },
    )
  }
  return [...grouped.values()]
}

export async function writeFinding(
  outputDirectory: string,
  input: AgenticFinding,
): Promise<{ readonly jsonPath: string; readonly markdownPath: string }> {
  const finding = findingSchema.parse(redactSensitiveData(input))
  const stem = `${slugify(finding.title)}-${finding.fingerprint.slice(0, 12)}`
  await mkdir(outputDirectory, { recursive: true })
  const jsonPath = join(outputDirectory, `${stem}.json`)
  const markdownPath = join(outputDirectory, `${stem}.md`)
  await Promise.all([
    writeFile(jsonPath, `${JSON.stringify(finding, null, 2)}\n`, 'utf8'),
    writeFile(markdownPath, findingMarkdown(finding), 'utf8'),
  ])
  return { jsonPath, markdownPath }
}

export function failureFingerprint(input: FindingFingerprintInput): string {
  const normalized = [
    normalize(input.errorClass),
    input.chainId,
    normalize(input.flowStep),
    normalize(input.contractFunction ?? 'none'),
    normalize(input.receiptStatus ?? 'none'),
    input.topTraceFrames.slice(0, 5).map(normalize).join('>'),
    normalize(input.uiStateSignature),
  ].join('|')
  return createHash('sha256').update(normalized).digest('hex')
}

export function redactSensitiveData<T>(value: T): T {
  return redact(value) as T
}

function redact(value: unknown, key = ''): unknown {
  if (Array.isArray(value)) return value.map((entry) => redact(entry, key))
  if (typeof value === 'string') {
    if (
      /(access.?key|access.?token|admin.?rpc|api.?key|authorization|bearer.?token|private.?key|secret)/i.test(
        key,
      )
    ) {
      return '[REDACTED]'
    }
    return redactUrl(value)
  }
  if (typeof value !== 'object' || value === null) return value

  return Object.fromEntries(
    Object.entries(value).map(([entryKey, entryValue]) => [
      entryKey,
      redact(entryValue, entryKey),
    ]),
  )
}

function redactUrl(value: string): string {
  if (!/^https?:\/\//i.test(value)) return value
  try {
    const url = new URL(value)
    for (const key of [...url.searchParams.keys()]) {
      if (/(key|secret|token|auth)/i.test(key)) {
        url.searchParams.set(key, '[REDACTED]')
      }
    }
    if (url.password || url.username) {
      url.password = ''
      url.username = ''
    }
    return url.toString()
  } catch {
    return value
  }
}

function findingMarkdown(finding: AgenticFinding): string {
  return `# ${finding.title}

- Severity: ${finding.severity}
- Suspected owner: ${finding.suspectedOwner}
- Fingerprint: \`${finding.fingerprint}\`
- Chain: ${finding.environment.chainId}
- Fork block: ${finding.environment.forkBlockNumber}
- Seed: ${finding.environment.seed}

## Expected

${finding.expected}

## Actual

${finding.actual}

## Minimal reproduction

${finding.minimalSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

## Evidence

- Receipt: ${finding.evidence.receiptStatus ?? 'not submitted'}
- Transaction: ${finding.evidence.transactionHash ?? 'none'}
- Trace classification: ${finding.artifacts.traceClassification ?? 'none'}
- Screenshots: ${finding.artifacts.screenshots.map((path) => basename(path)).join(', ') || 'none'}
`
}

function normalize(value: string): string {
  return value.toLowerCase().trim().replaceAll(/\s+/g, ' ')
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/(^-|-$)/g, '')
    .slice(0, 80)
}
