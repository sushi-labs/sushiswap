import { KvmChainId, KvmToken } from 'sushi/kvm'

export const KVM_PAIR_TOKEN = new KvmToken({
  chainId: KvmChainId.KADENA,
  address: 'n.a',
  decimals: 12,
  symbol: 'KLP',
  name: 'Kadena LP Token',
})
