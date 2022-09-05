import { Button, classNames, Typography } from '@sushiswap/ui'

export const SubscribePanel = ({ className }: { className?: string }) => {
  return (
    <div className={classNames('p-14 bg-[#E2E3E7] rounded-2xl', className)}>
      <Typography variant="h2" weight={700} className="md:w-3/5">
        Get the latest Sushi Alpha delivered to your inbox.
      </Typography>
      <div className="flex h-16 mt-10">
        <div className="w-[340px] px-6 bg-white rounded-l-xl">
          <input
            // onChange={(e) => setQuery(e.target.value)}
            className="w-full h-16 font-medium bg-white text-slate-300 outline-0"
            placeholder="Enter your email address"
          />
        </div>
        <Button
          // TODO: implement
          onClick={() => null}
          className="w-24 min-h-full rounded-l-none bg-slate-800 rounded-r-xl"
        >
          Subscribe
        </Button>
      </div>
    </div>
  )
}
