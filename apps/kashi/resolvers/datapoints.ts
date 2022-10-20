import { QueryResolvers } from '.graphclient'

// Return datapoints for use in charts
export const datapoints: QueryResolvers['datapoints'] = async (root, args, context, info) =>
  Promise.resolve({ x: [], y: [] })
