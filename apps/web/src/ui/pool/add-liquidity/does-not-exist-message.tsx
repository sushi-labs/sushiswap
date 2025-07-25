export const DoesNotExistMessage = () => {
  return (
    <div className="w-full p-3 bg-blue/[0.08] dark:bg-skyblue/[0.08] rounded-xl">
      <p className="text-sm text-blue dark:text-skyblue font-medium">
        This pool does not exist yet. It must be initialized before you can add
        liquidity. To initialize, select a starting price for the pool. Then,
        enter your liquidity price range and deposit amount. Gas fees will be
        higher than usual due to the initialization transaction.
      </p>
    </div>
  )
}
