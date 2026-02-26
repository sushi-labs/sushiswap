import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Message,
  classNames,
  useForm,
} from '@sushiswap/ui'
import { useCallback, useMemo } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import {
  type EvmChainId,
  MASTERCHEF_ADDRESS,
  MINICHEF_ADDRESS,
  getEvmChainById,
} from 'sushi/evm'
import { useConnection, useSignTypedData } from 'wagmi'

export const V2MigrationNotice = ({ className }: { className?: string }) => {
  return (
    <Message className={classNames(className ?? '')}>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col">
          <p className="font-bold">V2 Migration Notice:</p>

          <p>
            If you had LPs staked in a MasterChef or MiniChef contracts, they
            have been migrated to a V3 position. If you would like to claim the
            underlying tokens, use the initiate claim button and fill out the
            form while connected with the wallet that made the LP staking
            transaction to start the claim process to receive the underlying
            tokens.
          </p>
        </div>

        <ClaimFormDialog />
      </div>
    </Message>
  )
}

type FormValues = {
  chainIds: Record<string, boolean>
}

const ClaimFormDialog = () => {
  const signTypedData = useSignTypedData()
  const { address } = useConnection()

  const allChainIds = useMemo(() => {
    const ids = new Set<string>([
      ...Object.keys(MASTERCHEF_ADDRESS),
      ...Object.keys(MINICHEF_ADDRESS),
    ])
    return [...ids]
  }, [])

  const defaulChainIds = useMemo(() => {
    const obj: Record<string, boolean> = {}
    allChainIds.forEach((id) => {
      obj[id] = true
    })
    return obj
  }, [allChainIds])

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { chainIds: defaulChainIds },
    mode: 'onChange',
  })

  const chainIdsMap = watch('chainIds')

  const selectedChainIds = useMemo(() => {
    const entries = Object.entries(chainIdsMap ?? {})
    return entries.filter(([, checked]) => checked).map(([id]) => BigInt(id))
  }, [chainIdsMap])

  const onSubmit = useCallback(
    async (_: FormValues) => {
      if (!address || selectedChainIds.length === 0) return

      try {
        const params = {
          types: {
            ClaimRequest: [
              { name: 'requester', type: 'address' },
              { name: 'chainId', type: 'uint256[]' },
              { name: 'message', type: 'string' },
            ],
          },
          primaryType: 'ClaimRequest' as const,
          message: {
            requester: address,
            chainId: selectedChainIds,
            message:
              'I am initiating a claim for my migrated V2 staked LPs to receive the underlying tokens.',
          },
        }
        const _signature = await signTypedData.mutateAsync(params)

        //send to params, sig, and address to api to verify and start claim process
      } catch (error) {
        console.log('Error initiating claim:', error)
      }
    },
    [address, selectedChainIds, signTypedData],
  )

  const sections = useMemo(
    () => [
      {
        title: 'MasterChef V1 & V2',
        key: 'masterchef',
        ids: Object.keys(MASTERCHEF_ADDRESS),
      },
      {
        title: 'MiniChef',
        key: 'minichef',
        ids: Object.keys(MINICHEF_ADDRESS),
      },
    ],
    [],
  )

  return (
    <Dialog>
      <Checker.Connect fullWidth size="default" namespace="evm">
        <DialogTrigger asChild>
          <Button fullWidth>Initiate Claim</Button>
        </DialogTrigger>
      </Checker.Connect>

      <DialogContent>
        <DialogHeader className="!text-left">
          <DialogTitle>Initiate Claim</DialogTitle>
          <DialogDescription>
            Select the chains you would like to claim your underlying tokens
            from.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 px-2 overflow-y-auto max-h-[calc(100vh-250px)] mb-4">
            {sections.map((section) => (
              <ChainSection
                key={section.key}
                title={section.title}
                sectionKey={section.key}
                ids={section.ids}
                register={register}
              />
            ))}
          </div>

          <Button
            fullWidth
            type="submit"
            disabled={!address || selectedChainIds.length === 0}
            loading={isSubmitting}
            size="lg"
          >
            Initiate Claim
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ChainSection({
  title,
  sectionKey,
  ids,
  register,
}: {
  title: string
  sectionKey: string
  ids: string[]
  register: ReturnType<typeof useForm<FormValues>>['register']
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold">{title}</div>

      {ids.map((chainId) => {
        const chainName =
          getEvmChainById(Number(chainId) as EvmChainId)?.name ||
          `Chain ${chainId}`

        return (
          <div
            key={`${sectionKey}-${chainId}`}
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              id={`${sectionKey}-${chainId}`}
              {...register(`chainIds.${chainId}`)}
            />
            <label htmlFor={`${sectionKey}-${chainId}`}>{chainName}</label>
          </div>
        )
      })}
    </div>
  )
}
