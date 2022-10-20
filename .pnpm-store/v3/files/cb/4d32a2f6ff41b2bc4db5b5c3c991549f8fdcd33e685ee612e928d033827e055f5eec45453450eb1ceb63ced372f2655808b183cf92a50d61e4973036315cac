export enum SafeAppAccessPolicyTypes {
  NoRestrictions = 'NO_RESTRICTIONS',
  DomainAllowlist = 'DOMAIN_ALLOWLIST',
}

export type SafeAppNoRestrictionsPolicy = {
  type: SafeAppAccessPolicyTypes.NoRestrictions
}

export type SafeAppDomainAllowlistPolicy = {
  type: SafeAppAccessPolicyTypes.DomainAllowlist
  value: string[]
}

export type SafeAppsAccessControlPolicies = SafeAppNoRestrictionsPolicy | SafeAppDomainAllowlistPolicy

export type SafeAppProvider = {
  url: string
  name: string
}

export type SafeAppData = {
  id: number
  url: string
  name: string
  iconUrl: string
  description: string
  chainIds: string[]
  provider?: SafeAppProvider
  accessControl: SafeAppsAccessControlPolicies
  tags: string[]
}

export type SafeAppsResponse = SafeAppData[]
