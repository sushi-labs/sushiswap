import Container from 'app/components/Container'
import Head from 'next/head'

export default function Dashboard() {
  return (
    <Container id="dashboard-page" className="py-4 md:py-8 lg:py-12" maxWidth="2xl">
      <Head>
        <title>Dashboard | Sushi</title>
        <meta name="description" content="Sushi" />
        <meta key="twitter:description" name="twitter:description" content="Sushi" />
        <meta key="og:description" property="og:description" content="Sushi" />
      </Head>
    </Container>
  )
}
