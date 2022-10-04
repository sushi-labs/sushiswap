import { Subgraphs } from 'components/subgraphs/Subgraphs'
import { getAllSubgraphs } from 'lib'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const data = await getAllSubgraphs()

  return {
    props: {
      data,
    },
  }
}

function SubgraphsPage({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-6xl">
        <Subgraphs subgraphs={data} />
      </div>
    </div>
  )
}

export default SubgraphsPage
