import { PoolType } from '@sushiswap/trident-sdk'
import { ChipColor } from 'app/components/Chip'
import { classNames } from 'app/functions'

type PoolTypesInterface = Record<
  PoolType,
  {
    label: string
    label_long: string
    color: ChipColor
    description: string
    long_description: string
    image: { url: string; width: number; height: number }
  }
>

export const POOL_TYPES: PoolTypesInterface = {
  ConstantProduct: {
    label: 'Classic',
    label_long: 'Classic Pool',
    color: 'default',
    description: 'Most common, traditional 50/50 value split between assets',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
    image: {
      url: '/images/trident/a-b-pool.png',
      width: 121,
      height: 95,
    },
  },
  Weighted: {
    label: 'Index',
    label_long: 'Index Pool',
    color: 'yellow',
    description: 'Two asset pools, with the value split skewed higher towards one.',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
    image: {
      url: '/images/trident/index-pool-scale.png',
      width: 151,
      height: 95,
    },
  },
  ConcentratedLiquidity: {
    label: 'Concentrated',
    label_long: 'Concentrated Range',
    color: 'purple',
    description: 'Same value makeup of a classic pool, but for a specific price range',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
    image: {
      url: '/images/trident/a-b-pool.png',
      width: 151,
      height: 95,
    },
  },
  Hybrid: {
    label: 'Stable',
    label_long: 'Stable Pool',
    color: 'blue',
    description: '3 to 32 assets, with tokens deposited in equal values',
    long_description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim bibendum in ut amet, sit fames. Iaculis ultrices sit fermentum commodo nisl eget etiam fusce ac. Risus enim sollicitudin phasellus nibh. Neque turpis amet at scelerisque vitae nibh magna. Aliquet ut natoque quisque eget pellentesque id. Convallis enim.',
    image: {
      url: '/images/trident/a-b-pool.png',
      width: 121,
      height: 95,
    },
  },
}

export const TABLE_WRAPPER_DIV_CLASSNAME =
  'overflow-x-auto border border-dark-900 rounded shadow-md bg-[rgba(0,0,0,0.12)]'
export const TABLE_TABLE_CLASSNAME = 'w-full border-collapse'
// @ts-ignore TYPE NEEDS FIXING
export const TABLE_TR_TH_CLASSNAME = (i, length) =>
  classNames('text-secondary text-sm py-3', i === 0 ? 'pl-4 text-left' : 'text-right', i === length - 1 ? 'pr-4' : '')
export const TABLE_TBODY_TR_CLASSNAME = 'hover:bg-dark-900/40 hover:cursor-pointer'
// @ts-ignore TYPE NEEDS FIXING
export const TABLE_TBODY_TD_CLASSNAME = (i, length) =>
  classNames(
    'py-3 border-t border-dark-900 flex items-center',
    i === 0 ? 'pl-4 justify-start' : 'justify-end',
    i === length - 1 ? 'pr-4' : ''
  )
