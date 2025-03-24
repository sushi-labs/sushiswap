import {
  ExclamationTriangleIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid'
import { Explainer, Loader, classNames } from '@sushiswap/ui'
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

export const TokenSecurityView = ({
  tokenSecurity,
  isTokenSecurityLoading,
}: {
  tokenSecurity: TokenSecurityResponse | undefined
  isTokenSecurityLoading: boolean
}) => {
  const { issues, nonIssues } = useMemo(() => {
    const issues: (keyof TokenSecurity)[] = []
    const nonIssues: (keyof TokenSecurity)[] = []

    for (const [_key, value] of Object.entries(tokenSecurity || {})) {
      const key = _key as keyof TokenSecurity
      if (
        key in isTokenSecurityIssue &&
        (isTokenSecurityIssue[key](value.deFi) ||
          isTokenSecurityIssue[key](value.goPlus))
      )
        issues.push(key)
      else nonIssues.push(key)
    }

    return { tokenSecurity, issues, nonIssues }
  }, [tokenSecurity])

  return (
    <div className="flex gap-3">
      <div className="grow flex flex-col gap-3">
        <div className="h-12">
          <div
            className={classNames(
              'rounded-full flex items-center px-2 py-1.5 gap-1 w-fit',
              isTokenSecurityLoading
                ? 'bg-muted'
                : Number(issues?.length) > 0
                  ? 'bg-yellow/20 text-yellow'
                  : 'bg-green/20 text-green',
            )}
          >
            {isTokenSecurityLoading ? (
              <Loader width={16} height={16} />
            ) : Number(issues?.length) > 0 ? (
              <ExclamationTriangleIcon width={16} height={16} />
            ) : (
              <HandThumbUpIcon width={16} height={16} />
            )}
            {isTokenSecurityLoading ? (
              <span className="text-sm">Pending</span>
            ) : (
              <span className="text-sm">{`${Number(issues?.length)} issue${
                Number(issues?.length) !== 1 ? 's' : ''
              } found`}</span>
            )}
          </div>
        </div>
        {issues.map((key) => (
          <div key={key} className="flex gap-1">
            <Explainer iconProps={{ className: 'text-muted-foreground' }}>
              {TokenSecurityMessage[key]}
            </Explainer>
            <span className="text-sm">{TokenSecurityLabel[key]}</span>
          </div>
        ))}
        {nonIssues.map((key) => (
          <div key={key} className="flex gap-1">
            <Explainer iconProps={{ className: 'text-muted-foreground' }}>
              {TokenSecurityMessage[key]}
            </Explainer>
            <span className="text-sm font-medium">
              {TokenSecurityLabel[key]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 items-center h-12">
          <GoPlusLabsIcon width={28} height={24} />
          <span className="font-semibold text-sm">GoPlus</span>
        </div>
        {issues.map((key) => (
          <div key={key} className="flex items-center justify-center gap-1">
            <span className="text-sm font-medium">
              {tokenSecurity?.[key].goPlus === undefined
                ? '-'
                : tokenSecurity[key].goPlus
                  ? 'Yes'
                  : 'No'}
            </span>
            {tokenSecurity?.[key].deFi ===
            undefined ? null : isTokenSecurityIssue[key](
                tokenSecurity?.[key].goPlus,
              ) ? (
              <ExclamationTriangleIcon
                width={14}
                height={14}
                className="fill-red"
              />
            ) : (
              <HandThumbUpIcon width={14} height={14} className="fill-green" />
            )}
          </div>
        ))}
        {nonIssues.map((key) => (
          <div key={key} className="flex items-center justify-center gap-1">
            <span className="text-sm font-medium">
              {tokenSecurity?.[key].goPlus ? 'Yes' : 'No'}
            </span>
            {isTokenSecurityIssue[key](tokenSecurity?.[key].goPlus) ? (
              <ExclamationTriangleIcon
                width={14}
                height={14}
                className="fill-red"
              />
            ) : (
              <HandThumbUpIcon width={14} height={14} className="fill-green" />
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 items-center h-12">
          <DeFiIcon width={24} height={24} />
          <span className="font-semibold text-sm">De.Fi</span>
        </div>
        {issues.map((key) => (
          <div key={key} className="flex items-center justify-center gap-1">
            <span className="text-sm font-medium">
              {tokenSecurity?.[key].deFi === undefined
                ? '-'
                : tokenSecurity[key].deFi
                  ? 'Yes'
                  : 'No'}
            </span>
            {tokenSecurity?.[key].deFi ===
            undefined ? null : isTokenSecurityIssue[key](
                tokenSecurity?.[key].deFi,
              ) ? (
              <ExclamationTriangleIcon
                width={14}
                height={14}
                className="fill-red"
              />
            ) : (
              <HandThumbUpIcon width={14} height={14} className="fill-green" />
            )}
          </div>
        ))}
        {nonIssues.map((key) => (
          <div key={key} className="flex items-center justify-center gap-1">
            <span className="text-sm font-medium">
              {tokenSecurity?.[key].deFi ? 'Yes' : 'No'}
            </span>
            {isTokenSecurityIssue[key](tokenSecurity?.[key].deFi) ? (
              <ExclamationTriangleIcon
                width={14}
                height={14}
                className="fill-red"
              />
            ) : (
              <HandThumbUpIcon width={14} height={14} className="fill-green" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
