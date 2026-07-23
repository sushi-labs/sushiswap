import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Button, classNames } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import type { TokenSecurityImportState } from './token-security-import-state'

interface ImportTelemetry {
  tokenSymbol: string | undefined
  tokenAddress: string
}

interface TokenSecurityImportActionsProps {
  state: TokenSecurityImportState
  hasSecurityRisk: boolean
  onImport(): void
  onRetry(): void
  onCancel(): void
  telemetry?: ImportTelemetry
}

function withImportTelemetry(
  button: ReactElement,
  telemetry: ImportTelemetry | undefined,
): ReactElement {
  if (!telemetry) return button

  return (
    <TraceEvent
      events={[BrowserEvent.onClick, BrowserEvent.onKeyPress]}
      name={InterfaceEventName.TOKEN_IMPORTED}
      properties={{
        token_symbol: telemetry.tokenSymbol,
        token_address: telemetry.tokenAddress,
      }}
      element={InterfaceElementName.IMPORT_TOKEN_BUTTON}
    >
      {button}
    </TraceEvent>
  )
}

export function TokenSecurityImportActions({
  state,
  hasSecurityRisk,
  onImport,
  onRetry,
  onCancel,
  telemetry,
}: TokenSecurityImportActionsProps) {
  const hasScanActions = state === 'scanning' || state === 'unavailable'
  const importWithoutScan = withImportTelemetry(
    <Button fullWidth size="xl" onClick={onImport} variant="warning">
      Force import without scan
    </Button>,
    telemetry,
  )

  return (
    <div
      className={classNames(
        'flex w-full flex-col gap-3',
        !hasScanActions && 'sm:flex-row',
      )}
    >
      {state === 'scanning' ? (
        <>
          <Button fullWidth size="xl" loading disabled>
            Checking token security
          </Button>
          {importWithoutScan}
        </>
      ) : state === 'unavailable' ? (
        <>
          <Button fullWidth size="xl" onClick={onRetry}>
            Retry security scan
          </Button>
          {importWithoutScan}
        </>
      ) : (
        withImportTelemetry(
          <Button
            fullWidth
            size="xl"
            onClick={onImport}
            variant={hasSecurityRisk ? 'destructive' : 'default'}
          >
            {hasSecurityRisk ? 'Import Anyway' : 'Confirm Import'}
          </Button>,
          telemetry,
        )
      )}
      <Button fullWidth size="xl" onClick={onCancel} variant="secondary">
        Cancel
      </Button>
    </div>
  )
}
