import {
  ExclamationTriangleIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid'
import { Button, Explainer, List, SelectIcon, classNames } from '@sushiswap/ui'
import { GoPlusLabsIcon } from '@sushiswap/ui/icons/GoPlusLabsIcon'
import { useMemo, useState } from 'react'
import {
  TokenSecurity,
  TokenSecurityLabel,
  TokenSecurityMessage,
  TokenSecurityResponse,
  isTokenSecurityIssue,
} from 'src/lib/hooks/react-query'
import { Token } from 'sushi/currency'

export const TokenSecurityView = ({
  tokenSecurityResponse,
  token,
  forceShowMore = false,
}: {
  tokenSecurityResponse: TokenSecurityResponse | undefined
  token: Token
  forceShowMore?: boolean
}) => {
  const [showMore, setShowMore] = useState<boolean>(forceShowMore)

  const { tokenSecurity, issues, nonIssues } = useMemo(() => {
    const tokenSecurity = tokenSecurityResponse?.[token.address]
    const issues: (keyof TokenSecurity)[] = []
    const nonIssues: (keyof TokenSecurity)[] = []

    for (const [_key, value] of Object.entries(tokenSecurity || {})) {
      const key = _key as keyof TokenSecurity
      if (key in isTokenSecurityIssue && isTokenSecurityIssue[key](value))
        issues.push(key)
      else nonIssues.push(key)
    }

    return { tokenSecurity, issues, nonIssues }
  }, [tokenSecurityResponse, token])

  return (
    <List className="!pt-0">
      <List.Control>
        <List.Item
          className="justify-between items-center !cursor-default outline-none"
          iconProps={{ width: undefined, height: undefined }}
          title="Token Security"
          subtitle={
            <div className="flex items-center">
              powered by GoPlus
              <GoPlusLabsIcon width={16} height={20} />
            </div>
          }
          value={
            <div
              className={classNames(
                'rounded-full flex items-center px-2 py-1 gap-1',
                Number(issues?.length) > 0
                  ? 'bg-yellow/20 text-yellow'
                  : 'bg-green/20 text-green',
              )}
            >
              {Number(issues?.length) > 0 ? (
                <ExclamationTriangleIcon width={16} height={16} />
              ) : (
                <HandThumbUpIcon width={16} height={16} />
              )}
              <span className="text-sm">{`${Number(issues?.length)} issue${
                Number(issues?.length) !== 1 ? 's' : ''
              } found`}</span>
            </div>
          }
        />
        {issues.map((key) => (
          <List.KeyValue
            className="hover:bg-secondary"
            key={key}
            title={
              <div className="flex gap-1">
                {TokenSecurityLabel[key]}
                <Explainer>{TokenSecurityMessage[key]}</Explainer>
              </div>
            }
          >
            <div className="flex items-center gap-1">
              <div>
                {tokenSecurity?.[key] === undefined
                  ? 'Unknown'
                  : tokenSecurity[key]
                    ? 'Yes'
                    : 'No'}
              </div>
              <ExclamationTriangleIcon
                width={14}
                height={14}
                className="fill-yellow"
              />
            </div>
          </List.KeyValue>
        ))}
        {showMore
          ? nonIssues.map((key) => (
              <List.KeyValue
                className="hover:bg-muted py-1.5"
                key={key}
                title={
                  <div className="flex gap-1 text-gray-900 dark:text-slate-50">
                    {TokenSecurityLabel[key]}
                    <Explainer>{TokenSecurityMessage[key]}</Explainer>
                  </div>
                }
              >
                <div className="flex items-center gap-1">
                  <span>{tokenSecurity?.[key] ? 'Yes' : 'No'}</span>
                  <HandThumbUpIcon
                    width={14}
                    height={14}
                    className="fill-green"
                  />
                </div>
              </List.KeyValue>
            ))
          : null}
        {!forceShowMore ? (
          <div className="p-3">
            <Button
              size="xs"
              fullWidth
              onClick={() => setShowMore(!showMore)}
              variant="ghost"
            >
              {showMore ? (
                <>
                  <SelectIcon className="rotate-180" />
                </>
              ) : (
                <>
                  <SelectIcon />
                </>
              )}
            </Button>
          </div>
        ) : null}
      </List.Control>
    </List>
  )
}
