import 'dotenv/config'

import run from '@google-cloud/run'
import * as scheduler from '@google-cloud/scheduler'
import { chainShortName } from '@sushiswap/chain'
import { USDC_ADDRESS } from '@sushiswap/currency'

import { PoolType, Price, PROTOCOL_JOBS, ProtocolName, ProtocolVersion, TRACKED_CHAIN_IDS } from './config.js'

if (!process.env['GC_PROJECT_ID']) {
  throw new Error('GC_PROJECT_ID is not set')
}

if (!process.env['GC_SERVICE_NAME']) {
  throw new Error('GC_SERVICE_NAME is not set')
}

if (!process.env['GC_SERVICE_ACCOUNT_EMAIL']) {
  throw new Error('GC_SERVICE_ACCOUNT_EMAIL is not set')
}

const serviceClient = new run.v2.ServicesClient()
const schedulerClient = new scheduler.CloudSchedulerClient()

const GC_PROJECT_ID = process.env['GC_PROJECT_ID']
const GC_SERVICE_NAME = process.env['GC_SERVICE_NAME']
const GC_SERVICE_ACCOUNT_EMAIL = process.env['GC_SERVICE_ACCOUNT_EMAIL']
const LOCATION_ID = 'us-east4'

async function main() {
  const servicePath = `projects/${GC_PROJECT_ID}/locations/us-central1/services/${GC_SERVICE_NAME}`
  const service = await serviceClient.getService({ name: servicePath })
  if (!service[0].uri) {
    throw new Error('No URI. Are you sure the service is deployed?')
  }
  const baseUrl = service[0].uri

  const existingJobs = await getExistingJobs()
  console.log(`Found a total of ${existingJobs.length} existing jobs`)
  const existingJobNames = existingJobs.map((job) => job.name)

  const protocolRequests = PROTOCOL_JOBS.map((job) =>
    createProtocolJobRequest(job.protocol, job.version, job.poolType, baseUrl)
  )

  const chainRequests = TRACKED_CHAIN_IDS.flatMap((chainId) => {
    return [
      createReserveJobRequest(chainId, baseUrl),
      createPriceJobRequest(chainId, baseUrl),
      createLiquidityJobRequest(chainId, baseUrl),
    ]
  })

  const whitelistPoolRequest = createWhitelistPoolsRequest(baseUrl)

  const jobRequests = [...protocolRequests, ...chainRequests, whitelistPoolRequest]

  const createRequests = jobRequests.filter((request) => !existingJobNames.includes(request.job.name))
  const updateRequests: {
    parent: string
    job: scheduler.protos.google.cloud.scheduler.v1.IJob
  }[] = []
  let upToDateCount = 0
  existingJobs.forEach((job) => {
    jobRequests.forEach((request) => {
      if (job.name === request.job.name) {
        if (
          job.httpTarget?.oidcToken?.audience !== request.job.httpTarget?.oidcToken?.audience ||
          job.schedule !== request.job.schedule ||
          job.httpTarget?.uri !== request.job.httpTarget?.uri
        ) {
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

function createProtocolJobRequest(
  protocol: ProtocolName,
  version: ProtocolVersion | undefined,
  poolType: PoolType | undefined,
  baseUrl: string
) {
  const jobName = `PROTOCOL-${protocol}${version ? '-'.concat(version) : ''}${poolType ? '-'.concat(poolType) : ''}`
  const urlPath = `/protocol?name=${protocol}`
    .concat(version ? `&version=${version}` : '')
    .concat(poolType ? `&poolType=${poolType}` : '')
  return createJobRequest(jobName, baseUrl, urlPath, '* * * * *')
}

function createReserveJobRequest(chainId: number, baseUrl: string) {
  const urlPath = `/reserves?chainId=${chainId}`
  return createJobRequest(`RESERVES-${chainShortName[chainId]}-${chainId}`, baseUrl, urlPath, '10,25,40,55 * * * *')
}

function createLiquidityJobRequest(chainId: number, baseUrl: string) {
  const urlPath = `/liquidity?chainId=${chainId}`
  return createJobRequest(`LIQUIDITY-${chainShortName[chainId]}-${chainId}`, baseUrl, urlPath, '32,02 * * * *')
}

function createPriceJobRequest(chainId: number, baseUrl: string) {
  const usdcAddress = USDC_ADDRESS[chainId as keyof typeof USDC_ADDRESS]

  const urlPath = `/price?chainId=${chainId}&base=${usdcAddress}&price=${Price.USD}`
  return createJobRequest(`PRICES-${chainShortName[chainId]}-${chainId}`, baseUrl, urlPath, '13,28,43,58 * * * *')
}

function createWhitelistPoolsRequest(baseUrl: string) {
  const urlPath = '/whitelist-pools'
  return createJobRequest('WHITELIST-POOLS', baseUrl, urlPath, '18,48 * * * *')
}

function createJobRequest(name: string, url: string, additionalUrl: string, schedule: string) {
  const schedulerPath = `projects/${GC_PROJECT_ID}/locations/${LOCATION_ID}`
  const job: scheduler.protos.google.cloud.scheduler.v1.IJob = {
    name: `${schedulerPath}/jobs/${name}`,
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
    schedule,
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
