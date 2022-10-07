import { TokenTable } from 'components/tokens/TokenTable'
import { getTokens, Token } from 'lib'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC } from 'react'

export const getServerSideProps: GetServerSideProps<{ data: Token[] }> = async ({ req, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const data = await getTokens()

  return {
    props: {
      data,
    },
  }
}

const TokensPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-6xl">
        <TokenTable tokens={data} />
      </div>
    </div>
  )
}

export default TokensPage
