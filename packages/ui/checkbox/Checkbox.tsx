import React from 'react'

export interface CheckboxProps {
  set?: (value: boolean) => void
}

function Checkbox({
  set,
  className = '',
  checked,
  ...rest
}: CheckboxProps & React.InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <div className="relative flex items-center justify-center">
      <input
        type="checkbox"
        onChange={(event) => (set ? set(event.target.checked) : null)}
        className={`border border-dark-700 checked:bg-gradient-to-r checked:border-[3px] checked:from-blue checked:to-pink cursor-pointer appearance-none h-5 w-5 rounded-[4px] bg-dark-900 disabled:bg-dark-1000 disabled:border-dark-800 ${className}`}
        checked={checked}
        {...rest}
      />
    </div>
  )
}

export default Checkbox
