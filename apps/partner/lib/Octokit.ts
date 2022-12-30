import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from 'octokit'

export const getOctokit = (key: string) =>
  new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: 169875,
      privateKey: key?.replace(/\\n/g, '\n'),
      installationId: 23112528,
    },
  })
