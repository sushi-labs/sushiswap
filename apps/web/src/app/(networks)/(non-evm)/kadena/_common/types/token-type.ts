import type { KvmToken } from 'sushi/kvm'

export type TokenWithBalance = KvmToken & { balance: string }
