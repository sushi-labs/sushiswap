import { BookOpenIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Badge from 'app/components/Badge'
import QuestionHelper from 'app/components/QuestionHelper'
import useLimitOrders from 'app/features/legacy/limit-order/useLimitOrders'
import Link from 'next/link'
import React, { FC } from 'react'

const MyOrders: FC = () => {
  const { i18n } = useLingui()
  const { pending } = useLimitOrders()

  const content = (
    <QuestionHelper
      text={i18n._(t`Open orders`)}
      icon={<BookOpenIcon width={24} height={24} className="cursor-pointer hover:text-white" />}
    />
  )

  return (
    <Link href="/limit-order/open">
      <a>
        {pending.totalOrders > 0 ? (
          <Badge color="blue" value={pending.totalOrders}>
            {content}
          </Badge>
        ) : (
          content
        )}
      </a>
    </Link>
  )
}

export default MyOrders
