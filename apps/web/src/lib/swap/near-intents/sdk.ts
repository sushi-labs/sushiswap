import {
  ApiError,
  OneClickService,
  OpenAPI,
} from '@defuse-protocol/one-click-sdk-typescript'
import { ZodError } from 'zod'

// JWT is read once at module load — partner credentials do not rotate at
// runtime, and per-request mutation of the SDK singleton would race if the
// token ever changed.
OpenAPI.TOKEN = process.env.NEAR_INTENTS_JWT || undefined

export const nearIntentsSdk: typeof OneClickService = OneClickService

function getApiErrorMessage(error: ApiError): string {
  if (
    error.body &&
    typeof error.body === 'object' &&
    'message' in error.body &&
    typeof error.body.message === 'string'
  ) {
    return error.body.message
  }

  return error.message
}

export function createNearIntentsErrorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      {
        message: getApiErrorMessage(error),
      },
      {
        status: error.status,
      },
    )
  }

  if (error instanceof ZodError) {
    return Response.json(
      {
        message: error.issues[0]?.message || 'Invalid NEAR Intents request',
      },
      {
        status: 400,
      },
    )
  }

  return Response.json(
    {
      message: 'Unexpected NEAR Intents request failure',
    },
    {
      status: 500,
    },
  )
}
