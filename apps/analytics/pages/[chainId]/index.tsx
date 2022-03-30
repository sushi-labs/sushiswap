export default function Index({ chainId }) {
  console.log({ chainId })

  return <>Analytics for {chainId}</>
}

export async function getServerSideProps({ query }) {
  return {
    props: { chainId: query.chainId },
  }
}
