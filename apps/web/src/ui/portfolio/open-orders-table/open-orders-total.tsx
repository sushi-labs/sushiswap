const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
const totalUSD = 32123.23
export const OpenOrdersTotal = () => {
  return (
    <div className="font-semibold">
      Open Orders: {formatter.format(totalUSD)}
    </div>
  )
}
