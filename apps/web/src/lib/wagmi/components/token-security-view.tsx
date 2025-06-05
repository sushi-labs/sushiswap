import {
  ExclamationTriangleIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid'
import { Explainer, Loader, SkeletonText, classNames } from '@sushiswap/ui'
import { DeFiIcon } from '@sushiswap/ui/icons/DeFiIcon'
import { GoPlusLabsIcon } from '@sushiswap/ui/icons/GoPlusLabsIcon'
import { useMemo } from 'react'
import {
  type TokenSecurity,
  TokenSecurityLabel,
  TokenSecurityMessage,
  type TokenSecurityResponse,
  isTokenSecurityIssue,
} from 'src/lib/hooks/react-query'
import type { Token } from 'sushi/currency'

export const TokenSecurityView = ({
  token,
  tokenSecurity,
  isTokenSecurityLoading,
}: {
  token: Token
  tokenSecurity: TokenSecurityResponse | undefined
  isTokenSecurityLoading: boolean
}) => {
  const { rows, issueCount } = useMemo(() => {
    const issues: (keyof TokenSecurity)[] = []
    const nonIssues: (keyof TokenSecurity)[] = []

    for (const [_key, value] of Object.entries(tokenSecurity?.data || {})) {
      const key = _key as keyof TokenSecurity
      if (
        key in isTokenSecurityIssue &&
        (isTokenSecurityIssue[key](value.deFi) ||
          isTokenSecurityIssue[key](value.goPlus))
      ) {
        issues.push(key)
      } else {
        nonIssues.push(key)
      }
    }
    return {
      rows: [
        ...issues.map((key) => ({ key, isIssue: true })),
        ...nonIssues.map((key) => ({ key, isIssue: false })),
      ],
      issueCount: issues.length,
    }
  }, [tokenSecurity])

  return (
    <div className="w-full overflow-x-auto dark:bg-slate-900 bg-gray-100 pt-2 px-4 rounded-lg">
      <table className="w-full table-auto border-collapse ">
        <thead className="[&>tr:last-child]:border-b-[12px] [&>tr:last-child]:border-b-transparent">
          <tr className="whitespace-nowrap">
            <th className="text-left !font-normal">
              <div
                className={classNames(
                  'inline-flex items-center px-2 py-1.5 gap-1 rounded-full',
                  isTokenSecurityLoading
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
                ) : (
                  <HandThumbUpIcon width={16} height={16} />
                )}

                {isTokenSecurityLoading ? (
                  <span className="text-sm">Pending</span>
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
                href={`https://gopluslabs.io/token-security/${token?.chainId}/${token?.address}`}
                className="inline-flex flex-col items-center"
              >
                <GoPlusLabsIcon width={28} height={24} />
                <span className="font-semibold text-sm">GoPlus</span>
              </a>
            </th>

            <th className="text-center">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://de.fi/scanner/contract/${token?.address}`}
                className="inline-flex flex-col items-center"
              >
                <DeFiIcon width={24} height={24} />
                <span className="font-semibold text-sm">De.Fi</span>
              </a>
            </th>
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
                  <td>
                    <div className="flex justify-center">
                      <span className="w-full max-w-[40px]">
                        <SkeletonText fontSize="sm" />
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            : rows.map(({ key, isIssue }) => {
                const goPlusValue = tokenSecurity?.data?.[key]?.goPlus
                const deFiValue = tokenSecurity?.data?.[key]?.deFi
                const goPlusIsIssue =
                  goPlusValue !== undefined &&
                  isTokenSecurityIssue[key](goPlusValue)
                const deFiIsIssue =
                  deFiValue !== undefined &&
                  isTokenSecurityIssue[key](deFiValue)

                return (
                  <tr key={key}>
                    <td>
                      <div className="flex items-center gap-1">
                        <Explainer
                          iconProps={{ className: 'text-muted-foreground' }}
                        >
                          {TokenSecurityMessage[key]}
                        </Explainer>
                        <span
                          className={classNames(
                            'text-sm',
                            !isIssue && 'font-medium',
                          )}
                        >
                          {TokenSecurityLabel[key]}
                        </span>
                      </div>
                    </td>

                    <td className="text-center">
                      {goPlusValue === undefined ? (
                        '-'
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <span className="text-sm font-medium">
                            {goPlusValue ? 'Yes' : 'No'}
                          </span>
                          {goPlusIsIssue ? (
                            <ExclamationTriangleIcon
                              width={14}
                              height={14}
                              className="fill-red"
                            />
                          ) : (
                            <HandThumbUpIcon
                              width={14}
                              height={14}
                              className="fill-green"
                            />
                          )}
                        </div>
                      )}
                    </td>

                    <td className="text-center">
                      {deFiValue === undefined ? (
                        '-'
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <span className="text-sm font-medium">
                            {deFiValue ? 'Yes' : 'No'}
                          </span>
                          {deFiIsIssue ? (
                            <ExclamationTriangleIcon
                              width={14}
                              height={14}
                              className="fill-red"
                            />
                          ) : (
                            <HandThumbUpIcon
                              width={14}
                              height={14}
                              className="fill-green"
                            />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
        </tbody>
      </table>
    </div>
  )
}
