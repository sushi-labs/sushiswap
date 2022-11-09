import { Typography } from '@sushiswap/ui'
import { FC, useEffect, useState } from 'react'

import { TransactionCellProps } from './types'

export const TransactionAgeCell: FC<TransactionCellProps> = ({ row }) => {

  const [second, setSecond] = useState<any>(0);
  const [minute, setMinute] = useState<any>(0);
  const [hour, setHour] = useState<any>(0);
  const [day, setDay] = useState<any>(0);

  useEffect(() => {
    let diff = Date.now() - Number(row.createdAtTimestamp) * 1000;
    diff = Math.floor(diff / 1000);
    setSecond(diff % 60);
    diff = Math.floor(diff / 60);
    setMinute(diff % 60);
    diff = Math.floor(diff / 60);
    setHour(diff % 24);
    diff = Math.floor(diff / 24);
    setDay(diff);
  }, []);

  return (
    <Typography variant="sm" weight={500} className="text-slate-50">
      {day ? day + "d " : ""}
      {hour ? hour + "h " : ""}
      {minute ? minute + "m " : ""}
      {second ? second + "s " : ""} ago
    </Typography>
  )
}
