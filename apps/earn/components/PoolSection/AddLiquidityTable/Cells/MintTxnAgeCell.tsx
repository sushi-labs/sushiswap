import { Typography } from '@sushiswap/ui'
import { FC, useEffect, useState } from 'react'

import { CellProps } from './types'

export const MintTxnAgeCell: FC<CellProps> = ({ row }) => {

  const [second, setSecond] = useState<any>(0);
  const [minute, setMinute] = useState<any>(0);
  const [hour, setHour] = useState<any>(0);
  const [day, setDay] = useState<any>(0);

  useEffect(() => {
    let diff = Math.floor(Date.now() / 1000 - Number(row.timestamp) + new Date().getTimezoneOffset());
    setSecond(diff % 60);
    diff = Math.floor(diff / 60);
    setMinute(diff % 60);
    diff = Math.floor(diff / 60);
    setHour(diff % 24);
    diff = Math.floor(diff / 24);
    setDay(diff);
  }, [row]);

  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {day ? day + "d " : ""}
      {hour ? hour + "h " : ""}
      {minute ? minute + "m " : ""}
      {second ? second + "s " : ""} ago
    </Typography>
  )
}
