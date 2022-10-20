export declare enum SafeAppAccessPolicyTypes {
    NoRestrictions = "NO_RESTRICTIONS",
    DomainAllowlist = "DOMAIN_ALLOWLIST"
}
export declare type SafeAppNoRestrictionsPolicy = {
    type: SafeAppAccessPolicyTypes.NoRestrictions;
};
export declare type SafeAppDomainAllowlistPolicy = {
    type: SafeAppAccessPolicyTypes.DomainAllowlist;
    value: string[];
};
export declare type SafeAppsAccessControlPolicies = SafeAppNoRestrictionsPolicy | SafeAppDomainAllowlistPolicy;
export declare type SafeAppProvider = {
    url: string;
    name: string;
};
export declare type SafeAppData = {
    id: number;
    url: string;
    name: string;
    iconUrl: string;
    description: string;
    chainIds: string[];
    provider?: SafeAppProvider;
    accessControl: SafeAppsAccessControlPolicies;
    tags: string[];
};
export declare type SafeAppsResponse = SafeAppData[];
