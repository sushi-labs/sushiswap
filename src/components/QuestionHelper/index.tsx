import { InformationCircleIcon } from '@heroicons/react/outline'
import { classNames } from 'app/functions'
import { useOnClickOutside } from 'app/hooks/useOnClickOutside'
import useToggle from 'app/hooks/useToggle'
import { MouseEvent } from 'react'
import React, { FC, ReactElement, ReactNode, useCallback, useRef, useState } from 'react'

import Tooltip from '../Tooltip'

const QuestionHelper: FC<{
  text?: any
  icon?: ReactNode
  children?: ReactElement
  className?: string
  gap?: boolean
}> = ({ className, children, text, icon = <InformationCircleIcon width={14} height={14} />, gap = true }) => {
  const [show, setShow] = useState<boolean>(false)
  const [toggle, setToggle] = useToggle(false)
  const node = useRef<HTMLDivElement | null>(null)
  useOnClickOutside(node, toggle ? setToggle : undefined)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  const handler = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setToggle()
    },
    [setToggle]
  )

  if (children) {
    return (
      <Tooltip text={text} show={show || toggle} className={className}>
        {React.cloneElement(children, {
          ref: node,
          onClick: handler,
          className: classNames(children.props.className, 'flex items-center justify-center w-full outline-none'),
          onMouseEnter: open,
          onMouseLeave: close,
        })}
      </Tooltip>
    )
  }

  return (
    <Tooltip text={text} show={show || toggle} className={className}>
      <div
        ref={node}
        onClick={handler}
        className={classNames(
          gap ? 'ml-1' : '',
          'flex items-center justify-center outline-none cursor-help hover:text-primary'
        )}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {icon}
      </div>
    </Tooltip>
  )
}

export default QuestionHelper
