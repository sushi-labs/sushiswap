import {
  ExclamationTriangleIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid'
import { isTokenScannerChainId } from '@sushiswap/graph-client/de.fi'
import { Explainer, Loader, SkeletonText, classNames } from '@sushiswap/ui'
import { DeFiIcon } from '@sushiswap/ui/icons/de-fi-icon'
import { GoPlusLabsIcon } from '@sushiswap/ui/icons/go-plus-labs-icon'
import {
  type TokenSecurityCheck,
  TokenSecurityLabel,
  TokenSecurityMessage,
  type TokenSecurityResponse,
  isTokenSecurityIssue,
} from 'src/lib/token-security'
import type { EvmToken } from 'sushi/evm'
import { type SvmToken, isSvmChainId } from 'sushi/svm'

export const TokenSecurityView = ({
  token,
  tokenSecurity,
  isTokenSecurityLoading,
  showDeFi = true,
}: {
  token: EvmToken | SvmToken
  tokenSecurity: TokenSecurityResponse | undefined
  isTokenSecurityLoading: boolean
  showDeFi?: boolean
}) => {
  const { rows = [], issueCount = 0 } = tokenSecurity ?? {}
  const isUnavailable = rows.length === 0
  const hasDeFiColumn = showDeFi && isTokenScannerChainId(token.chainId)
  const goPlusChain = isSvmChainId(token.chainId) ? 'solana' : token.chainId

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse ">
        <thead className="[&>tr:last-child]:border-b-[12px] [&>tr:last-child]:border-b-transparent">
          <tr className="whitespace-nowrap">
            <th className="text-left !font-normal">
              <div
                className={classNames(
                  'inline-flex items-center px-2 py-1.5 gap-1 rounded-full',
                  isTokenSecurityLoading || isUnavailable
                    ? 'bg-muted'
                    : issueCount > 0
                      ? 'bg-red/20 text-red'
                      : 'bg-green/20 text-green',
                )}
              >
                {isTokenSecurityLoading ? (
                  <Loader width={16} height={16} />
                ) : issueCount > 0 ? (
                  <ExclamationTriangleIcon width={16} height={16} />
                ) : isUnavailable ? null : (
                  <HandThumbUpIcon width={16} height={16} />
                )}

                {isTokenSecurityLoading ? (
                  <span className="text-sm">Pending</span>
                ) : isUnavailable ? (
                  <span className="text-sm">Scan unavailable</span>
                ) : (
                  <span className="text-sm">
                    {issueCount} issue{issueCount !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
            </th>

            <th className="text-center">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://console.gopluslabs.io/token-security/${goPlusChain}/${token.address}`}
                className="inline-flex flex-col items-center"
              >
                <GoPlusLabsIcon width={28} height={24} />
                <span className="font-semibold text-sm">GoPlus</span>
              </a>
            </th>

            {hasDeFiColumn && (
              <th className="text-center">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://de.fi/scanner/contract/${token.address}`}
                  className="inline-flex flex-col items-center"
                >
                  <DeFiIcon width={24} height={24} />
                  <span className="font-semibold text-sm">De.Fi</span>
                </a>
              </th>
            )}
          </tr>
        </thead>

        <tbody className="[&>tr:not(:last-child)]:border-b-[12px] [&>tr:not(:last-child)]:border-b-transparent">
          {isTokenSecurityLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <tr key={`loading-${index}`}>
                  <td>
                    <span className="w-full max-w-[120px]">
                      <SkeletonText fontSize="sm" />
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center">
                      <span className="w-full max-w-[40px]">
                        <SkeletonText fontSize="sm" />
                      </span>
                    </div>
                  </td>
                  {hasDeFiColumn && (
                    <td>
                      <div className="flex justify-center">
                        <span className="w-full max-w-[40px]">
                          <SkeletonText fontSize="sm" />
                        </span>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            : rows.map(({ check, isIssue, goPlus, deFi }) => (
                <tr key={check}>
                  <td>
                    <div className="flex items-center gap-1">
                      <Explainer
                        iconProps={{ className: 'text-muted-foreground' }}
                      >
                        {TokenSecurityMessage[check]}
                      </Explainer>
                      <span
                        className={classNames(
                          'text-sm',
                          !isIssue && 'font-medium',
                        )}
                      >
                        {TokenSecurityLabel[check]}
                      </span>
                    </div>
                  </td>
                  <td className="text-center">
                    <TokenSecurityValue check={check} value={goPlus} />
                  </td>
                  {hasDeFiColumn && (
                    <td className="text-center">
                      <TokenSecurityValue check={check} value={deFi} />
                    </td>
                  )}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  )
}

function TokenSecurityValue({
  check,
  value,
}: {
  check: TokenSecurityCheck
  value: boolean | null
}) {
  if (value === null) return <span aria-label="Unknown">—</span>

  return (
    <div className="inline-flex items-center gap-1">
      <span className="text-sm font-medium">{value ? 'Yes' : 'No'}</span>
      {isTokenSecurityIssue(check, value) ? (
        <ExclamationTriangleIcon width={14} height={14} className="fill-red" />
      ) : (
        <HandThumbUpIcon width={14} height={14} className="fill-green" />
      )}
    </div>
  )
}
