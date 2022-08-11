import { Typography } from '@sushiswap/ui'
import { Layout } from 'components'

const Earn = () => {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-3">
        <Typography variant="h2" weight={700} className="text-slate-50 text-center">
          Deposit To Earn
        </Typography>
        <div className="max-w-[640px]">
          {/*// TODO copywriting*/}
          <Typography variant="sm" weight={400} className="text-slate-300 text-center">
            Choose which type of auction you’d like to hold. Each of the three types has their own unique
            characteristics, so choose the one you think is most appropriate for your project.
          </Typography>
        </div>
      </div>
    </Layout>
  )
}

export default Earn
