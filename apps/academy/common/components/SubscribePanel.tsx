import { Button, Container } from '@sushiswap/ui'

export const SubscribePanel = () => {
  return (
    <Container maxWidth="6xl" className="mx-auto sm:px-4">
      <div className="px-6 py-9 sm:px-14 sm:py-14 bg-[#E2E3E7] sm:rounded-2xl">
        <p className="w-full px-2 text-2xl font-bold text-center sm:text-left sm:text-3xl md:w-3/5">
          Get the latest Sushi Alpha delivered to your inbox.
        </p>
        <div className="flex h-16 mt-10">
          <div className="w-full sm:w-[340px] px-6 bg-white rounded-l-xl">
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
    </Container>
  )
}
