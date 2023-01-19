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

if (!process.env.GC_SERVICE_ACCOUNT_EMAIL) {
  throw new Error('GC_SERVICE_ACCOUNT_EMAIL is not set')
}

const serviceClient = new run.v2.ServicesClient()
const schedulerClient = new scheduler.CloudSchedulerClient()

const GC_PROJECT_ID = process.env.GC_PROJECT_ID
const GC_SERVICE_NAME = process.env.GC_SERVICE_NAME
const GC_SERVICE_ACCOUNT_EMAIL = process.env.GC_SERVICE_ACCOUNT_EMAIL
const LOCATION_ID = 'us-east4'

async function main() {
  const servicePath = `projects/${GC_PROJECT_ID}/locations/us-central1/services/${GC_SERVICE_NAME}`
  const service = await serviceClient.getService({ name: servicePath })
  if (!service[0].uri) {
    throw new Error('No URI. Are you sure the service is deployed?')
  }
  const baseUrl = service[0].uri

  const additionalUrl = '/liquidity?chainId=10&version=V2&poolType=CONSTANT_PRODUCT_POOL'
  const name = 'test2'
  const existingJobs = await getExistingJobs()
  console.log(`Found a total of ${existingJobs.length} existing jobs`)
  console.log(existingJobs.map((job) => job.name).join(','))

  const existingJobNames = existingJobs.map((job) => job.name)
  const jobRequests = [createJobRequest(name, baseUrl, additionalUrl)]

  const createRequests = jobRequests.filter((request) => !existingJobNames.includes(request.job.name))
  const updateRequests: {
    parent: string
    job: scheduler.protos.google.cloud.scheduler.v1.IJob
  }[] = []
  let upToDateCount = 0
  existingJobs.forEach((job) => {
    jobRequests.forEach((request) => {
      if (job.name === request.job.name) {
        if (job.httpTarget?.oidcToken?.audience !== request.job.httpTarget?.oidcToken?.audience) {
          updateRequests.push(request)
        } else {
          upToDateCount++
        }
        return
      }
    })
  })

  console.log(
    `SUMMARY: ${createRequests.length} job needs to be created, ${updateRequests.length} jobs needs to be updated and ${upToDateCount} jobs are up to date.`
  )

  if (createRequests.length > 0 || updateRequests.length > 0) {
    const [jobsCreated, jobsUpdated] = await Promise.all([
      createRequests.map((request) => schedulerClient.createJob(request)),
      updateRequests.map((request) => schedulerClient.updateJob(request)),
    ])
    console.log(`Created ${jobsCreated.length} jobs and updated ${jobsUpdated.length} jobs`)
  } else {
    console.log('Not creating or updating any jobs')
  }
}

function createJobRequest(name: string, url: string, additionalUrl: string) {
  const schedulerPath = `projects/${GC_PROJECT_ID}/locations/${LOCATION_ID}`
  const job: scheduler.protos.google.cloud.scheduler.v1.IJob = {
    name: schedulerPath + '/jobs/' + name,
    httpTarget: {
      uri: url + additionalUrl,
      httpMethod: 'GET',
      headers: {
        'User-Agent': 'Google-Cloud-Scheduler',
      },
      oidcToken: {
        serviceAccountEmail: GC_SERVICE_ACCOUNT_EMAIL,
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

  return request
}

async function getExistingJobs() {
  const schedulerPath = `projects/${GC_PROJECT_ID}/locations/${LOCATION_ID}`
  const request = {
    parent: schedulerPath,
  }

  const [response] = await schedulerClient.listJobs(request)
  return response
}

main().catch(async (e) => {
  console.error(e)
  await serviceClient.close()
  await schedulerClient.close()
  process.exit(1)
})
