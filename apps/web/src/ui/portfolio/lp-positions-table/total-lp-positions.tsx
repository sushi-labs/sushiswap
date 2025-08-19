const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
const totalUSD = 32123.23
export const TotalLPPositions = () => {
  return (
    <div className="font-semibold">
      LP Positions: {formatter.format(totalUSD)}
    </div>
  )
}
