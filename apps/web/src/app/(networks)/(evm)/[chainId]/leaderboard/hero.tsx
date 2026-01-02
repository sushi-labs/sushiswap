export const Hero = () => {
  return (
    <section className="flex flex-col gap-3 md:gap-6">
      <span className="text-3xl md:text-5xl font-bold">Points Leaderboard</span>
      <div className="flex justify-between flex-wrap gap-6">
        <span className="text-base md:text-xl w-[430px] md:w-[550px] text-muted-foreground">
          See the top traders by points and volume on SushiSwap across EVM
          networks.
        </span>
      </div>
    </section>
  )
}
