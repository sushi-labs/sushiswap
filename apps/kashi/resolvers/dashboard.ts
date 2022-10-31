import { QueryResolvers } from '.graphclient'

// Return data used in the dashboard
export const dashboard: QueryResolvers['dashboard'] = async (root, args, context, info) =>
  Promise.resolve({ lend: [], borrow: [] })
