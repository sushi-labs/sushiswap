import { testAPIRealOutputFromNative } from './index.js'
import { OneInchAPIRouteSimulate } from './route1inch.js'

const routeProjects: Record<string, typeof OneInchAPIRouteSimulate> = {
  '1inch': OneInchAPIRouteSimulate,
}

if (process.argv.length < 3) {
  console.log(
    'Usege: pnpm testRealOutput <route_project> <delay between simulations>',
  )
  console.log('route_projects:', Object.keys(routeProjects).join(', '))
  console.log('delay between simulations - ms, optional, default is 0')
} else {
  const routeProject = routeProjects[process.argv[2] as string]
  if (routeProject === undefined)
    console.log(`Error: unknown route project '${process.argv[2]}'`)
  else
    testAPIRealOutputFromNative(routeProject, parseInt(process.argv[3] ?? '0'))
}
