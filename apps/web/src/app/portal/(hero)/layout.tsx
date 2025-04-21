import { BeakerIcon, ClockIcon, GlobeIcon } from '@heroicons/react-v1/solid'
import { Card, CardContent, CloudinaryImage, Container } from '@sushiswap/ui'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row h-full justify-between">
      <div className="w-[49.5%] flex justify-center items-center">
        <Container maxWidth="md" className="space-y-14">
          <div className="text-center space-y-8">
            <span className="text-lg font-semibold">
              Sushi Swap API: Power your D'app to Swap Anything
            </span>
            <div className="flex justify-center">
              <CloudinaryImage
                alt="hero"
                src="sushi_developer_portal_hero_image.png"
                width={300}
                height={300}
                quality={100}
                className="object-cover"
              />
            </div>
          </div>
          <div className="gap-4 flex flex-row w-full">
            <Card className="w-full">
              <CardContent className="!pt-6 flex items-center">
                <div>
                  <GlobeIcon width={32} height={32} className="text-blue-500" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold">40+</span>
                  <span className="text-sm text-gray-500">Networks</span>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="!pt-6 flex items-center">
                <div>
                  <BeakerIcon
                    width={32}
                    height={32}
                    className="text-blue-500"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold">195</span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    Liquidity Sources
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardContent className="!pt-6 flex items-center">
                <ClockIcon width={32} height={32} className="text-blue-500" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">{`<170ms`}</span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    Response time
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      <div className="w-[49.5%] bg-secondary">
        <Container className="py-16 px-10 h-full">
          <div className="flex items-center relative h-full">{children}</div>
        </Container>
      </div>
    </div>
  )
}
