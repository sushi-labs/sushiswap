import { useAllLists } from '../token-lists'

export default function TokenLists() {
  const tokenList = useAllLists()
  return (
    <>
      <h1>Token Lists</h1>
      {JSON.stringify(tokenList, undefined, 2)}
    </>
  )
}

// export async function getStaticProps() {
//   return {
//     props: {},
//   }
// }
