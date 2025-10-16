import { LinkInternal, classNames } from '@sushiswap/ui'

export const ManagePositionButton = ({
  href,
  positionCount,
}: {
  href: string
  positionCount?: number
}) => {
  return (
    <LinkInternal
      href={href}
      className={classNames(
        'bg-[#0000001F] dark:bg-[#FFFFFF1F] p-[14px] rounded-xl font-semibold',
        'flex items-center gap-2 justify-center',
      )}
      type="button"
    >
      Manage Position
      {positionCount && (
        <div className="flex justify-center items-center w-5 h-5 text-sm text-white rounded-full bg-blue">
          {positionCount}
        </div>
      )}
    </LinkInternal>
  )
}
