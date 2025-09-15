import { flag } from 'flags/next'

const bladeBranches = ['blade', 'flags']

export const bladeFlag = flag({
  key: 'blade',
  decide: () =>
    bladeBranches.includes(
      process.env['NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF'] || '',
    ),
})
