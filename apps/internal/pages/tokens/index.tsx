import { Tokens } from 'components/tokens/Tokens'
import { getTokens } from 'lib/tokens'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const data = await getTokens()

  return {
    props: {
      data,
    },
  }
}

function TokensPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-6xl">
        <Tokens tokens={data} />
      </div>
    </div>
  )
}

export default TokensPage
