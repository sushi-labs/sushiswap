import { classNames } from '../../functions'

interface DotsProps {
  children?: any
  className?: string
}

export default function Dots({ children = <span />, className }: DotsProps) {
  return (
    <>
      <style jsx>
        {`
          .dots::after {
            content: '.';
          }
        `}
      </style>
      <span
        className={classNames('after:inline-block dots after:animate-ellipsis after:w-4 after:text-left', className)}
      >
        {children}
      </span>
    </>
  )
}
