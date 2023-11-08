import { forwardRef } from 'react'

import classNames from 'classnames'

interface ReplyContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ReplyContent = forwardRef<HTMLDivElement, ReplyContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={classNames(
          className,
          'flex flex-col flex-1 w-full border border-accent bg-secondary p-4 rounded-xl',
        )}
      >
        {children}
      </div>
    )
  },
)
ReplyContent.displayName = 'ReplyContent'

type ReplyProps = React.HTMLAttributes<HTMLDivElement>

const ReplyArrow = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((_props, _ref) => {
  return (
    <div className="absolute left-2 top-0 bottom-0 w-5 h-full">
      <div className="absolute left-0 bottom-0 top-0 right-0 h-[50%] border-b border-l rounded-bl-[20px] border-accent" />
    </div>
  )
})
ReplyArrow.displayName = 'ReplyArrow'

const Reply = forwardRef<HTMLDivElement, ReplyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={classNames(className, 'pl-2 relative flex flex-1 gap-4')}
      >
        <ReplyArrow />
        <div className="pl-7 w-full">{children}</div>
      </div>
    )
  },
)
Reply.displayName = 'Reply'

export { Reply, ReplyArrow, ReplyContent }
