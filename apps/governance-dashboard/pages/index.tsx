import { Container } from '@sushiswap/ui'
import { Card } from 'components'

export default function Home() {
  return (
    <>
      <section className="bg-slate-800">
        <Container maxWidth="6xl" className="mx-auto flex px-4 py-8 justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              <p>Welcome to Sushi</p>
              <p>Governance & Treasury</p>
            </h1>
            <div>links</div>
            <div>buttons</div>
            <div>tabs</div>
          </div>
          <Card>stats</Card>
        </Container>
      </section>
      <section>
        <Container maxWidth="6xl" className="mx-auto px-4 py-8 justify-between">
          <div className="grid grid-cols-[1fr,2fr] gap-4 w-full">
            <div className="grid gap-4">
              <Card>Treasury balance</Card>
              <Card>Quarterly budget</Card>
              <Card>Runway</Card>
            </div>
            <Card>Treasury over time graph</Card>
          </div>

          <div className="grid grid-cols-2 w-full mt-4 gap-4">
            <Card>Treasury balance</Card>
            <Card>Quarterly budget</Card>
            <Card>Runway</Card>
            <Card>Runway</Card>
          </div>
        </Container>
      </section>
    </>
  )
}
