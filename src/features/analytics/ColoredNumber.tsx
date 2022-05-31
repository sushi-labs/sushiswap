import { classNames, formatNumber, formatNumberScale, formatPercent } from '../../functions'

interface ColoredNumberProps {
  number: number
  scaleNumber?: boolean
  percent?: boolean
  className?: string
}

export default function ColoredNumber({
  number,
  scaleNumber = true,
  percent = false,
  className = '',
}: ColoredNumberProps): JSX.Element {
  if (isNaN(number) || number === Infinity) number = 0

  return (
    <>
      <div className={classNames(number > 0 ? 'text-green' : number < 0 && 'text-red', 'font-normal', className)}>
        {(number > 0 ? '+' : number < 0 ? '-' : '') +
          (percent
            ? formatPercent(number).replace('-', '')
            : scaleNumber
            ? formatNumberScale(number, true).replace('-', '')
            : formatNumber(number, true, false).replace('-', ''))}
      </div>
    </>
  )
}
