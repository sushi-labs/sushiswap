import 'dotenv/config'

import run from '@google-cloud/run'
import scheduler from '@google-cloud/scheduler'

if (!process.env.GC_PROJECT_NAME) {
  throw new Error('GC_PROJECT_NAME is not set')
}

if (!process.env.GC_PROJECT_ID) {
  throw new Error('GC_PROJECT_ID is not set')
}

if (!process.env.GC_SERVICE_NAME) {
  throw new Error('GC_SERVICE_NAME is not set')
}

const serviceClient = new run.v2.ServicesClient()
const schedulerClient = new scheduler.CloudSchedulerClient()

const GC_PROJECT_NAME = process.env.GC_PROJECT_NAME
const GC_PROJECT_ID = process.env.GC_PROJECT_ID
const GC_SERVICE_NAME = process.env.GC_SERVICE_NAME
const LOCATION_ID = 'us-east4'

async function main() {
  const servicePath = `projects/${GC_PROJECT_ID}/locations/us-central1/services/${GC_SERVICE_NAME}`
  const service = await serviceClient.getService({ name: servicePath })
  if (!service[0].uri) {
    throw new Error('No URI. Are you sure the service is deployed?')
  }
  const baseUrl = service[0].uri

  const additionalUrl = '/liquidity?chainId=10&version=V2&type=CONSTANT_PRODUCT_POOL'
  const name = 'test'
  await createJob(name, baseUrl, additionalUrl)
}

async function createJob(name: string, url: string, additionalUrl: string) {
  const schedulerPath = `projects/${GC_PROJECT_ID}/locations/${LOCATION_ID}`
  const job: scheduler.protos.google.cloud.scheduler.v1.IJob = {
    name,
    httpTarget: {
      uri: url + additionalUrl,
      httpMethod: 'GET',
      headers: {
        'User-Agent': 'Google-Cloud-Scheduler',
      },
      oidcToken: {
        serviceAccountEmail: `${GC_PROJECT_NAME}@${GC_PROJECT_ID}.iam.gserviceaccount.com`,
        audience: url,
      },
    },
    schedule: '1 * * * *',
    timeZone: 'Europe/London',
  }
  const request = {
    parent: schedulerPath,
    job: job,
  }

  // Use the client to send the job creation request.
  const [response] = await schedulerClient.createJob(request)
  console.log({ response })
  console.log(`Created job: ${response.name}`)
}

main()
  .then(async () => {
    await serviceClient.close()
    await schedulerClient.close()
  })
  .catch(async (e) => {
    console.error(e)
    await serviceClient.close()
    await schedulerClient.close()
    process.exit(1)
  })
