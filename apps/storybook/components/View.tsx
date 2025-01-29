import { cva } from 'class-variance-authority'
import type { ReactNode } from 'react'
import * as React from 'react'

export const View = ({
  prop,
  value = '',
  direction = 'row',
  justify = 'start',
  children,
}) => {
  const flexDirection = direction === 'column' ? 'column' : 'row'
  const justifyContent = justify === 'start' ? 'flex-start' : 'space-evenly'
  return (
    <div className="grow flex flex-col border divide-y divide-gray-200 rounded-lg shadow-sm">
      <div className="flex space-x-2 items-center bg-gray-100/75 text-gray-800 p-2.5">
        {prop}
        {value && <Badge>{value}</Badge>}
      </div>
      <div
        style={{ flexDirection, justifyContent }}
        className="bg-grid bg-gray-50/25 flex flex-wrap justify-center gap-x-2 gap-y-2 p-2.5"
      >
        {children}
      </div>
    </div>
  )
}

export const EnhancedView = ({ prop, value = '', ...props }) => {
  const child = React.Children.only(props.children)
  const { children, ...rest } = child.props

  return (
    <div className="flex flex-col border divide-y divide-gray-200 rounded-lg shadow-sm">
      <div className="flex space-x-2 items-center bg-gray-100/75 text-gray-800 p-2.5">
        {prop}
        {value && <Badge>{value}</Badge>}
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col min-w-[250px] border divide-y divide-gray-200 rounded m-2.5 text-sm ">
          <span className="font-medium p-1.5">Props</span>
          {Object.keys(rest).map((prop) => (
            <div key={prop} className="flex items-center space-x-0 p-1.5">
              <div className="text-gray-500">{prop}</div>
              {typeof rest[prop] === 'string' && (
                <div className="text-gray-800">
                  <Badge>{rest[prop]}</Badge>
                </div>
              )}
            </div>
          ))}
          {!Object.keys(rest).length && (
            <span className="text-gray-700 p-1.5">No properties selected</span>
          )}
        </div>
        <div className="bg-grid bg-gray-50/50 flex-1 p-2.5">{children}</div>
      </div>
    </div>
  )
}

export const Badge = ({ children }) => {
  return (
    <div className="flex items-center space-x-0">
      <span>=&quot;</span>
      <div className="rounded px-1 text-sm bg-yellow-100 text-yellow-700 border border-dashed border-red-200">
        {children}
      </div>
      <span>&quot;</span>
    </div>
  )
}

export const ViewGroup = ({
  children,
  direction = 'column',
}: {
  children: ReactNode
  direction?: 'column' | 'row'
}) => {
  const viewClasses = cva(['flex', 'flex-wrap', 'justify-start'], {
    variants: {
      direction: {
        row: ['flex-row', 'gap-3', 'items-center'],
        column: ['flex-col', 'gap-3'],
      },
    },
  })

  return <div className={viewClasses({ direction })}>{children}</div>
}
