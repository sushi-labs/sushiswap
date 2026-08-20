import {
  BrowserEvent,
  InterfaceElementName,
  InterfaceEventName,
  TraceEvent,
} from '@sushiswap/telemetry'
import { Button, classNames } from '@sushiswap/ui'
import type { ReactElement } from 'react'
import type { TokenSecurityImportState } from './token-security-import-state'
import { useTokenSelectorTheme } from './token-selector/token-selector-theme'

interface ImportTelemetry {
  tokenSymbol: string | undefined
  tokenAddress: string
}

interface TokenSecurityImportActionsProps {
  state: TokenSecurityImportState
  hasSecurityRisk: boolean
  onImport(): void
  onRetry?(): void
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
  const theme = useTokenSelectorTheme()
  const isPerps = theme === 'perps'
  const hasScanActions =
    state === 'scanning' || (state === 'unavailable' && Boolean(onRetry))
  const importWithoutScan = withImportTelemetry(
    <Button
      fullWidth
      size="xl"
      onClick={onImport}
      variant={isPerps ? 'perps-short' : 'warning'}
    >
      Import without scan
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
      <div className="flex flex-col gap-3 sm:order-2 sm:flex-1 sm:flex-row">
        {state === 'scanning' ? (
          <>
            <Button
              fullWidth
              size="xl"
              loading
              disabled
              variant={isPerps ? 'perps-default' : 'default'}
            >
              Checking token security
            </Button>
            {importWithoutScan}
          </>
        ) : state === 'unavailable' ? (
          onRetry ? (
            <>
              <Button
                fullWidth
                size="xl"
                onClick={onRetry}
                variant={isPerps ? 'perps-default' : 'default'}
              >
                Retry security scan
              </Button>
              {importWithoutScan}
            </>
          ) : (
            importWithoutScan
          )
        ) : (
          withImportTelemetry(
            <Button
              fullWidth
              size="xl"
              onClick={onImport}
              variant={
                isPerps
                  ? hasSecurityRisk
                    ? 'perps-short'
                    : 'perps-default'
                  : hasSecurityRisk
                    ? 'destructive'
                    : 'default'
              }
            >
              {hasSecurityRisk ? 'Import Anyway' : 'Confirm Import'}
            </Button>,
            telemetry,
          )
        )}
      </div>
      <Button
        fullWidth
        size="xl"
        className="sm:order-1"
        onClick={onCancel}
        variant={isPerps ? 'perps-secondary' : 'secondary'}
      >
        Cancel
      </Button>
    </div>
  )
}
