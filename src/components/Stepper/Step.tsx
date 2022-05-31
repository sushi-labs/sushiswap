import { Children, cloneElement, FC, isValidElement } from 'react'

export interface Step {
  _index?: number
  _active?: boolean
  _last?: boolean
}

const Step: FC<Step> = ({ _index, _active, _last, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        {Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              _index,
              _active,
              _last,
            })
          }

          return child
        })}
      </div>
    </div>
  )
}

export default Step
