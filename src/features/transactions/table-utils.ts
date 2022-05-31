export const generateSummaryString = (
  pageIndex: number,
  pageSize: number,
  totalTransactions: number,
  noTransactionsString: string,
  isLoading: boolean,
  loadingString: string
): string => {
  if (totalTransactions === 0) {
    if (isLoading) return loadingString
    return noTransactionsString
  } else {
    const startingNumber = pageIndex * pageSize + 1
    const endingNumber = pageIndex * pageSize + pageSize
    return `${startingNumber}-${
      endingNumber < totalTransactions ? endingNumber : totalTransactions
    } of ${totalTransactions}`
  }
}

export const shortenAddress = (address: string): string => {
  const start = address.substring(0, 6)
  const end = address.substring(address.length - 4)
  return `${start}...${end}`
}
