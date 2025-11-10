import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDIZVQLC3PKOZRPILQF3BF5NE2MKEUCGW6SUGKJFD6LAMCWDULUSN5NT",
  }
} as const


export interface Slot0Return {
  sqrt_price_x96: u256;
  tick: i32;
  unlocked: boolean;
}


export interface DescriptorTokenURIParams {
  fee: u32;
  pool_address: string;
  tick_current: i32;
  tick_lower: i32;
  tick_spacing: i32;
  tick_upper: i32;
  token0: string;
  token0_decimals: u32;
  token0_symbol: string;
  token1: string;
  token1_decimals: u32;
  token1_symbol: string;
  token_id: u32;
}


export interface PositionDataReturn {
  fee_growth_inside_0_last_x128: FixedPoint128;
  fee_growth_inside_1_last_x128: FixedPoint128;
  liquidity: u128;
  tokens_owed_0: u128;
  tokens_owed_1: u128;
}


export interface TickInfoReturn {
  fee_growth_outside_0_x128: FixedPoint128;
  fee_growth_outside_1_x128: FixedPoint128;
  initialized: boolean;
  liquidity_gross: u128;
  liquidity_net: i128;
  sec_per_liquidity_outside_x128: FixedPoint128;
  seconds_outside: u32;
  tick_cumulative_outside: i64;
}


export interface PoolKeyData {
  fee: u32;
  token0: string;
  token1: string;
}


export interface Position {
  fee_growth_inside0_last_x128: FixedPoint128;
  fee_growth_inside1_last_x128: FixedPoint128;
  liquidity: u128;
  nonce: u64;
  pool_id: u32;
  tick_lower: i32;
  tick_upper: i32;
  tokens_owed0: u128;
  tokens_owed1: u128;
}





export interface AddLiquidityParams {
  amount0_desired: u128;
  amount0_min: u128;
  amount1_desired: u128;
  amount1_min: u128;
  fee: u32;
  recipient: string;
  sender: string;
  tick_lower: i32;
  tick_upper: i32;
  token0: string;
  token1: string;
}


export interface IncreaseLiquidityParams {
  amount0_desired: u128;
  amount0_min: u128;
  amount1_desired: u128;
  amount1_min: u128;
  deadline: u64;
  operator: string;
  token_id: u32;
}


export interface DecreaseLiquidityParams {
  amount0_min: u128;
  amount1_min: u128;
  deadline: u64;
  liquidity: u128;
  operator: string;
  token_id: u32;
}


export interface CollectParams {
  amount0_max: u128;
  amount1_max: u128;
  operator: string;
  recipient: string;
  token_id: u32;
}


export interface MintParams {
  amount0_desired: u128;
  amount0_min: u128;
  amount1_desired: u128;
  amount1_min: u128;
  deadline: u64;
  fee: u32;
  recipient: string;
  sender: string;
  tick_lower: i32;
  tick_upper: i32;
  token0: string;
  token1: string;
}


/**
 * Return type for get_user_positions - contains full position data
 */
export interface UserPositionInfo {
  fee: u32;
  fee_growth_inside0_last_x128: u256;
  fee_growth_inside1_last_x128: u256;
  liquidity: u128;
  nonce: u64;
  tick_lower: i32;
  tick_upper: i32;
  token0: string;
  token1: string;
  token_id: u32;
  tokens_owed0: u128;
  tokens_owed1: u128;
}

/**
 * Storage keys for the contract
 */
export type DataKey = {tag: "HookModules", values: readonly [ComplianceHook]} | {tag: "Factory", values: void} | {tag: "XlmAddress", values: void} | {tag: "TokenDescriptor", values: void} | {tag: "Position", values: readonly [u32]} | {tag: "PoolIdToPoolKey", values: readonly [u32]} | {tag: "PoolIdsByAddress", values: readonly [string]} | {tag: "PoolIdToAddress", values: readonly [u32]} | {tag: "NextPoolId", values: void} | {tag: "NextTokenId", values: void} | {tag: "UserTokenIds", values: readonly [string]} | {tag: "OperatorApprovals", values: readonly [string, string]};

/**
 * Parameters required to construct a token URI (see original Solidity code for semantics)
 */
export interface ConstructTokenURIParams {
  base_token_address: string;
  base_token_decimals: u32;
  base_token_symbol: string;
  fee: u32;
  flip_ratio: boolean;
  pool_address: string;
  quote_token_address: string;
  quote_token_decimals: u32;
  quote_token_symbol: string;
  tick_current: i32;
  tick_lower: i32;
  tick_spacing: i32;
  tick_upper: i32;
  token_id: u64;
}


/**
 * Data structure for weighted tick aggregation across multiple pools
 */
export interface WeightedTickData {
  /**
 * Tick value from a pool
 */
tick: i32;
  /**
 * Weight for this tick (typically liquidity or volume)
 */
weight: u128;
}

/**
 * Error codes for the periphery base contract
 */
export const Errors = {
  /**
   * Transaction has exceeded the deadline
   */
  1001: {message:"TransactionTooOld"},
  /**
   * Contract has already been initialized
   */
  1002: {message:"AlreadyInitialized"},
  /**
   * Factory address has not been initialized
   */
  1003: {message:"FactoryNotInitialized"},
  /**
   * XLM address has not been initialized
   */
  1004: {message:"XlmAddressNotInitialized"},
  /**
   * Token does not exist
   */
  1005: {message:"TokenDoesNotExist"},
  /**
   * Not the owner of the token
   */
  1006: {message:"NotTokenOwner"},
  /**
   * Unauthorized operation
   */
  1007: {message:"Unauthorized"},
  /**
   * Insufficient token balance for operation
   */
  1008: {message:"InsufficientBalance"},
  /**
   * Tick range is invalid (lower >= upper)
   */
  1009: {message:"InvalidTickRange"},
  /**
   * Tick values are not aligned to pool tick spacing
   */
  1010: {message:"TickNotAligned"},
  /**
   * Tick is out of allowable bounds
   */
  1011: {message:"TickOutOfBounds"},
  /**
   * Expected pool not found or inaccessible
   */
  1012: {message:"PoolNotFound"},
  /**
   * Mathematical operation resulted in overflow
   */
  1013: {message:"MathOverflow"},
  /**
   * Price slippage check failed (amount received below minimum)
   */
  1014: {message:"PriceSlippageCheck"},
  /**
   * No tokens to collect (both amount0_max and amount1_max are zero)
   */
  1015: {message:"NothingToCollect"},
  /**
   * Tokens Not Ordered
   */
  1016: {message:"TokensNotOrdered"},
  /**
   * Liquidity calculation failed
   */
  1017: {message:"LiquidityCalculationFailed"},
  /**
   * Pool key data is missing for the given pool ID
   */
  1018: {message:"PoolKeyMissing"},
  /**
   * Token descriptor contract address is not set
   */
  1019: {message:"TokenDescriptorNotSet"},
  /**
   * No approved address for the given token
   */
  1020: {message:"NoApprovedAddress"},
  /**
   * Position must have zero liquidity and no owed tokens before burning
   */
  1021: {message:"PositionNotCleared"},
  /**
   * Hex string length is insufficient for the requested conversion
   */
  2001: {message:"HexLengthInsufficient"},
  /**
   * mul_div operation failed in liquidity calculation
   */
  2002: {message:"MulDivFailed"},
  /**
   * Invalid price range (division by zero)
   */
  2003: {message:"InvalidPriceRange"},
  /**
   * U256 to u128 conversion failed (overflow)
   */
  2004: {message:"U256ToU128ConversionFailed"}
}

/**
 * Storage keys for the data associated with the allowlist extension
 */
export type AllowListStorageKey = {tag: "Allowed", values: readonly [string]};



/**
 * Storage keys for the data associated with the blocklist extension
 */
export type BlockListStorageKey = {tag: "Blocked", values: readonly [string]};




/**
 * Storage keys for the data associated with the vault extension
 */
export type VaultStorageKey = {tag: "AssetAddress", values: void} | {tag: "VirtualDecimalsOffset", values: void};




/**
 * Storage key that maps to [`AllowanceData`]
 */
export interface AllowanceKey {
  owner: string;
  spender: string;
}


/**
 * Storage container for the amount of tokens for which an allowance is granted
 * and the ledger number at which this allowance expires.
 */
export interface AllowanceData {
  amount: i128;
  live_until_ledger: u32;
}

/**
 * Storage keys for the data associated with `FungibleToken`
 */
export type StorageKey = {tag: "TotalSupply", values: void} | {tag: "Balance", values: readonly [string]} | {tag: "Allowance", values: readonly [AllowanceKey]};


/**
 * Storage container for token metadata
 */
export interface Metadata {
  decimals: u32;
  name: string;
  symbol: string;
}

/**
 * Storage key for accessing the SAC address
 */
export type SACAdminGenericDataKey = {tag: "Sac", values: void};

/**
 * Storage key for accessing the SAC address
 */
export type SACAdminWrapperDataKey = {tag: "Sac", values: void};

export const FungibleTokenError = {
  /**
   * Indicates an error related to the current balance of account from which
   * tokens are expected to be transferred.
   */
  100: {message:"InsufficientBalance"},
  /**
   * Indicates a failure with the allowance mechanism when a given spender
   * doesn't have enough allowance.
   */
  101: {message:"InsufficientAllowance"},
  /**
   * Indicates an invalid value for `live_until_ledger` when setting an
   * allowance.
   */
  102: {message:"InvalidLiveUntilLedger"},
  /**
   * Indicates an error when an input that must be >= 0
   */
  103: {message:"LessThanZero"},
  /**
   * Indicates overflow when adding two values
   */
  104: {message:"MathOverflow"},
  /**
   * Indicates access to uninitialized metadata
   */
  105: {message:"UnsetMetadata"},
  /**
   * Indicates that the operation would have caused `total_supply` to exceed
   * the `cap`.
   */
  106: {message:"ExceededCap"},
  /**
   * Indicates the supplied `cap` is not a valid cap value.
   */
  107: {message:"InvalidCap"},
  /**
   * Indicates the Cap was not set.
   */
  108: {message:"CapNotSet"},
  /**
   * Indicates the SAC address was not set.
   */
  109: {message:"SACNotSet"},
  /**
   * Indicates a SAC address different than expected.
   */
  110: {message:"SACAddressMismatch"},
  /**
   * Indicates a missing function parameter in the SAC contract context.
   */
  111: {message:"SACMissingFnParam"},
  /**
   * Indicates an invalid function parameter in the SAC contract context.
   */
  112: {message:"SACInvalidFnParam"},
  /**
   * The user is not allowed to perform this operation
   */
  113: {message:"UserNotAllowed"},
  /**
   * The user is blocked and cannot perform this operation
   */
  114: {message:"UserBlocked"},
  /**
   * Indicates access to uninitialized vault asset address.
   */
  115: {message:"VaultAssetAddressNotSet"},
  /**
   * Indicates that vault asset address is already set.
   */
  116: {message:"VaultAssetAddressAlreadySet"},
  /**
   * Indicates that vault virtual decimals offset is already set.
   */
  117: {message:"VaultVirtualDecimalsOffsetAlreadySet"},
  /**
   * Indicates the amount is not a valid vault assets value.
   */
  118: {message:"VaultInvalidAssetsAmount"},
  /**
   * Indicates the amount is not a valid vault shares value.
   */
  119: {message:"VaultInvalidSharesAmount"},
  /**
   * Attempted to deposit more assets than the max amount for address.
   */
  120: {message:"VaultExceededMaxDeposit"},
  /**
   * Attempted to mint more shares than the max amount for address.
   */
  121: {message:"VaultExceededMaxMint"},
  /**
   * Attempted to withdraw more assets than the max amount for address.
   */
  122: {message:"VaultExceededMaxWithdraw"},
  /**
   * Attempted to redeem more shares than the max amount for address.
   */
  123: {message:"VaultExceededMaxRedeem"},
  /**
   * Maximum number of decimals offset exceeded
   */
  124: {message:"VaultMaxDecimalsOffsetExceeded"}
}





/**
 * Storage keys for the data associated with the consecutive extension of
 * `NonFungibleToken`
 */
export type NFTConsecutiveStorageKey = {tag: "Approval", values: readonly [u32]} | {tag: "Owner", values: readonly [u32]} | {tag: "OwnershipBucket", values: readonly [u32]} | {tag: "BurnedToken", values: readonly [u32]};



export interface OwnerTokensKey {
  index: u32;
  owner: string;
}

/**
 * Storage keys for the data associated with the enumerable extension of
 * `NonFungibleToken`
 */
export type NFTEnumerableStorageKey = {tag: "TotalSupply", values: void} | {tag: "OwnerTokens", values: readonly [OwnerTokensKey]} | {tag: "OwnerTokensIndex", values: readonly [u32]} | {tag: "GlobalTokens", values: readonly [u32]} | {tag: "GlobalTokensIndex", values: readonly [u32]};


/**
 * Storage container for royalty information
 */
export interface RoyaltyInfo {
  basis_points: u32;
  receiver: string;
}

/**
 * Storage keys for royalty data
 */
export type NFTRoyaltiesStorageKey = {tag: "DefaultRoyalty", values: void} | {tag: "TokenRoyalty", values: readonly [u32]};





/**
 * Storage container for the token for which an approval is granted
 * and the ledger number at which this approval expires.
 */
export interface ApprovalData {
  approved: string;
  live_until_ledger: u32;
}


/**
 * Storage container for token metadata
 */
export interface Metadata {
  base_uri: string;
  name: string;
  symbol: string;
}

/**
 * Storage keys for the data associated with `NonFungibleToken`
 */
export type NFTStorageKey = {tag: "Owner", values: readonly [u32]} | {tag: "Balance", values: readonly [string]} | {tag: "Approval", values: readonly [u32]} | {tag: "ApprovalForAll", values: readonly [string, string]} | {tag: "Metadata", values: void};

export type NFTSequentialStorageKey = {tag: "TokenIdCounter", values: void};

export const NonFungibleTokenError = {
  /**
   * Indicates a non-existent `token_id`.
   */
  200: {message:"NonExistentToken"},
  /**
   * Indicates an error related to the ownership over a particular token.
   * Used in transfers.
   */
  201: {message:"IncorrectOwner"},
  /**
   * Indicates a failure with the `operator`s approval. Used in transfers.
   */
  202: {message:"InsufficientApproval"},
  /**
   * Indicates a failure with the `approver` of a token to be approved. Used
   * in approvals.
   */
  203: {message:"InvalidApprover"},
  /**
   * Indicates an invalid value for `live_until_ledger` when setting
   * approvals.
   */
  204: {message:"InvalidLiveUntilLedger"},
  /**
   * Indicates overflow when adding two values
   */
  205: {message:"MathOverflow"},
  /**
   * Indicates all possible `token_id`s are already in use.
   */
  206: {message:"TokenIDsAreDepleted"},
  /**
   * Indicates an invalid amount to batch mint in `consecutive` extension.
   */
  207: {message:"InvalidAmount"},
  /**
   * Indicates the token does not exist in owner's list.
   */
  208: {message:"TokenNotFoundInOwnerList"},
  /**
   * Indicates the token does not exist in global list.
   */
  209: {message:"TokenNotFoundInGlobalList"},
  /**
   * Indicates access to unset metadata.
   */
  210: {message:"UnsetMetadata"},
  /**
   * Indicates the length of the base URI exceeds the maximum allowed.
   */
  211: {message:"BaseUriMaxLenExceeded"},
  /**
   * Indicates the royalty amount is higher than 10_000 (100%) basis points.
   */
  212: {message:"InvalidRoyaltyAmount"}
}






export interface SigningKey {
  public_key: Buffer;
  scheme: u32;
}

/**
 * Storage keys for claim issuer key management.
 */
export type ClaimIssuerStorageKey = {tag: "Topics", values: readonly [u32]} | {tag: "Registries", values: readonly [SigningKey]} | {tag: "RevokedClaim", values: readonly [Buffer]} | {tag: "ClaimNonce", values: readonly [string, u32]};


/**
 * Signature data for Ed25519 scheme.
 */
export interface Ed25519SignatureData {
  public_key: Buffer;
  signature: Buffer;
}


/**
 * Signature data for Secp256r1 scheme.
 */
export interface Secp256r1SignatureData {
  public_key: Buffer;
  signature: Buffer;
}


/**
 * Signature data for Secp256k1 scheme.
 */
export interface Secp256k1SignatureData {
  public_key: Buffer;
  recovery_id: u32;
  signature: Buffer;
}





export const ClaimIssuerError = {
  /**
   * Signature data length does not match the expected scheme.
   */
  350: {message:"SigDataMismatch"},
  /**
   * The provided key is empty.
   */
  351: {message:"KeyIsEmpty"},
  /**
   * The key is already allowed for the specified topic.
   */
  352: {message:"KeyAlreadyAllowed"},
  /**
   * The specified key was not found in the allowed keys.
   */
  353: {message:"KeyNotFound"},
  /**
   * The claim issuer is not registered at the claim topics and issuers
   * registry.
   */
  354: {message:"IssuerNotRegistered"},
  /**
   * The claim issuer is not allowed to sign claims about the specified
   * claim topic.
   */
  355: {message:"ClaimTopicNotAllowed"},
  /**
   * Maximum number of signing keys per topic exceeded.
   */
  356: {message:"MaxKeysPerTopicExceeded"},
  /**
   * Maximum number of registries per signing key exceeded.
   */
  357: {message:"MaxRegistriesPerKeyExceeded"},
  /**
   * No signing keys found for the specified claim topic.
   */
  358: {message:"NoKeysForTopic"}
}

/**
 * Storage keys for the data associated with the claim topics and issuers
 * extension
 */
export type ClaimTopicsAndIssuersStorageKey = {tag: "ClaimTopics", values: void} | {tag: "TrustedIssuers", values: void} | {tag: "IssuerClaimTopics", values: readonly [string]} | {tag: "ClaimTopicIssuers", values: readonly [u32]};

export const ClaimTopicsAndIssuersError = {
  /**
   * Indicates a non-existent claim topic.
   */
  370: {message:"ClaimTopicDoesNotExist"},
  /**
   * Indicates a non-existent trusted issuer.
   */
  371: {message:"IssuerDoesNotExist"},
  /**
   * Indicates a claim topic already exists.
   */
  372: {message:"ClaimTopicAlreadyExists"},
  /**
   * Indicates a trusted issuer already exists.
   */
  373: {message:"IssuerAlreadyExists"},
  /**
   * Indicates max claim topics limit is reached.
   */
  374: {message:"MaxClaimTopicsLimitReached"},
  /**
   * Indicates max trusted issuers limit is reached.
   */
  375: {message:"MaxIssuersLimitReached"},
  /**
   * Indicates claim topics set provided for the issuer cannot be empty.
   */
  376: {message:"ClaimTopicsSetCannotBeEmpty"}
}

/**
 * Hook types for modular compliance system.
 * 
 * Each hook type represents a specific event or validation point
 * where compliance modules can be executed.
 */
export type ComplianceHook = {tag: "Transferred", values: void} | {tag: "Created", values: void} | {tag: "Destroyed", values: void} | {tag: "CanTransfer", values: void} | {tag: "CanCreate", values: void};

export const ComplianceError = {
  /**
   * Indicates a module is already registered for this hook.
   */
  360: {message:"ModuleAlreadyRegistered"},
  /**
   * Indicates a module is not registered for this hook.
   */
  361: {message:"ModuleNotRegistered"},
  /**
   * Indicates a module bound is exceeded.
   */
  362: {message:"ModuleBoundExceeded"},
  /**
   * Indicates a token is not bound to this compliance contract.
   */
  363: {message:"TokenNotBound"}
}




/**
 * Represents a document with its metadata.
 */
export interface Document {
  /**
 * The hash of the document contents.
 */
document_hash: Buffer;
  /**
 * Timestamp when the document was last modified.
 */
timestamp: u64;
  /**
 * The URI where the document can be accessed.
 */
uri: string;
}

/**
 * Storage keys for document management.
 */
export type DocumentStorageKey = {tag: "DocumentIndex", values: readonly [Buffer]} | {tag: "DocumentBucket", values: readonly [u32]} | {tag: "DocumentCount", values: void};

/**
 * Error codes for document management operations.
 */
export const DocumentError = {
  /**
   * The specified document was not found.
   */
  380: {message:"DocumentNotFound"},
  /**
   * Maximum number of documents has been reached.
   */
  381: {message:"MaxDocumentsReached"}
}




/**
 * Represents a claim stored on-chain.
 */
export interface Claim {
  /**
 * The claim data
 */
data: Buffer;
  /**
 * The address of the claim issuer
 */
issuer: string;
  /**
 * The signature scheme used
 */
scheme: u32;
  /**
 * The cryptographic signature
 */
signature: Buffer;
  /**
 * The claim topic (numeric identifier)
 */
topic: u32;
  /**
 * Optional URI for additional information
 */
uri: string;
}

/**
 * Storage keys for the data associated with Identity Claims.
 */
export type ClaimsStorageKey = {tag: "Claim", values: readonly [Buffer]} | {tag: "ClaimsByTopic", values: readonly [u32]};

export const ClaimsError = {
  /**
   * Claim  ID does not exist.
   */
  340: {message:"ClaimNotFound"},
  /**
   * Claim Issuer cannot validate the claim (revocation, signature mismatch,
   * unauthorized signing key, etc.)
   */
  341: {message:"ClaimNotValid"}
}


export type CountryCode = string;

/**
 * Represents the type of identity holder
 */
export type IdentityType = {tag: "Individual", values: void} | {tag: "Organization", values: void};

/**
 * Represents different types of country relationships for individuals
 */
export type IndividualCountryRelation = {tag: "Residence", values: readonly [CountryCode]} | {tag: "Citizenship", values: readonly [CountryCode]} | {tag: "SourceOfFunds", values: readonly [CountryCode]} | {tag: "TaxResidency", values: readonly [CountryCode]} | {tag: "Custom", values: readonly [string, CountryCode]};

/**
 * Represents different types of country relationships for organizations
 */
export type OrganizationCountryRelation = {tag: "Incorporation", values: readonly [CountryCode]} | {tag: "OperatingJurisdiction", values: readonly [CountryCode]} | {tag: "TaxJurisdiction", values: readonly [CountryCode]} | {tag: "SourceOfFunds", values: readonly [CountryCode]} | {tag: "Custom", values: readonly [string, CountryCode]};

/**
 * Unified country relationship that can be either individual or organizational
 */
export type CountryRelation = {tag: "Individual", values: readonly [IndividualCountryRelation]} | {tag: "Organization", values: readonly [OrganizationCountryRelation]};


/**
 * A country data containing the country relationship and optional metadata
 */
export interface CountryData {
  /**
 * Type of country relationship
 */
country: CountryRelation;
  /**
 * Optional metadata (e.g., visa type, validity period)
 */
metadata: Option<Map<string, string>>;
}


/**
 * Complete identity profile containing identity type and country data
 */
export interface IdentityProfile {
  countries: Array<CountryData>;
  identity_type: IdentityType;
}

/**
 * Storage keys for the data associated with Identity Storage Registry.
 */
export type IRSStorageKey = {tag: "Identity", values: readonly [string]} | {tag: "IdentityProfile", values: readonly [string]} | {tag: "RecoveredTo", values: readonly [string]};

/**
 * Error codes for the Identity Registry Storage system.
 */
export const IRSError = {
  /**
   * An identity already exists for the given account.
   */
  320: {message:"IdentityOverwrite"},
  /**
   * No identity found for the given account.
   */
  321: {message:"IdentityNotFound"},
  /**
   * Country data not found at the specified index.
   */
  322: {message:"CountryDataNotFound"},
  /**
   * Identity can't be with empty country data list.
   */
  323: {message:"EmptyCountryList"},
  /**
   * The maximum number of country entries has been reached.
   */
  324: {message:"MaxCountryEntriesReached"},
  /**
   * Account has been recovered and cannot be used.
   */
  325: {message:"AccountRecovered"}
}








/**
 * Storage keys for the data associated with `RWA` token
 */
export type IdentityVerifierStorageKey = {tag: "ClaimTopicsAndIssuers", values: void} | {tag: "IdentityRegistryStorage", values: void};

/**
 * Storage keys for the data associated with `RWA` token
 */
export type RWAStorageKey = {tag: "AddressFrozen", values: readonly [string]} | {tag: "FrozenTokens", values: readonly [string]} | {tag: "Compliance", values: void} | {tag: "OnchainId", values: void} | {tag: "Version", values: void} | {tag: "IdentityVerifier", values: void};

/**
 * Storage keys for the token binder system.
 * 
 * - Tokens are stored in buckets of 100 addresses each
 * - Each bucket is a `Vec<Address>` stored under its bucket index
 * - Total count is tracked separately
 * - When a token is unbound, the last token is moved to fill the gap
 * (swap-remove pattern)
 */
export type TokenBinderStorageKey = {tag: "TokenBucket", values: readonly [u32]} | {tag: "TotalCount", values: void};

/**
 * Error codes for the Token Binder system.
 */
export const TokenBinderError = {
  /**
   * The specified token was not found in the bound tokens list.
   */
  330: {message:"TokenNotFound"},
  /**
   * Attempted to bind a token that is already bound.
   */
  331: {message:"TokenAlreadyBound"},
  /**
   * Total token capacity (MAX_TOKENS) has been reached.
   */
  332: {message:"MaxTokensReached"},
  /**
   * Batch bind size exceeded.
   */
  333: {message:"BindBatchTooLarge"},
  /**
   * The batch contains duplicates.
   */
  334: {message:"BindBatchDuplicates"}
}



export const RWAError = {
  /**
   * Indicates an error related to insufficient balance for the operation.
   */
  300: {message:"InsufficientBalance"},
  /**
   * Indicates an error when an input must be >= 0.
   */
  301: {message:"LessThanZero"},
  /**
   * Indicates the address is frozen and cannot perform operations.
   */
  302: {message:"AddressFrozen"},
  /**
   * Indicates insufficient free tokens (due to partial freezing).
   */
  303: {message:"InsufficientFreeTokens"},
  /**
   * Indicates an identity cannot be verified.
   */
  304: {message:"IdentityVerificationFailed"},
  /**
   * Indicates the transfer does not comply with the compliance rules.
   */
  305: {message:"TransferNotCompliant"},
  /**
   * Indicates the mint operation does not comply with the compliance rules.
   */
  306: {message:"MintNotCompliant"},
  /**
   * Indicates the compliance contract is not set.
   */
  307: {message:"ComplianceNotSet"},
  /**
   * Indicates the onchain ID is not set.
   */
  308: {message:"OnchainIdNotSet"},
  /**
   * Indicates the version is not set.
   */
  309: {message:"VersionNotSet"},
  /**
   * Indicates the claim topics and issuers contract is not set.
   */
  310: {message:"ClaimTopicsAndIssuersNotSet"},
  /**
   * Indicates the identity registry storage contract is not set.
   */
  311: {message:"IdentityRegistryStorageNotSet"},
  /**
   * Indicates the identity verifier contract is not set.
   */
  312: {message:"IdentityVerifierNotSet"},
  /**
   * Indicates the old account and new account have different identities.
   */
  313: {message:"IdentityMismatch"}
}











export const CryptoError = {
  /**
   * The merkle proof length is out of bounds.
   */
  1400: {message:"MerkleProofOutOfBounds"},
  /**
   * The index of the leaf is out of bounds.
   */
  1401: {message:"MerkleIndexOutOfBounds"},
  /**
   * No data in hasher state.
   */
  1402: {message:"HasherEmptyState"}
}

export type Rounding = {tag: "Floor", values: void} | {tag: "Ceil", values: void};

/**
 * Storage keys for the data associated with `MerkleDistributor`
 */
export type MerkleDistributorStorageKey = {tag: "Root", values: void} | {tag: "Claimed", values: readonly [u32]};

export const MerkleDistributorError = {
  /**
   * The merkle root is not set.
   */
  1300: {message:"RootNotSet"},
  /**
   * The provided index was already claimed.
   */
  1301: {message:"IndexAlreadyClaimed"},
  /**
   * The proof is invalid.
   */
  1302: {message:"InvalidProof"}
}



/**
 * Storage key for the pausable state
 */
export type PausableStorageKey = {tag: "Paused", values: void};

export const PausableError = {
  /**
   * The operation failed because the contract is paused.
   */
  1000: {message:"EnforcedPause"},
  /**
   * The operation failed because the contract is not paused.
   */
  1001: {message:"ExpectedPause"}
}



export const UpgradeableError = {
  /**
   * When migration is attempted but not allowed due to upgrade state.
   */
  1100: {message:"MigrationNotAllowed"}
}

/**
 * Q128.128 fixed-point number
 * 
 * Represents a number as: value / 2^128
 * 
 * Used exclusively for fee growth tracking in Uniswap V3 architecture.
 * For price calculations, use FixedPoint96 instead.
 */
export type FixedPoint128 = readonly [u256];

/**
 * Q64.96 fixed-point number
 * 
 * Internally stored as a U256 where the value represents:
 * `actual_value = stored_value / 2^96`
 */
export type FixedPoint96 = readonly [u256];

export type SqrtPriceX96 = readonly [u256];

export interface SwapStepResult {
  amount_in: u256;
  amount_out: u256;
  fee_amount: u256;
  sqrt_ratio_next: SqrtPriceX96;
}

export interface PositionTuple {
  nonce: u64;
  token0: string;
  token1: string;
  fee: u32;
  tickLower: i32;
  tickUpper: i32;
  liquidity: u128;
  feeGrowthInside0LastX128: u256;
  feeGrowthInside1LastX128: u256;
  tokensOwed0: u128;
  tokensOwed1: u128;
}

/**
 * 512-bit unsigned integer
 * 
 * Represented as two 256-bit components:
 * - `low`: bits 0-255
 * - `high`: bits 256-511
 * 
 * The actual value is: high * 2^256 + low
 */
export interface U512 {
  high: u256;
  low: u256;
}

export interface Client {
  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract
   * @param env The Soroban environment
   * @param admin The admin address for the contract
   * @param base_uri The base URI for token metadata
   */
  init: ({factory, xlm_address, token_descriptor}: {factory: string, xlm_address: string, token_descriptor: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a positions transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  positions: ({token_id}: {token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<PositionTuple>>>

  /**
   * Construct and simulate a mint transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Mint a new position NFT
   * Returns (token_id, liquidity, amount0, amount1)
   */
  mint: ({params}: {params: MintParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<readonly [u32, u128, u128, u128]>>>

  /**
   * Construct and simulate a increase_liquidity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Increase liquidity in an existing position
   * Returns (liquidity, amount0, amount1) - the liquidity and amounts added
   */
  increase_liquidity: ({params}: {params: IncreaseLiquidityParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128, u128]>>>

  /**
   * Construct and simulate a decrease_liquidity transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Decrease liquidity from a position
   * Returns (amount0, amount1) - the amounts of tokens removed
   */
  decrease_liquidity: ({params}: {params: DecreaseLiquidityParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>

  /**
   * Construct and simulate a collect transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  collect: ({params}: {params: CollectParams}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>

  /**
   * Construct and simulate a get_token_descriptor transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_token_descriptor: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_factory transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_factory: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_xlm_address transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_xlm_address: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a owner_of transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the owner of a token
   */
  owner_of: ({token_id}: {token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a name transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * NFT name (for wallets / explorers)
   */
  name: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a symbol transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * NFT symbol (for wallets / explorers)
   */
  symbol: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Number of position NFTs owned by an address
   */
  balance: ({owner}: {owner: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a transfer transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Transfer a token from one address to another
   * Requires authorization from the current owner
   */
  transfer: ({from, to, token_id}: {from: string, to: string, token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a approve transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Approve another address to transfer this token
   * Requires authorization from the owner
   */
  approve: ({owner, spender, token_id, expiration_ledger}: {owner: string, spender: string, token_id: u32, expiration_ledger: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_approved transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the approved address for a token
   */
  get_approved: ({token_id}: {token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<string>>>

  /**
   * Construct and simulate a approve_for_all transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set or revoke approval for an operator to manage all of the owner's NFTs
   * Mirrors ERC-721 setApprovalForAll
   */
  approve_for_all: ({owner, operator, approved}: {owner: string, operator: string, approved: boolean}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a is_approved_for_all transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns true if operator is approved to manage all of the owner’s NFTs
   */
  is_approved_for_all: ({owner, operator}: {owner: string, operator: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a transfer_from transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Transfer from an address (used by approved addresses)
   * The spender must provide authorization
   */
  transfer_from: ({spender, from, to, token_id}: {spender: string, from: string, to: string, token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a exists transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if token exists
   */
  exists: ({token_id}: {token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a token_uri transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * tokenURI-compatible: gathers all data and passes to descriptor
   */
  token_uri: ({token_id}: {token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a burn transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Burn an NFT position
   * Requires the position to have 0 liquidity and no tokens owed
   * 
   * Matches OpenZeppelin Stellar and Uniswap V3 standard: returns () and panics on error
   */
  burn: ({token_id}: {token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_user_token_ids transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all position token IDs owned by a user with pagination
   * Similar to Uniswap V3's Position Helper getUserPositions
   * 
   * Gas Optimization: O(1) lookup using ownership mapping
   * 
   * @param owner The address to query positions for
   * @param skip Number of positions to skip (for pagination)
   * @param take Maximum number of positions to return
   * @return Vec of token IDs
   */
  get_user_token_ids: ({owner, skip, take}: {owner: string, skip: u32, take: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<u32>>>

  /**
   * Construct and simulate a get_position_with_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get a single position with live fee calculations
   * Mirrors Solidity V3PositionHelper.getPosition
   * Unlike positions(), this calculates up-to-date fees by querying the pool
   * @param token_id The NFT token ID
   * @return UserPositionInfo with live tokensOwed values
   */
  get_position_with_fees: ({token_id}: {token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<UserPositionInfo>>>

  /**
   * Construct and simulate a get_positions_with_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get multiple positions with live fee calculations
   * Mirrors Solidity V3PositionHelper.getPositions
   * Unlike positions(), this calculates up-to-date fees by querying the pool
   * @param token_ids Vec of token IDs to query
   * @return Vec of UserPositionInfo with live tokensOwed values
   */
  get_positions_with_fees: ({token_ids}: {token_ids: Array<u32>}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<Array<UserPositionInfo>>>>

  /**
   * Construct and simulate a get_user_positions_with_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get all positions owned by a user with pagination and live fee calculations
   * Mirrors Solidity V3PositionHelper.getUserPositions
   * Returns positions with up-to-date fees automatically calculated
   * 
   * Gas Optimization: O(1) lookup using ownership mapping
   * 
   * @param owner The address to query positions for
   * @param skip Number of positions to skip (for pagination)
   * @param take Maximum number of positions to return
   * @return Vec of UserPositionInfo structs with live tokensOwed values
   */
  get_user_positions_with_fees: ({owner, skip, take}: {owner: string, skip: u32, take: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<Array<UserPositionInfo>>>>

  /**
   * Construct and simulate a position_principal transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Calculate the principal amounts of token0 and token1 for a position's liquidity
   * at a given sqrt price. Mirrors Uniswap V3's PositionValue.principal
   * @param token_id The NFT token ID
   * @param sqrt_price_x96 The sqrt price to use for calculation
   * @return (amount0, amount1) The principal amounts
   */
  position_principal: ({token_id, sqrt_price_x96}: {token_id: u32, sqrt_price_x96: u256}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>

  /**
   * Construct and simulate a position_fees transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Calculate the uncollected fees for a position
   * Mirrors Uniswap V3's PositionValue.fees
   * @param token_id The NFT token ID
   * @return (fees0, fees1) The uncollected fee amounts
   */
  position_fees: ({token_id}: {token_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>

  /**
   * Construct and simulate a position_total transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Calculate the total value of a position (principal + fees)
   * Mirrors Uniswap V3's PositionValue.total
   * @param token_id The NFT token ID
   * @param sqrt_price_x96 The sqrt price to use for principal calculation
   * @return (total0, total1) The total amounts of token0 and token1
   */
  position_total: ({token_id, sqrt_price_x96}: {token_id: u32, sqrt_price_x96: u256}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAC1Nsb3QwUmV0dXJuAAAAAAMAAAAAAAAADnNxcnRfcHJpY2VfeDk2AAAAAAAMAAAAAAAAAAR0aWNrAAAABQAAAAAAAAAIdW5sb2NrZWQAAAAB",
        "AAAAAQAAAAAAAAAAAAAAGERlc2NyaXB0b3JUb2tlblVSSVBhcmFtcwAAAA0AAAAAAAAAA2ZlZQAAAAAEAAAAAAAAAAxwb29sX2FkZHJlc3MAAAATAAAAAAAAAAx0aWNrX2N1cnJlbnQAAAAFAAAAAAAAAAp0aWNrX2xvd2VyAAAAAAAFAAAAAAAAAAx0aWNrX3NwYWNpbmcAAAAFAAAAAAAAAAp0aWNrX3VwcGVyAAAAAAAFAAAAAAAAAAZ0b2tlbjAAAAAAABMAAAAAAAAAD3Rva2VuMF9kZWNpbWFscwAAAAAEAAAAAAAAAA10b2tlbjBfc3ltYm9sAAAAAAAAEAAAAAAAAAAGdG9rZW4xAAAAAAATAAAAAAAAAA90b2tlbjFfZGVjaW1hbHMAAAAABAAAAAAAAAANdG9rZW4xX3N5bWJvbAAAAAAAABAAAAAAAAAACHRva2VuX2lkAAAABA==",
        "AAAAAQAAAAAAAAAAAAAAElBvc2l0aW9uRGF0YVJldHVybgAAAAAABQAAAAAAAAAdZmVlX2dyb3d0aF9pbnNpZGVfMF9sYXN0X3gxMjgAAAAAAAfQAAAADUZpeGVkUG9pbnQxMjgAAAAAAAAAAAAAHWZlZV9ncm93dGhfaW5zaWRlXzFfbGFzdF94MTI4AAAAAAAH0AAAAA1GaXhlZFBvaW50MTI4AAAAAAAAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAAAAAAA10b2tlbnNfb3dlZF8wAAAAAAAACgAAAAAAAAANdG9rZW5zX293ZWRfMQAAAAAAAAo=",
        "AAAAAQAAAAAAAAAAAAAADlRpY2tJbmZvUmV0dXJuAAAAAAAIAAAAAAAAABlmZWVfZ3Jvd3RoX291dHNpZGVfMF94MTI4AAAAAAAH0AAAAA1GaXhlZFBvaW50MTI4AAAAAAAAAAAAABlmZWVfZ3Jvd3RoX291dHNpZGVfMV94MTI4AAAAAAAH0AAAAA1GaXhlZFBvaW50MTI4AAAAAAAAAAAAAAtpbml0aWFsaXplZAAAAAABAAAAAAAAAA9saXF1aWRpdHlfZ3Jvc3MAAAAACgAAAAAAAAANbGlxdWlkaXR5X25ldAAAAAAAAAsAAAAAAAAAHnNlY19wZXJfbGlxdWlkaXR5X291dHNpZGVfeDEyOAAAAAAH0AAAAA1GaXhlZFBvaW50MTI4AAAAAAAAAAAAAA9zZWNvbmRzX291dHNpZGUAAAAABAAAAAAAAAAXdGlja19jdW11bGF0aXZlX291dHNpZGUAAAAABw==",
        "AAAAAQAAAAAAAAAAAAAAC1Bvb2xLZXlEYXRhAAAAAAMAAAAAAAAAA2ZlZQAAAAAEAAAAAAAAAAZ0b2tlbjAAAAAAABMAAAAAAAAABnRva2VuMQAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAACFBvc2l0aW9uAAAACQAAAAAAAAAcZmVlX2dyb3d0aF9pbnNpZGUwX2xhc3RfeDEyOAAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAAAAAAcZmVlX2dyb3d0aF9pbnNpZGUxX2xhc3RfeDEyOAAAB9AAAAANRml4ZWRQb2ludDEyOAAAAAAAAAAAAAAJbGlxdWlkaXR5AAAAAAAACgAAAAAAAAAFbm9uY2UAAAAAAAAGAAAAAAAAAAdwb29sX2lkAAAAAAQAAAAAAAAACnRpY2tfbG93ZXIAAAAAAAUAAAAAAAAACnRpY2tfdXBwZXIAAAAAAAUAAAAAAAAADHRva2Vuc19vd2VkMAAAAAoAAAAAAAAADHRva2Vuc19vd2VkMQAAAAo=",
        "AAAABQAAAAAAAAAAAAAAFkluY3JlYXNlTGlxdWlkaXR5RXZlbnQAAAAAAAEAAAASaW5jcmVhc2VfbGlxdWlkaXR5AAAAAAAEAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAAFkRlY3JlYXNlTGlxdWlkaXR5RXZlbnQAAAAAAAEAAAASZGVjcmVhc2VfbGlxdWlkaXR5AAAAAAAEAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAAAAAAAAlsaXF1aWRpdHkAAAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAAI=",
        "AAAABQAAAAAAAAAAAAAADENvbGxlY3RFdmVudAAAAAEAAAAHY29sbGVjdAAAAAAEAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAAAAAAAAlyZWNpcGllbnQAAAAAAAATAAAAAAAAAAAAAAAHYW1vdW50MAAAAAAKAAAAAAAAAAAAAAAHYW1vdW50MQAAAAAKAAAAAAAAAAI=",
        "AAAAAQAAAAAAAAAAAAAAEkFkZExpcXVpZGl0eVBhcmFtcwAAAAAACwAAAAAAAAAPYW1vdW50MF9kZXNpcmVkAAAAAAoAAAAAAAAAC2Ftb3VudDBfbWluAAAAAAoAAAAAAAAAD2Ftb3VudDFfZGVzaXJlZAAAAAAKAAAAAAAAAAthbW91bnQxX21pbgAAAAAKAAAAAAAAAANmZWUAAAAABAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAp0aWNrX2xvd2VyAAAAAAAFAAAAAAAAAAp0aWNrX3VwcGVyAAAAAAAFAAAAAAAAAAZ0b2tlbjAAAAAAABMAAAAAAAAABnRva2VuMQAAAAAAEw==",
        "AAAAAQAAAAAAAAAAAAAAF0luY3JlYXNlTGlxdWlkaXR5UGFyYW1zAAAAAAcAAAAAAAAAD2Ftb3VudDBfZGVzaXJlZAAAAAAKAAAAAAAAAAthbW91bnQwX21pbgAAAAAKAAAAAAAAAA9hbW91bnQxX2Rlc2lyZWQAAAAACgAAAAAAAAALYW1vdW50MV9taW4AAAAACgAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAAAAAAhvcGVyYXRvcgAAABMAAAAAAAAACHRva2VuX2lkAAAABA==",
        "AAAAAQAAAAAAAAAAAAAAF0RlY3JlYXNlTGlxdWlkaXR5UGFyYW1zAAAAAAYAAAAAAAAAC2Ftb3VudDBfbWluAAAAAAoAAAAAAAAAC2Ftb3VudDFfbWluAAAAAAoAAAAAAAAACGRlYWRsaW5lAAAABgAAAAAAAAAJbGlxdWlkaXR5AAAAAAAACgAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAAAAAAh0b2tlbl9pZAAAAAQ=",
        "AAAAAQAAAAAAAAAAAAAADUNvbGxlY3RQYXJhbXMAAAAAAAAFAAAAAAAAAAthbW91bnQwX21heAAAAAAKAAAAAAAAAAthbW91bnQxX21heAAAAAAKAAAAAAAAAAhvcGVyYXRvcgAAABMAAAAAAAAACXJlY2lwaWVudAAAAAAAABMAAAAAAAAACHRva2VuX2lkAAAABA==",
        "AAAAAQAAAAAAAAAAAAAACk1pbnRQYXJhbXMAAAAAAAwAAAAAAAAAD2Ftb3VudDBfZGVzaXJlZAAAAAAKAAAAAAAAAAthbW91bnQwX21pbgAAAAAKAAAAAAAAAA9hbW91bnQxX2Rlc2lyZWQAAAAACgAAAAAAAAALYW1vdW50MV9taW4AAAAACgAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAAAAAANmZWUAAAAABAAAAAAAAAAJcmVjaXBpZW50AAAAAAAAEwAAAAAAAAAGc2VuZGVyAAAAAAATAAAAAAAAAAp0aWNrX2xvd2VyAAAAAAAFAAAAAAAAAAp0aWNrX3VwcGVyAAAAAAAFAAAAAAAAAAZ0b2tlbjAAAAAAABMAAAAAAAAABnRva2VuMQAAAAAAEw==",
        "AAAAAQAAAEBSZXR1cm4gdHlwZSBmb3IgZ2V0X3VzZXJfcG9zaXRpb25zIC0gY29udGFpbnMgZnVsbCBwb3NpdGlvbiBkYXRhAAAAAAAAABBVc2VyUG9zaXRpb25JbmZvAAAADAAAAAAAAAADZmVlAAAAAAQAAAAAAAAAHGZlZV9ncm93dGhfaW5zaWRlMF9sYXN0X3gxMjgAAAAMAAAAAAAAABxmZWVfZ3Jvd3RoX2luc2lkZTFfbGFzdF94MTI4AAAADAAAAAAAAAAJbGlxdWlkaXR5AAAAAAAACgAAAAAAAAAFbm9uY2UAAAAAAAAGAAAAAAAAAAp0aWNrX2xvd2VyAAAAAAAFAAAAAAAAAAp0aWNrX3VwcGVyAAAAAAAFAAAAAAAAAAZ0b2tlbjAAAAAAABMAAAAAAAAABnRva2VuMQAAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAAAAAAx0b2tlbnNfb3dlZDAAAAAKAAAAAAAAAAx0b2tlbnNfb3dlZDEAAAAK",
        "AAAAAgAAAB1TdG9yYWdlIGtleXMgZm9yIHRoZSBjb250cmFjdAAAAAAAAAAAAAAHRGF0YUtleQAAAAALAAAAAAAAAAAAAAAHRmFjdG9yeQAAAAAAAAAAAAAAAApYbG1BZGRyZXNzAAAAAAAAAAAAAAAAAA9Ub2tlbkRlc2NyaXB0b3IAAAAAAQAAAAAAAAAIUG9zaXRpb24AAAABAAAABAAAAAEAAAAAAAAAD1Bvb2xJZFRvUG9vbEtleQAAAAABAAAABAAAAAEAAAAAAAAAEFBvb2xJZHNCeUFkZHJlc3MAAAABAAAAEwAAAAEAAAAAAAAAD1Bvb2xJZFRvQWRkcmVzcwAAAAABAAAABAAAAAAAAAAAAAAACk5leHRQb29sSWQAAAAAAAAAAAAAAAAAC05leHRUb2tlbklkAAAAAAEAAAAAAAAADFVzZXJUb2tlbklkcwAAAAEAAAATAAAAAQAAAEtPcGVyYXRvciBhcHByb3ZhbHMgZm9yIGFsbCB0b2tlbnMgb3duZWQgYnkgYEFkZHJlc3NgIGZvciBgQWRkcmVzc2Agb3BlcmF0b3IAAAAAEU9wZXJhdG9yQXBwcm92YWxzAAAAAAAAAgAAABMAAAAT",
        "AAAAAAAAAJpJbml0aWFsaXplIHRoZSBjb250cmFjdApAcGFyYW0gZW52IFRoZSBTb3JvYmFuIGVudmlyb25tZW50CkBwYXJhbSBhZG1pbiBUaGUgYWRtaW4gYWRkcmVzcyBmb3IgdGhlIGNvbnRyYWN0CkBwYXJhbSBiYXNlX3VyaSBUaGUgYmFzZSBVUkkgZm9yIHRva2VuIG1ldGFkYXRhAAAAAAAEaW5pdAAAAAMAAAAAAAAAB2ZhY3RvcnkAAAAAEwAAAAAAAAALeGxtX2FkZHJlc3MAAAAAEwAAAAAAAAAQdG9rZW5fZGVzY3JpcHRvcgAAABMAAAAA",
        "AAAAAAAAAAAAAAAJcG9zaXRpb25zAAAAAAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAA+kAAAfQAAAADVBvc2l0aW9uVHVwbGUAAAAAAAAD",
        "AAAAAAAAAEdNaW50IGEgbmV3IHBvc2l0aW9uIE5GVApSZXR1cm5zICh0b2tlbl9pZCwgbGlxdWlkaXR5LCBhbW91bnQwLCBhbW91bnQxKQAAAAAEbWludAAAAAEAAAAAAAAABnBhcmFtcwAAAAAH0AAAAApNaW50UGFyYW1zAAAAAAABAAAD6QAAA+0AAAAEAAAABAAAAAoAAAAKAAAACgAAAAM=",
        "AAAAAAAAAHJJbmNyZWFzZSBsaXF1aWRpdHkgaW4gYW4gZXhpc3RpbmcgcG9zaXRpb24KUmV0dXJucyAobGlxdWlkaXR5LCBhbW91bnQwLCBhbW91bnQxKSAtIHRoZSBsaXF1aWRpdHkgYW5kIGFtb3VudHMgYWRkZWQAAAAAABJpbmNyZWFzZV9saXF1aWRpdHkAAAAAAAEAAAAAAAAABnBhcmFtcwAAAAAH0AAAABdJbmNyZWFzZUxpcXVpZGl0eVBhcmFtcwAAAAABAAAD6QAAA+0AAAADAAAACgAAAAoAAAAKAAAAAw==",
        "AAAAAAAAAF1EZWNyZWFzZSBsaXF1aWRpdHkgZnJvbSBhIHBvc2l0aW9uClJldHVybnMgKGFtb3VudDAsIGFtb3VudDEpIC0gdGhlIGFtb3VudHMgb2YgdG9rZW5zIHJlbW92ZWQAAAAAAAASZGVjcmVhc2VfbGlxdWlkaXR5AAAAAAABAAAAAAAAAAZwYXJhbXMAAAAAB9AAAAAXRGVjcmVhc2VMaXF1aWRpdHlQYXJhbXMAAAAAAQAAA+kAAAPtAAAAAgAAAAoAAAAKAAAAAw==",
        "AAAAAAAAAAAAAAAHY29sbGVjdAAAAAABAAAAAAAAAAZwYXJhbXMAAAAAB9AAAAANQ29sbGVjdFBhcmFtcwAAAAAAAAEAAAPpAAAD7QAAAAIAAAAKAAAACgAAAAM=",
        "AAAAAAAAAAAAAAAUZ2V0X3Rva2VuX2Rlc2NyaXB0b3IAAAAAAAAAAQAAABM=",
        "AAAAAAAAAAAAAAALZ2V0X2ZhY3RvcnkAAAAAAAAAAAEAAAAT",
        "AAAAAAAAAAAAAAAPZ2V0X3hsbV9hZGRyZXNzAAAAAAAAAAABAAAAEw==",
        "AAAAAAAAABhHZXQgdGhlIG93bmVyIG9mIGEgdG9rZW4AAAAIb3duZXJfb2YAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAAEw==",
        "AAAAAAAAACJORlQgbmFtZSAoZm9yIHdhbGxldHMgLyBleHBsb3JlcnMpAAAAAAAEbmFtZQAAAAAAAAABAAAAEA==",
        "AAAAAAAAACRORlQgc3ltYm9sIChmb3Igd2FsbGV0cyAvIGV4cGxvcmVycykAAAAGc3ltYm9sAAAAAAAAAAAAAQAAABA=",
        "AAAAAAAAACtOdW1iZXIgb2YgcG9zaXRpb24gTkZUcyBvd25lZCBieSBhbiBhZGRyZXNzAAAAAAdiYWxhbmNlAAAAAAEAAAAAAAAABW93bmVyAAAAAAAAEwAAAAEAAAAE",
        "AAAAAAAAAFpUcmFuc2ZlciBhIHRva2VuIGZyb20gb25lIGFkZHJlc3MgdG8gYW5vdGhlcgpSZXF1aXJlcyBhdXRob3JpemF0aW9uIGZyb20gdGhlIGN1cnJlbnQgb3duZXIAAAAAAAh0cmFuc2ZlcgAAAAMAAAAAAAAABGZyb20AAAATAAAAAAAAAAJ0bwAAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAA==",
        "AAAAAAAAAFRBcHByb3ZlIGFub3RoZXIgYWRkcmVzcyB0byB0cmFuc2ZlciB0aGlzIHRva2VuClJlcXVpcmVzIGF1dGhvcml6YXRpb24gZnJvbSB0aGUgb3duZXIAAAAHYXBwcm92ZQAAAAAEAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAB3NwZW5kZXIAAAAAEwAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAAAAABFleHBpcmF0aW9uX2xlZGdlcgAAAAAAAAQAAAAA",
        "AAAAAAAAACRHZXQgdGhlIGFwcHJvdmVkIGFkZHJlc3MgZm9yIGEgdG9rZW4AAAAMZ2V0X2FwcHJvdmVkAAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAA+gAAAAT",
        "AAAAAAAAAGpTZXQgb3IgcmV2b2tlIGFwcHJvdmFsIGZvciBhbiBvcGVyYXRvciB0byBtYW5hZ2UgYWxsIG9mIHRoZSBvd25lcidzIE5GVHMKTWlycm9ycyBFUkMtNzIxIHNldEFwcHJvdmFsRm9yQWxsAAAAAAAPYXBwcm92ZV9mb3JfYWxsAAAAAAMAAAAAAAAABW93bmVyAAAAAAAAEwAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAAAAAAhhcHByb3ZlZAAAAAEAAAAA",
        "AAAAAAAAAEhSZXR1cm5zIHRydWUgaWYgb3BlcmF0b3IgaXMgYXBwcm92ZWQgdG8gbWFuYWdlIGFsbCBvZiB0aGUgb3duZXLigJlzIE5GVHMAAAATaXNfYXBwcm92ZWRfZm9yX2FsbAAAAAACAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAEAAAAB",
        "AAAAAAAAAFxUcmFuc2ZlciBmcm9tIGFuIGFkZHJlc3MgKHVzZWQgYnkgYXBwcm92ZWQgYWRkcmVzc2VzKQpUaGUgc3BlbmRlciBtdXN0IHByb3ZpZGUgYXV0aG9yaXphdGlvbgAAAA10cmFuc2Zlcl9mcm9tAAAAAAAABAAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAAAAAARmcm9tAAAAEwAAAAAAAAACdG8AAAAAABMAAAAAAAAACHRva2VuX2lkAAAABAAAAAA=",
        "AAAAAAAAABVDaGVjayBpZiB0b2tlbiBleGlzdHMAAAAAAAAGZXhpc3RzAAAAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAAAQ==",
        "AAAAAAAAAD50b2tlblVSSS1jb21wYXRpYmxlOiBnYXRoZXJzIGFsbCBkYXRhIGFuZCBwYXNzZXMgdG8gZGVzY3JpcHRvcgAAAAAACXRva2VuX3VyaQAAAAAAAAEAAAAAAAAACHRva2VuX2lkAAAABAAAAAEAAAAQ",
        "AAAAAAAAAKdCdXJuIGFuIE5GVCBwb3NpdGlvbgpSZXF1aXJlcyB0aGUgcG9zaXRpb24gdG8gaGF2ZSAwIGxpcXVpZGl0eSBhbmQgbm8gdG9rZW5zIG93ZWQKCk1hdGNoZXMgT3BlblplcHBlbGluIFN0ZWxsYXIgYW5kIFVuaXN3YXAgVjMgc3RhbmRhcmQ6IHJldHVybnMgKCkgYW5kIHBhbmljcyBvbiBlcnJvcgAAAAAEYnVybgAAAAEAAAAAAAAACHRva2VuX2lkAAAABAAAAAA=",
        "AAAAAAAAAV9HZXQgYWxsIHBvc2l0aW9uIHRva2VuIElEcyBvd25lZCBieSBhIHVzZXIgd2l0aCBwYWdpbmF0aW9uClNpbWlsYXIgdG8gVW5pc3dhcCBWMydzIFBvc2l0aW9uIEhlbHBlciBnZXRVc2VyUG9zaXRpb25zCgpHYXMgT3B0aW1pemF0aW9uOiBPKDEpIGxvb2t1cCB1c2luZyBvd25lcnNoaXAgbWFwcGluZwoKQHBhcmFtIG93bmVyIFRoZSBhZGRyZXNzIHRvIHF1ZXJ5IHBvc2l0aW9ucyBmb3IKQHBhcmFtIHNraXAgTnVtYmVyIG9mIHBvc2l0aW9ucyB0byBza2lwIChmb3IgcGFnaW5hdGlvbikKQHBhcmFtIHRha2UgTWF4aW11bSBudW1iZXIgb2YgcG9zaXRpb25zIHRvIHJldHVybgpAcmV0dXJuIFZlYyBvZiB0b2tlbiBJRHMAAAAAEmdldF91c2VyX3Rva2VuX2lkcwAAAAAAAwAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAARza2lwAAAABAAAAAAAAAAEdGFrZQAAAAQAAAABAAAD6gAAAAQ=",
        "AAAAAAAAAP1HZXQgYSBzaW5nbGUgcG9zaXRpb24gd2l0aCBsaXZlIGZlZSBjYWxjdWxhdGlvbnMKTWlycm9ycyBTb2xpZGl0eSBWM1Bvc2l0aW9uSGVscGVyLmdldFBvc2l0aW9uClVubGlrZSBwb3NpdGlvbnMoKSwgdGhpcyBjYWxjdWxhdGVzIHVwLXRvLWRhdGUgZmVlcyBieSBxdWVyeWluZyB0aGUgcG9vbApAcGFyYW0gdG9rZW5faWQgVGhlIE5GVCB0b2tlbiBJRApAcmV0dXJuIFVzZXJQb3NpdGlvbkluZm8gd2l0aCBsaXZlIHRva2Vuc093ZWQgdmFsdWVzAAAAAAAAFmdldF9wb3NpdGlvbl93aXRoX2ZlZXMAAAAAAAEAAAAAAAAACHRva2VuX2lkAAAABAAAAAEAAAPpAAAH0AAAABBVc2VyUG9zaXRpb25JbmZvAAAAAw==",
        "AAAAAAAAARBHZXQgbXVsdGlwbGUgcG9zaXRpb25zIHdpdGggbGl2ZSBmZWUgY2FsY3VsYXRpb25zCk1pcnJvcnMgU29saWRpdHkgVjNQb3NpdGlvbkhlbHBlci5nZXRQb3NpdGlvbnMKVW5saWtlIHBvc2l0aW9ucygpLCB0aGlzIGNhbGN1bGF0ZXMgdXAtdG8tZGF0ZSBmZWVzIGJ5IHF1ZXJ5aW5nIHRoZSBwb29sCkBwYXJhbSB0b2tlbl9pZHMgVmVjIG9mIHRva2VuIElEcyB0byBxdWVyeQpAcmV0dXJuIFZlYyBvZiBVc2VyUG9zaXRpb25JbmZvIHdpdGggbGl2ZSB0b2tlbnNPd2VkIHZhbHVlcwAAABdnZXRfcG9zaXRpb25zX3dpdGhfZmVlcwAAAAABAAAAAAAAAAl0b2tlbl9pZHMAAAAAAAPqAAAABAAAAAEAAAPpAAAD6gAAB9AAAAAQVXNlclBvc2l0aW9uSW5mbwAAAAM=",
        "AAAAAAAAAdVHZXQgYWxsIHBvc2l0aW9ucyBvd25lZCBieSBhIHVzZXIgd2l0aCBwYWdpbmF0aW9uIGFuZCBsaXZlIGZlZSBjYWxjdWxhdGlvbnMKTWlycm9ycyBTb2xpZGl0eSBWM1Bvc2l0aW9uSGVscGVyLmdldFVzZXJQb3NpdGlvbnMKUmV0dXJucyBwb3NpdGlvbnMgd2l0aCB1cC10by1kYXRlIGZlZXMgYXV0b21hdGljYWxseSBjYWxjdWxhdGVkCgpHYXMgT3B0aW1pemF0aW9uOiBPKDEpIGxvb2t1cCB1c2luZyBvd25lcnNoaXAgbWFwcGluZwoKQHBhcmFtIG93bmVyIFRoZSBhZGRyZXNzIHRvIHF1ZXJ5IHBvc2l0aW9ucyBmb3IKQHBhcmFtIHNraXAgTnVtYmVyIG9mIHBvc2l0aW9ucyB0byBza2lwIChmb3IgcGFnaW5hdGlvbikKQHBhcmFtIHRha2UgTWF4aW11bSBudW1iZXIgb2YgcG9zaXRpb25zIHRvIHJldHVybgpAcmV0dXJuIFZlYyBvZiBVc2VyUG9zaXRpb25JbmZvIHN0cnVjdHMgd2l0aCBsaXZlIHRva2Vuc093ZWQgdmFsdWVzAAAAAAAAHGdldF91c2VyX3Bvc2l0aW9uc193aXRoX2ZlZXMAAAADAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAABHNraXAAAAAEAAAAAAAAAAR0YWtlAAAABAAAAAEAAAPpAAAD6gAAB9AAAAAQVXNlclBvc2l0aW9uSW5mbwAAAAM=",
        "AAAAAAAAASFDYWxjdWxhdGUgdGhlIHByaW5jaXBhbCBhbW91bnRzIG9mIHRva2VuMCBhbmQgdG9rZW4xIGZvciBhIHBvc2l0aW9uJ3MgbGlxdWlkaXR5CmF0IGEgZ2l2ZW4gc3FydCBwcmljZS4gTWlycm9ycyBVbmlzd2FwIFYzJ3MgUG9zaXRpb25WYWx1ZS5wcmluY2lwYWwKQHBhcmFtIHRva2VuX2lkIFRoZSBORlQgdG9rZW4gSUQKQHBhcmFtIHNxcnRfcHJpY2VfeDk2IFRoZSBzcXJ0IHByaWNlIHRvIHVzZSBmb3IgY2FsY3VsYXRpb24KQHJldHVybiAoYW1vdW50MCwgYW1vdW50MSkgVGhlIHByaW5jaXBhbCBhbW91bnRzAAAAAAAAEnBvc2l0aW9uX3ByaW5jaXBhbAAAAAAAAgAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAAAAAA5zcXJ0X3ByaWNlX3g5NgAAAAAADAAAAAEAAAPpAAAD7QAAAAIAAAAKAAAACgAAAAM=",
        "AAAAAAAAAKlDYWxjdWxhdGUgdGhlIHVuY29sbGVjdGVkIGZlZXMgZm9yIGEgcG9zaXRpb24KTWlycm9ycyBVbmlzd2FwIFYzJ3MgUG9zaXRpb25WYWx1ZS5mZWVzCkBwYXJhbSB0b2tlbl9pZCBUaGUgTkZUIHRva2VuIElECkByZXR1cm4gKGZlZXMwLCBmZWVzMSkgVGhlIHVuY29sbGVjdGVkIGZlZSBhbW91bnRzAAAAAAAADXBvc2l0aW9uX2ZlZXMAAAAAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAABAAAD6QAAA+0AAAACAAAACgAAAAoAAAAD",
        "AAAAAAAAAQpDYWxjdWxhdGUgdGhlIHRvdGFsIHZhbHVlIG9mIGEgcG9zaXRpb24gKHByaW5jaXBhbCArIGZlZXMpCk1pcnJvcnMgVW5pc3dhcCBWMydzIFBvc2l0aW9uVmFsdWUudG90YWwKQHBhcmFtIHRva2VuX2lkIFRoZSBORlQgdG9rZW4gSUQKQHBhcmFtIHNxcnRfcHJpY2VfeDk2IFRoZSBzcXJ0IHByaWNlIHRvIHVzZSBmb3IgcHJpbmNpcGFsIGNhbGN1bGF0aW9uCkByZXR1cm4gKHRvdGFsMCwgdG90YWwxKSBUaGUgdG90YWwgYW1vdW50cyBvZiB0b2tlbjAgYW5kIHRva2VuMQAAAAAADnBvc2l0aW9uX3RvdGFsAAAAAAACAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAADnNxcnRfcHJpY2VfeDk2AAAAAAAMAAAAAQAAA+kAAAPtAAAAAgAAAAoAAAAKAAAAAw==",
        "AAAABAAAACdFcnJvciBjb2RlcyBmb3IgdGhlIHBlcmlwaGVyeSBsaWJyYXJpZXMAAAAAAAAAAAVFcnJvcgAAAAAAAAQAAAA+SGV4IHN0cmluZyBsZW5ndGggaXMgaW5zdWZmaWNpZW50IGZvciB0aGUgcmVxdWVzdGVkIGNvbnZlcnNpb24AAAAAABVIZXhMZW5ndGhJbnN1ZmZpY2llbnQAAAAAAAfRAAAAMW11bF9kaXYgb3BlcmF0aW9uIGZhaWxlZCBpbiBsaXF1aWRpdHkgY2FsY3VsYXRpb24AAAAAAAAMTXVsRGl2RmFpbGVkAAAH0gAAACZJbnZhbGlkIHByaWNlIHJhbmdlIChkaXZpc2lvbiBieSB6ZXJvKQAAAAAAEUludmFsaWRQcmljZVJhbmdlAAAAAAAH0wAAAClVMjU2IHRvIHUxMjggY29udmVyc2lvbiBmYWlsZWQgKG92ZXJmbG93KQAAAAAAABpVMjU2VG9VMTI4Q29udmVyc2lvbkZhaWxlZAAAAAAH1A==",
        "AAAAAQAAAFdQYXJhbWV0ZXJzIHJlcXVpcmVkIHRvIGNvbnN0cnVjdCBhIHRva2VuIFVSSSAoc2VlIG9yaWdpbmFsIFNvbGlkaXR5IGNvZGUgZm9yIHNlbWFudGljcykAAAAAAAAAABdDb25zdHJ1Y3RUb2tlblVSSVBhcmFtcwAAAAAOAAAAAAAAABJiYXNlX3Rva2VuX2FkZHJlc3MAAAAAABMAAAAAAAAAE2Jhc2VfdG9rZW5fZGVjaW1hbHMAAAAABAAAAAAAAAARYmFzZV90b2tlbl9zeW1ib2wAAAAAAAAQAAAAAAAAAANmZWUAAAAABAAAAAAAAAAKZmxpcF9yYXRpbwAAAAAAAQAAAAAAAAAMcG9vbF9hZGRyZXNzAAAAEwAAAAAAAAATcXVvdGVfdG9rZW5fYWRkcmVzcwAAAAATAAAAAAAAABRxdW90ZV90b2tlbl9kZWNpbWFscwAAAAQAAAAAAAAAEnF1b3RlX3Rva2VuX3N5bWJvbAAAAAAAEAAAAAAAAAAMdGlja19jdXJyZW50AAAABQAAAAAAAAAKdGlja19sb3dlcgAAAAAABQAAAAAAAAAMdGlja19zcGFjaW5nAAAABQAAAAAAAAAKdGlja191cHBlcgAAAAAABQAAAAAAAAAIdG9rZW5faWQAAAAG",
        "AAAAAQAAAEJEYXRhIHN0cnVjdHVyZSBmb3Igd2VpZ2h0ZWQgdGljayBhZ2dyZWdhdGlvbiBhY3Jvc3MgbXVsdGlwbGUgcG9vbHMAAAAAAAAAAAAQV2VpZ2h0ZWRUaWNrRGF0YQAAAAIAAAAWVGljayB2YWx1ZSBmcm9tIGEgcG9vbAAAAAAABHRpY2sAAAAFAAAANFdlaWdodCBmb3IgdGhpcyB0aWNrICh0eXBpY2FsbHkgbGlxdWlkaXR5IG9yIHZvbHVtZSkAAAAGd2VpZ2h0AAAAAAAK",
        "AAAABAAAACtFcnJvciBjb2RlcyBmb3IgdGhlIHBlcmlwaGVyeSBiYXNlIGNvbnRyYWN0AAAAAAAAAAAFRXJyb3IAAAAAAAAVAAAAJVRyYW5zYWN0aW9uIGhhcyBleGNlZWRlZCB0aGUgZGVhZGxpbmUAAAAAAAARVHJhbnNhY3Rpb25Ub29PbGQAAAAAAAPpAAAAJUNvbnRyYWN0IGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWQAAAAAAAASQWxyZWFkeUluaXRpYWxpemVkAAAAAAPqAAAAKEZhY3RvcnkgYWRkcmVzcyBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQAAAAVRmFjdG9yeU5vdEluaXRpYWxpemVkAAAAAAAD6wAAACRYTE0gYWRkcmVzcyBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQAAAAYWGxtQWRkcmVzc05vdEluaXRpYWxpemVkAAAD7AAAABRUb2tlbiBkb2VzIG5vdCBleGlzdAAAABFUb2tlbkRvZXNOb3RFeGlzdAAAAAAAA+0AAAAaTm90IHRoZSBvd25lciBvZiB0aGUgdG9rZW4AAAAAAA1Ob3RUb2tlbk93bmVyAAAAAAAD7gAAABZVbmF1dGhvcml6ZWQgb3BlcmF0aW9uAAAAAAAMVW5hdXRob3JpemVkAAAD7wAAAChJbnN1ZmZpY2llbnQgdG9rZW4gYmFsYW5jZSBmb3Igb3BlcmF0aW9uAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAAD8AAAACZUaWNrIHJhbmdlIGlzIGludmFsaWQgKGxvd2VyID49IHVwcGVyKQAAAAAAEEludmFsaWRUaWNrUmFuZ2UAAAPxAAAAMFRpY2sgdmFsdWVzIGFyZSBub3QgYWxpZ25lZCB0byBwb29sIHRpY2sgc3BhY2luZwAAAA5UaWNrTm90QWxpZ25lZAAAAAAD8gAAAB9UaWNrIGlzIG91dCBvZiBhbGxvd2FibGUgYm91bmRzAAAAAA9UaWNrT3V0T2ZCb3VuZHMAAAAD8wAAACdFeHBlY3RlZCBwb29sIG5vdCBmb3VuZCBvciBpbmFjY2Vzc2libGUAAAAADFBvb2xOb3RGb3VuZAAAA/QAAAArTWF0aGVtYXRpY2FsIG9wZXJhdGlvbiByZXN1bHRlZCBpbiBvdmVyZmxvdwAAAAAMTWF0aE92ZXJmbG93AAAD9QAAADtQcmljZSBzbGlwcGFnZSBjaGVjayBmYWlsZWQgKGFtb3VudCByZWNlaXZlZCBiZWxvdyBtaW5pbXVtKQAAAAASUHJpY2VTbGlwcGFnZUNoZWNrAAAAAAP2AAAAQE5vIHRva2VucyB0byBjb2xsZWN0IChib3RoIGFtb3VudDBfbWF4IGFuZCBhbW91bnQxX21heCBhcmUgemVybykAAAAQTm90aGluZ1RvQ29sbGVjdAAAA/cAAAASVG9rZW5zIE5vdCBPcmRlcmVkAAAAAAAQVG9rZW5zTm90T3JkZXJlZAAAA/gAAAAcTGlxdWlkaXR5IGNhbGN1bGF0aW9uIGZhaWxlZAAAABpMaXF1aWRpdHlDYWxjdWxhdGlvbkZhaWxlZAAAAAAD+QAAAC5Qb29sIGtleSBkYXRhIGlzIG1pc3NpbmcgZm9yIHRoZSBnaXZlbiBwb29sIElEAAAAAAAOUG9vbEtleU1pc3NpbmcAAAAAA/oAAAAsVG9rZW4gZGVzY3JpcHRvciBjb250cmFjdCBhZGRyZXNzIGlzIG5vdCBzZXQAAAAVVG9rZW5EZXNjcmlwdG9yTm90U2V0AAAAAAAD+wAAACdObyBhcHByb3ZlZCBhZGRyZXNzIGZvciB0aGUgZ2l2ZW4gdG9rZW4AAAAAEU5vQXBwcm92ZWRBZGRyZXNzAAAAAAAD/AAAAENQb3NpdGlvbiBtdXN0IGhhdmUgemVybyBsaXF1aWRpdHkgYW5kIG5vIG93ZWQgdG9rZW5zIGJlZm9yZSBidXJuaW5nAAAAABJQb3NpdGlvbk5vdENsZWFyZWQAAAAAA/0=",
        "AAAAAgAAADFLZXlzIHVuZGVyIHdoaWNoIHdlJ2xsIHN0b3JlIHRoZSBpbW11dGFibGUgZmllbGRzAAAAAAAAAAAAAAdEYXRhS2V5AAAAAAIAAAAAAAAAAAAAAAdGYWN0b3J5AAAAAAAAAAAAAAAAClhsbUFkZHJlc3MAAA==",
        "AAAAAgAAAEFTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgYWxsb3dsaXN0IGV4dGVuc2lvbgAAAAAAAAAAAAATQWxsb3dMaXN0U3RvcmFnZUtleQAAAAABAAAAAQAAACdTdG9yZXMgdGhlIGFsbG93ZWQgc3RhdHVzIG9mIGFuIGFjY291bnQAAAAAB0FsbG93ZWQAAAAAAQAAABM=",
        "AAAABQAAADhFdmVudCBlbWl0dGVkIHdoZW4gYSB1c2VyIGlzIGFsbG93ZWQgdG8gdHJhbnNmZXIgdG9rZW5zLgAAAAAAAAALVXNlckFsbG93ZWQAAAAAAQAAAAx1c2VyX2FsbG93ZWQAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAAC",
        "AAAABQAAAEFFdmVudCBlbWl0dGVkIHdoZW4gYSB1c2VyIGlzIGRpc2FsbG93ZWQgZnJvbSB0cmFuc2ZlcnJpbmcgdG9rZW5zLgAAAAAAAAAAAAAOVXNlckRpc2FsbG93ZWQAAAAAAAEAAAAPdXNlcl9kaXNhbGxvd2VkAAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAAAI=",
        "AAAAAgAAAEFTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgYmxvY2tsaXN0IGV4dGVuc2lvbgAAAAAAAAAAAAATQmxvY2tMaXN0U3RvcmFnZUtleQAAAAABAAAAAQAAACdTdG9yZXMgdGhlIGJsb2NrZWQgc3RhdHVzIG9mIGFuIGFjY291bnQAAAAAB0Jsb2NrZWQAAAAAAQAAABM=",
        "AAAABQAAAD5FdmVudCBlbWl0dGVkIHdoZW4gYSB1c2VyIGlzIGJsb2NrZWQgZnJvbSB0cmFuc2ZlcnJpbmcgdG9rZW5zLgAAAAAAAAAAAAtVc2VyQmxvY2tlZAAAAAABAAAADHVzZXJfYmxvY2tlZAAAAAEAAAAAAAAABHVzZXIAAAATAAAAAQAAAAI=",
        "AAAABQAAAEZFdmVudCBlbWl0dGVkIHdoZW4gYSB1c2VyIGlzIHVuYmxvY2tlZCBhbmQgYWxsb3dlZCB0byB0cmFuc2ZlciB0b2tlbnMuAAAAAAAAAAAADVVzZXJVbmJsb2NrZWQAAAAAAAABAAAADnVzZXJfdW5ibG9ja2VkAAAAAAABAAAAAAAAAAR1c2VyAAAAEwAAAAEAAAAC",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBidXJuZWQuAAAAAAAAAAAAAARCdXJuAAAAAQAAAARidXJuAAAAAgAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAAAgAAAD1TdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgdmF1bHQgZXh0ZW5zaW9uAAAAAAAAAAAAAA9WYXVsdFN0b3JhZ2VLZXkAAAAAAgAAAAAAAAAyU3RvcmVzIHRoZSBhZGRyZXNzIG9mIHRoZSB2YXVsdCdzIHVuZGVybHlpbmcgYXNzZXQAAAAAAAxBc3NldEFkZHJlc3MAAAAAAAAAL1N0b3JlcyB0aGUgdmlydHVhbCBkZWNpbWFscyBvZmZzZXQgb2YgdGhlIHZhdWx0AAAAABVWaXJ0dWFsRGVjaW1hbHNPZmZzZXQAAAA=",
        "AAAABQAAAEJFdmVudCBlbWl0dGVkIHdoZW4gdW5kZXJseWluZyBhc3NldHMgYXJlIGRlcG9zaXRlZCBpbnRvIHRoZSB2YXVsdC4AAAAAAAAAAAAHRGVwb3NpdAAAAAABAAAAB2RlcG9zaXQAAAAABQAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAQAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAhyZWNlaXZlcgAAABMAAAABAAAAAAAAAAZhc3NldHMAAAAAAAsAAAAAAAAAAAAAAAZzaGFyZXMAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAAENFdmVudCBlbWl0dGVkIHdoZW4gc2hhcmVzIGFyZSBleGNoYW5nZWQgYmFjayBmb3IgdW5kZXJseWluZyBhc3NldHMuAAAAAAAAAAAIV2l0aGRyYXcAAAABAAAACHdpdGhkcmF3AAAABQAAAAAAAAAIb3BlcmF0b3IAAAATAAAAAQAAAAAAAAAIcmVjZWl2ZXIAAAATAAAAAQAAAAAAAAAFb3duZXIAAAAAAAATAAAAAQAAAAAAAAAGYXNzZXRzAAAAAAALAAAAAAAAAAAAAAAGc2hhcmVzAAAAAAALAAAAAAAAAAI=",
        "AAAAAQAAACpTdG9yYWdlIGtleSB0aGF0IG1hcHMgdG8gW2BBbGxvd2FuY2VEYXRhYF0AAAAAAAAAAAAMQWxsb3dhbmNlS2V5AAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAdzcGVuZGVyAAAAABM=",
        "AAAAAQAAAINTdG9yYWdlIGNvbnRhaW5lciBmb3IgdGhlIGFtb3VudCBvZiB0b2tlbnMgZm9yIHdoaWNoIGFuIGFsbG93YW5jZSBpcyBncmFudGVkCmFuZCB0aGUgbGVkZ2VyIG51bWJlciBhdCB3aGljaCB0aGlzIGFsbG93YW5jZSBleHBpcmVzLgAAAAAAAAAADUFsbG93YW5jZURhdGEAAAAAAAACAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAEWxpdmVfdW50aWxfbGVkZ2VyAAAAAAAABA==",
        "AAAAAgAAADlTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgRnVuZ2libGVUb2tlbmAAAAAAAAAAAAAAClN0b3JhZ2VLZXkAAAAAAAMAAAAAAAAAAAAAAAtUb3RhbFN1cHBseQAAAAABAAAAAAAAAAdCYWxhbmNlAAAAAAEAAAATAAAAAQAAAAAAAAAJQWxsb3dhbmNlAAAAAAAAAQAAB9AAAAAMQWxsb3dhbmNlS2V5",
        "AAAAAQAAACRTdG9yYWdlIGNvbnRhaW5lciBmb3IgdG9rZW4gbWV0YWRhdGEAAAAAAAAACE1ldGFkYXRhAAAAAwAAAAAAAAAIZGVjaW1hbHMAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQ",
        "AAAAAgAAAClTdG9yYWdlIGtleSBmb3IgYWNjZXNzaW5nIHRoZSBTQUMgYWRkcmVzcwAAAAAAAAAAAAAWU0FDQWRtaW5HZW5lcmljRGF0YUtleQAAAAAAAQAAAAAAAAAAAAAAA1NhYwA=",
        "AAAAAgAAAClTdG9yYWdlIGtleSBmb3IgYWNjZXNzaW5nIHRoZSBTQUMgYWRkcmVzcwAAAAAAAAAAAAAWU0FDQWRtaW5XcmFwcGVyRGF0YUtleQAAAAAAAQAAAAAAAAAAAAAAA1NhYwA=",
        "AAAABAAAAAAAAAAAAAAAEkZ1bmdpYmxlVG9rZW5FcnJvcgAAAAAAGQAAAG5JbmRpY2F0ZXMgYW4gZXJyb3IgcmVsYXRlZCB0byB0aGUgY3VycmVudCBiYWxhbmNlIG9mIGFjY291bnQgZnJvbSB3aGljaAp0b2tlbnMgYXJlIGV4cGVjdGVkIHRvIGJlIHRyYW5zZmVycmVkLgAAAAAAE0luc3VmZmljaWVudEJhbGFuY2UAAAAAZAAAAGRJbmRpY2F0ZXMgYSBmYWlsdXJlIHdpdGggdGhlIGFsbG93YW5jZSBtZWNoYW5pc20gd2hlbiBhIGdpdmVuIHNwZW5kZXIKZG9lc24ndCBoYXZlIGVub3VnaCBhbGxvd2FuY2UuAAAAFUluc3VmZmljaWVudEFsbG93YW5jZQAAAAAAAGUAAABNSW5kaWNhdGVzIGFuIGludmFsaWQgdmFsdWUgZm9yIGBsaXZlX3VudGlsX2xlZGdlcmAgd2hlbiBzZXR0aW5nIGFuCmFsbG93YW5jZS4AAAAAAAAWSW52YWxpZExpdmVVbnRpbExlZGdlcgAAAAAAZgAAADJJbmRpY2F0ZXMgYW4gZXJyb3Igd2hlbiBhbiBpbnB1dCB0aGF0IG11c3QgYmUgPj0gMAAAAAAADExlc3NUaGFuWmVybwAAAGcAAAApSW5kaWNhdGVzIG92ZXJmbG93IHdoZW4gYWRkaW5nIHR3byB2YWx1ZXMAAAAAAAAMTWF0aE92ZXJmbG93AAAAaAAAACpJbmRpY2F0ZXMgYWNjZXNzIHRvIHVuaW5pdGlhbGl6ZWQgbWV0YWRhdGEAAAAAAA1VbnNldE1ldGFkYXRhAAAAAAAAaQAAAFJJbmRpY2F0ZXMgdGhhdCB0aGUgb3BlcmF0aW9uIHdvdWxkIGhhdmUgY2F1c2VkIGB0b3RhbF9zdXBwbHlgIHRvIGV4Y2VlZAp0aGUgYGNhcGAuAAAAAAALRXhjZWVkZWRDYXAAAAAAagAAADZJbmRpY2F0ZXMgdGhlIHN1cHBsaWVkIGBjYXBgIGlzIG5vdCBhIHZhbGlkIGNhcCB2YWx1ZS4AAAAAAApJbnZhbGlkQ2FwAAAAAABrAAAAHkluZGljYXRlcyB0aGUgQ2FwIHdhcyBub3Qgc2V0LgAAAAAACUNhcE5vdFNldAAAAAAAAGwAAAAmSW5kaWNhdGVzIHRoZSBTQUMgYWRkcmVzcyB3YXMgbm90IHNldC4AAAAAAAlTQUNOb3RTZXQAAAAAAABtAAAAMEluZGljYXRlcyBhIFNBQyBhZGRyZXNzIGRpZmZlcmVudCB0aGFuIGV4cGVjdGVkLgAAABJTQUNBZGRyZXNzTWlzbWF0Y2gAAAAAAG4AAABDSW5kaWNhdGVzIGEgbWlzc2luZyBmdW5jdGlvbiBwYXJhbWV0ZXIgaW4gdGhlIFNBQyBjb250cmFjdCBjb250ZXh0LgAAAAARU0FDTWlzc2luZ0ZuUGFyYW0AAAAAAABvAAAAREluZGljYXRlcyBhbiBpbnZhbGlkIGZ1bmN0aW9uIHBhcmFtZXRlciBpbiB0aGUgU0FDIGNvbnRyYWN0IGNvbnRleHQuAAAAEVNBQ0ludmFsaWRGblBhcmFtAAAAAAAAcAAAADFUaGUgdXNlciBpcyBub3QgYWxsb3dlZCB0byBwZXJmb3JtIHRoaXMgb3BlcmF0aW9uAAAAAAAADlVzZXJOb3RBbGxvd2VkAAAAAABxAAAANVRoZSB1c2VyIGlzIGJsb2NrZWQgYW5kIGNhbm5vdCBwZXJmb3JtIHRoaXMgb3BlcmF0aW9uAAAAAAAAC1VzZXJCbG9ja2VkAAAAAHIAAAA2SW5kaWNhdGVzIGFjY2VzcyB0byB1bmluaXRpYWxpemVkIHZhdWx0IGFzc2V0IGFkZHJlc3MuAAAAAAAXVmF1bHRBc3NldEFkZHJlc3NOb3RTZXQAAAAAcwAAADJJbmRpY2F0ZXMgdGhhdCB2YXVsdCBhc3NldCBhZGRyZXNzIGlzIGFscmVhZHkgc2V0LgAAAAAAG1ZhdWx0QXNzZXRBZGRyZXNzQWxyZWFkeVNldAAAAAB0AAAAPEluZGljYXRlcyB0aGF0IHZhdWx0IHZpcnR1YWwgZGVjaW1hbHMgb2Zmc2V0IGlzIGFscmVhZHkgc2V0LgAAACRWYXVsdFZpcnR1YWxEZWNpbWFsc09mZnNldEFscmVhZHlTZXQAAAB1AAAAN0luZGljYXRlcyB0aGUgYW1vdW50IGlzIG5vdCBhIHZhbGlkIHZhdWx0IGFzc2V0cyB2YWx1ZS4AAAAAGFZhdWx0SW52YWxpZEFzc2V0c0Ftb3VudAAAAHYAAAA3SW5kaWNhdGVzIHRoZSBhbW91bnQgaXMgbm90IGEgdmFsaWQgdmF1bHQgc2hhcmVzIHZhbHVlLgAAAAAYVmF1bHRJbnZhbGlkU2hhcmVzQW1vdW50AAAAdwAAAEFBdHRlbXB0ZWQgdG8gZGVwb3NpdCBtb3JlIGFzc2V0cyB0aGFuIHRoZSBtYXggYW1vdW50IGZvciBhZGRyZXNzLgAAAAAAABdWYXVsdEV4Y2VlZGVkTWF4RGVwb3NpdAAAAAB4AAAAPkF0dGVtcHRlZCB0byBtaW50IG1vcmUgc2hhcmVzIHRoYW4gdGhlIG1heCBhbW91bnQgZm9yIGFkZHJlc3MuAAAAAAAUVmF1bHRFeGNlZWRlZE1heE1pbnQAAAB5AAAAQkF0dGVtcHRlZCB0byB3aXRoZHJhdyBtb3JlIGFzc2V0cyB0aGFuIHRoZSBtYXggYW1vdW50IGZvciBhZGRyZXNzLgAAAAAAGFZhdWx0RXhjZWVkZWRNYXhXaXRoZHJhdwAAAHoAAABAQXR0ZW1wdGVkIHRvIHJlZGVlbSBtb3JlIHNoYXJlcyB0aGFuIHRoZSBtYXggYW1vdW50IGZvciBhZGRyZXNzLgAAABZWYXVsdEV4Y2VlZGVkTWF4UmVkZWVtAAAAAAB7AAAAKk1heGltdW0gbnVtYmVyIG9mIGRlY2ltYWxzIG9mZnNldCBleGNlZWRlZAAAAAAAHlZhdWx0TWF4RGVjaW1hbHNPZmZzZXRFeGNlZWRlZAAAAAAAfA==",
        "AAAABQAAADxFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSB0cmFuc2ZlcnJlZCBiZXR3ZWVuIGFkZHJlc3Nlcy4AAAAAAAAACFRyYW5zZmVyAAAAAQAAAAh0cmFuc2ZlcgAAAAMAAAAAAAAABGZyb20AAAATAAAAAQAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gYW4gYWxsb3dhbmNlIGlzIGFwcHJvdmVkLgAAAAAAAAAHQXBwcm92ZQAAAAABAAAAB2FwcHJvdmUAAAAABAAAAAAAAAAFb3duZXIAAAAAAAATAAAAAQAAAAAAAAAHc3BlbmRlcgAAAAATAAAAAQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAAAAAARbGl2ZV91bnRpbF9sZWRnZXIAAAAAAAAEAAAAAAAAAAI=",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBtaW50ZWQuAAAAAAAAAAAAAARNaW50AAAAAQAAAARtaW50AAAAAgAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyBidXJuZWQuAAAAAAAAAAAAAARCdXJuAAAAAQAAAARidXJuAAAAAgAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAAAg==",
        "AAAAAgAAAFlTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29uc2VjdXRpdmUgZXh0ZW5zaW9uIG9mCmBOb25GdW5naWJsZVRva2VuYAAAAAAAAAAAAAAYTkZUQ29uc2VjdXRpdmVTdG9yYWdlS2V5AAAABAAAAAEAAAAAAAAACEFwcHJvdmFsAAAAAQAAAAQAAAABAAAAAAAAAAVPd25lcgAAAAAAAAEAAAAEAAAAAQAAAAAAAAAPT3duZXJzaGlwQnVja2V0AAAAAAEAAAAEAAAAAQAAAAAAAAALQnVybmVkVG9rZW4AAAAAAQAAAAQ=",
        "AAAABQAAADFFdmVudCBlbWl0dGVkIHdoZW4gY29uc2VjdXRpdmUgdG9rZW5zIGFyZSBtaW50ZWQuAAAAAAAAAAAAAA9Db25zZWN1dGl2ZU1pbnQAAAAAAQAAABBjb25zZWN1dGl2ZV9taW50AAAAAwAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAA1mcm9tX3Rva2VuX2lkAAAAAAAABAAAAAAAAAAAAAAAC3RvX3Rva2VuX2lkAAAAAAQAAAAAAAAAAg==",
        "AAAAAQAAAAAAAAAAAAAADk93bmVyVG9rZW5zS2V5AAAAAAACAAAAAAAAAAVpbmRleAAAAAAAAAQAAAAAAAAABW93bmVyAAAAAAAAEw==",
        "AAAAAgAAAFhTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgZW51bWVyYWJsZSBleHRlbnNpb24gb2YKYE5vbkZ1bmdpYmxlVG9rZW5gAAAAAAAAABdORlRFbnVtZXJhYmxlU3RvcmFnZUtleQAAAAAFAAAAAAAAAAAAAAALVG90YWxTdXBwbHkAAAAAAQAAAAAAAAALT3duZXJUb2tlbnMAAAAAAQAAB9AAAAAOT3duZXJUb2tlbnNLZXkAAAAAAAEAAAAAAAAAEE93bmVyVG9rZW5zSW5kZXgAAAABAAAABAAAAAEAAAAAAAAADEdsb2JhbFRva2VucwAAAAEAAAAEAAAAAQAAAAAAAAARR2xvYmFsVG9rZW5zSW5kZXgAAAAAAAABAAAABA==",
        "AAAAAQAAAClTdG9yYWdlIGNvbnRhaW5lciBmb3Igcm95YWx0eSBpbmZvcm1hdGlvbgAAAAAAAAAAAAALUm95YWx0eUluZm8AAAAAAgAAAAAAAAAMYmFzaXNfcG9pbnRzAAAABAAAAAAAAAAIcmVjZWl2ZXIAAAAT",
        "AAAAAgAAAB1TdG9yYWdlIGtleXMgZm9yIHJveWFsdHkgZGF0YQAAAAAAAAAAAAAWTkZUUm95YWx0aWVzU3RvcmFnZUtleQAAAAAAAgAAAAAAAAAAAAAADkRlZmF1bHRSb3lhbHR5AAAAAAABAAAAAAAAAAxUb2tlblJveWFsdHkAAAABAAAABA==",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gZGVmYXVsdCByb3lhbHR5IGlzIHNldC4AAAAAAAAAAAARU2V0RGVmYXVsdFJveWFsdHkAAAAAAAABAAAAE3NldF9kZWZhdWx0X3JveWFsdHkAAAAAAgAAAAAAAAAIcmVjZWl2ZXIAAAATAAAAAQAAAAAAAAAMYmFzaXNfcG9pbnRzAAAABAAAAAAAAAAC",
        "AAAABQAAAChFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW4gcm95YWx0eSBpcyBzZXQuAAAAAAAAAA9TZXRUb2tlblJveWFsdHkAAAAAAQAAABFzZXRfdG9rZW5fcm95YWx0eQAAAAAAAAMAAAAAAAAACHJlY2VpdmVyAAAAEwAAAAEAAAAAAAAACHRva2VuX2lkAAAABAAAAAEAAAAAAAAADGJhc2lzX3BvaW50cwAAAAQAAAAAAAAAAg==",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW4gcm95YWx0eSBpcyByZW1vdmVkLgAAAAAAAAASUmVtb3ZlVG9rZW5Sb3lhbHR5AAAAAAABAAAAFHJlbW92ZV90b2tlbl9yb3lhbHR5AAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAAAI=",
        "AAAAAQAAAHZTdG9yYWdlIGNvbnRhaW5lciBmb3IgdGhlIHRva2VuIGZvciB3aGljaCBhbiBhcHByb3ZhbCBpcyBncmFudGVkCmFuZCB0aGUgbGVkZ2VyIG51bWJlciBhdCB3aGljaCB0aGlzIGFwcHJvdmFsIGV4cGlyZXMuAAAAAAAAAAAADEFwcHJvdmFsRGF0YQAAAAIAAAAAAAAACGFwcHJvdmVkAAAAEwAAAAAAAAARbGl2ZV91bnRpbF9sZWRnZXIAAAAAAAAE",
        "AAAAAQAAACRTdG9yYWdlIGNvbnRhaW5lciBmb3IgdG9rZW4gbWV0YWRhdGEAAAAAAAAACE1ldGFkYXRhAAAAAwAAAAAAAAAIYmFzZV91cmkAAAAQAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAGc3ltYm9sAAAAAAAQ",
        "AAAAAgAAADxTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgTm9uRnVuZ2libGVUb2tlbmAAAAAAAAAADU5GVFN0b3JhZ2VLZXkAAAAAAAAFAAAAAQAAAAAAAAAFT3duZXIAAAAAAAABAAAABAAAAAEAAAAAAAAAB0JhbGFuY2UAAAAAAQAAABMAAAABAAAAAAAAAAhBcHByb3ZhbAAAAAEAAAAEAAAAAQAAAAAAAAAOQXBwcm92YWxGb3JBbGwAAAAAAAIAAAATAAAAEwAAAAAAAAAAAAAACE1ldGFkYXRh",
        "AAAAAgAAAAAAAAAAAAAAF05GVFNlcXVlbnRpYWxTdG9yYWdlS2V5AAAAAAEAAAAAAAAAAAAAAA5Ub2tlbklkQ291bnRlcgAA",
        "AAAABAAAAAAAAAAAAAAAFU5vbkZ1bmdpYmxlVG9rZW5FcnJvcgAAAAAAAA0AAAAkSW5kaWNhdGVzIGEgbm9uLWV4aXN0ZW50IGB0b2tlbl9pZGAuAAAAEE5vbkV4aXN0ZW50VG9rZW4AAADIAAAAV0luZGljYXRlcyBhbiBlcnJvciByZWxhdGVkIHRvIHRoZSBvd25lcnNoaXAgb3ZlciBhIHBhcnRpY3VsYXIgdG9rZW4uClVzZWQgaW4gdHJhbnNmZXJzLgAAAAAOSW5jb3JyZWN0T3duZXIAAAAAAMkAAABFSW5kaWNhdGVzIGEgZmFpbHVyZSB3aXRoIHRoZSBgb3BlcmF0b3JgcyBhcHByb3ZhbC4gVXNlZCBpbiB0cmFuc2ZlcnMuAAAAAAAAFEluc3VmZmljaWVudEFwcHJvdmFsAAAAygAAAFVJbmRpY2F0ZXMgYSBmYWlsdXJlIHdpdGggdGhlIGBhcHByb3ZlcmAgb2YgYSB0b2tlbiB0byBiZSBhcHByb3ZlZC4gVXNlZAppbiBhcHByb3ZhbHMuAAAAAAAAD0ludmFsaWRBcHByb3ZlcgAAAADLAAAASkluZGljYXRlcyBhbiBpbnZhbGlkIHZhbHVlIGZvciBgbGl2ZV91bnRpbF9sZWRnZXJgIHdoZW4gc2V0dGluZwphcHByb3ZhbHMuAAAAAAAWSW52YWxpZExpdmVVbnRpbExlZGdlcgAAAAAAzAAAAClJbmRpY2F0ZXMgb3ZlcmZsb3cgd2hlbiBhZGRpbmcgdHdvIHZhbHVlcwAAAAAAAAxNYXRoT3ZlcmZsb3cAAADNAAAANkluZGljYXRlcyBhbGwgcG9zc2libGUgYHRva2VuX2lkYHMgYXJlIGFscmVhZHkgaW4gdXNlLgAAAAAAE1Rva2VuSURzQXJlRGVwbGV0ZWQAAAAAzgAAAEVJbmRpY2F0ZXMgYW4gaW52YWxpZCBhbW91bnQgdG8gYmF0Y2ggbWludCBpbiBgY29uc2VjdXRpdmVgIGV4dGVuc2lvbi4AAAAAAAANSW52YWxpZEFtb3VudAAAAAAAAM8AAAAzSW5kaWNhdGVzIHRoZSB0b2tlbiBkb2VzIG5vdCBleGlzdCBpbiBvd25lcidzIGxpc3QuAAAAABhUb2tlbk5vdEZvdW5kSW5Pd25lckxpc3QAAADQAAAAMkluZGljYXRlcyB0aGUgdG9rZW4gZG9lcyBub3QgZXhpc3QgaW4gZ2xvYmFsIGxpc3QuAAAAAAAZVG9rZW5Ob3RGb3VuZEluR2xvYmFsTGlzdAAAAAAAANEAAAAjSW5kaWNhdGVzIGFjY2VzcyB0byB1bnNldCBtZXRhZGF0YS4AAAAADVVuc2V0TWV0YWRhdGEAAAAAAADSAAAAQUluZGljYXRlcyB0aGUgbGVuZ3RoIG9mIHRoZSBiYXNlIFVSSSBleGNlZWRzIHRoZSBtYXhpbXVtIGFsbG93ZWQuAAAAAAAAFUJhc2VVcmlNYXhMZW5FeGNlZWRlZAAAAAAAANMAAABHSW5kaWNhdGVzIHRoZSByb3lhbHR5IGFtb3VudCBpcyBoaWdoZXIgdGhhbiAxMF8wMDAgKDEwMCUpIGJhc2lzIHBvaW50cy4AAAAAFEludmFsaWRSb3lhbHR5QW1vdW50AAAA1A==",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyB0cmFuc2ZlcnJlZC4AAAAAAAAAAAAIVHJhbnNmZXIAAAABAAAACHRyYW5zZmVyAAAAAwAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAJ0bwAAAAAAEwAAAAEAAAAAAAAACHRva2VuX2lkAAAABAAAAAAAAAAC",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gYW4gYXBwcm92YWwgaXMgZ3JhbnRlZC4AAAAAAAAAAAAHQXBwcm92ZQAAAAABAAAAB2FwcHJvdmUAAAAABAAAAAAAAAAIYXBwcm92ZXIAAAATAAAAAQAAAAAAAAAIdG9rZW5faWQAAAAEAAAAAQAAAAAAAAAIYXBwcm92ZWQAAAATAAAAAAAAAAAAAAARbGl2ZV91bnRpbF9sZWRnZXIAAAAAAAAEAAAAAAAAAAI=",
        "AAAABQAAADZFdmVudCBlbWl0dGVkIHdoZW4gYXBwcm92YWwgZm9yIGFsbCB0b2tlbnMgaXMgZ3JhbnRlZC4AAAAAAAAAAAANQXBwcm92ZUZvckFsbAAAAAAAAAEAAAAPYXBwcm92ZV9mb3JfYWxsAAAAAAMAAAAAAAAABW93bmVyAAAAAAAAEwAAAAEAAAAAAAAACG9wZXJhdG9yAAAAEwAAAAAAAAAAAAAAEWxpdmVfdW50aWxfbGVkZ2VyAAAAAAAABAAAAAAAAAAC",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyBtaW50ZWQuAAAAAAAAAAAAAARNaW50AAAAAQAAAARtaW50AAAAAgAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAAh0b2tlbl9pZAAAAAQAAAAAAAAAAg==",
        "AAAAAQAAAAAAAAAAAAAAClNpZ25pbmdLZXkAAAAAAAIAAAAAAAAACnB1YmxpY19rZXkAAAAAAA4AAAAAAAAABnNjaGVtZQAAAAAABA==",
        "AAAAAgAAAC1TdG9yYWdlIGtleXMgZm9yIGNsYWltIGlzc3VlciBrZXkgbWFuYWdlbWVudC4AAAAAAAAAAAAAFUNsYWltSXNzdWVyU3RvcmFnZUtleQAAAAAAAAQAAAABAAAAGHRvcGljIC0+IFZlYzxTaWduaW5nS2V5PgAAAAZUb3BpY3MAAAAAAAEAAAAEAAAAAQAAABtTaWduaW5nS2V5IC0+IFZlYzxyZWdpc3RyeT4AAAAAClJlZ2lzdHJpZXMAAAAAAAEAAAfQAAAAClNpZ25pbmdLZXkAAAAAAAEAAAAwVHJhY2tzIGV4cGxpY2l0bHkgcmV2b2tlZCBjbGFpbXMgYnkgY2xhaW0gZGlnZXN0AAAADFJldm9rZWRDbGFpbQAAAAEAAAPuAAAAIAAAAAEAAAA9VHJhY2tzIGN1cnJlbnQgbm9uY2UgZm9yIGEgc3BlY2lmaWMgaWRlbnRpdHkgYW5kIGNsYWltIHRvcGljcwAAAAAAAApDbGFpbU5vbmNlAAAAAAACAAAAEwAAAAQ=",
        "AAAAAQAAACJTaWduYXR1cmUgZGF0YSBmb3IgRWQyNTUxOSBzY2hlbWUuAAAAAAAAAAAAFEVkMjU1MTlTaWduYXR1cmVEYXRhAAAAAgAAAAAAAAAKcHVibGljX2tleQAAAAAD7gAAACAAAAAAAAAACXNpZ25hdHVyZQAAAAAAA+4AAABA",
        "AAAAAQAAACRTaWduYXR1cmUgZGF0YSBmb3IgU2VjcDI1NnIxIHNjaGVtZS4AAAAAAAAAFlNlY3AyNTZyMVNpZ25hdHVyZURhdGEAAAAAAAIAAAAAAAAACnB1YmxpY19rZXkAAAAAA+4AAABBAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQA==",
        "AAAAAQAAACRTaWduYXR1cmUgZGF0YSBmb3IgU2VjcDI1NmsxIHNjaGVtZS4AAAAAAAAAFlNlY3AyNTZrMVNpZ25hdHVyZURhdGEAAAAAAAMAAAAAAAAACnB1YmxpY19rZXkAAAAAA+4AAABBAAAAAAAAAAtyZWNvdmVyeV9pZAAAAAAEAAAAAAAAAAlzaWduYXR1cmUAAAAAAAPuAAAAQA==",
        "AAAABQAAAEFFdmVudCBlbWl0dGVkIHdoZW4gYSBrZXkgaXMgYWxsb3dlZCBmb3IgYSBzY2hlbWUgYW5kIGNsYWltIHRvcGljLgAAAAAAAAAAAAAKS2V5QWxsb3dlZAAAAAAAAQAAAAtrZXlfYWxsb3dlZAAAAAAEAAAAAAAAAApwdWJsaWNfa2V5AAAAAAAOAAAAAQAAAAAAAAAIcmVnaXN0cnkAAAATAAAAAAAAAAAAAAAGc2NoZW1lAAAAAAAEAAAAAAAAAAAAAAALY2xhaW1fdG9waWMAAAAABAAAAAAAAAAC",
        "AAAABQAAAEJFdmVudCBlbWl0dGVkIHdoZW4gYSBrZXkgaXMgcmVtb3ZlZCBmcm9tIGEgc2NoZW1lIGFuZCBjbGFpbSB0b3BpYy4AAAAAAAAAAAAKS2V5UmVtb3ZlZAAAAAAAAQAAAAtrZXlfcmVtb3ZlZAAAAAAEAAAAAAAAAApwdWJsaWNfa2V5AAAAAAAOAAAAAQAAAAAAAAAIcmVnaXN0cnkAAAATAAAAAAAAAAAAAAAGc2NoZW1lAAAAAAAEAAAAAAAAAAAAAAALY2xhaW1fdG9waWMAAAAABAAAAAAAAAAC",
        "AAAABQAAACZFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSBpcyByZXZva2VkLgAAAAAAAAAAAAxDbGFpbVJldm9rZWQAAAABAAAADWNsYWltX3Jldm9rZWQAAAAAAAAEAAAAAAAAAAhpZGVudGl0eQAAABMAAAABAAAAAAAAAAtjbGFpbV90b3BpYwAAAAAEAAAAAQAAAAAAAAAHcmV2b2tlZAAAAAABAAAAAQAAAAAAAAAKY2xhaW1fZGF0YQAAAAAADgAAAAAAAAAC",
        "AAAABQAAAE5FdmVudCBlbWl0dGVkIHdoZW4gY2xhaW0gc2lnbmF0dXJlcyBhcmUgaW52YWxpZGF0ZWQgYnkgaW5jcmVtZW50aW5nIHRoZQpub25jZS4AAAAAAAAAAAAVU2lnbmF0dXJlc0ludmFsaWRhdGVkAAAAAAAAAQAAABZzaWduYXR1cmVzX2ludmFsaWRhdGVkAAAAAAADAAAAAAAAAAhpZGVudGl0eQAAABMAAAABAAAAAAAAAAtjbGFpbV90b3BpYwAAAAAEAAAAAQAAAAAAAAAFbm9uY2UAAAAAAAAEAAAAAAAAAAI=",
        "AAAABAAAAAAAAAAAAAAAEENsYWltSXNzdWVyRXJyb3IAAAAJAAAAOVNpZ25hdHVyZSBkYXRhIGxlbmd0aCBkb2VzIG5vdCBtYXRjaCB0aGUgZXhwZWN0ZWQgc2NoZW1lLgAAAAAAAA9TaWdEYXRhTWlzbWF0Y2gAAAABXgAAABpUaGUgcHJvdmlkZWQga2V5IGlzIGVtcHR5LgAAAAAACktleUlzRW1wdHkAAAAAAV8AAAAzVGhlIGtleSBpcyBhbHJlYWR5IGFsbG93ZWQgZm9yIHRoZSBzcGVjaWZpZWQgdG9waWMuAAAAABFLZXlBbHJlYWR5QWxsb3dlZAAAAAAAAWAAAAA0VGhlIHNwZWNpZmllZCBrZXkgd2FzIG5vdCBmb3VuZCBpbiB0aGUgYWxsb3dlZCBrZXlzLgAAAAtLZXlOb3RGb3VuZAAAAAFhAAAATFRoZSBjbGFpbSBpc3N1ZXIgaXMgbm90IHJlZ2lzdGVyZWQgYXQgdGhlIGNsYWltIHRvcGljcyBhbmQgaXNzdWVycwpyZWdpc3RyeS4AAAATSXNzdWVyTm90UmVnaXN0ZXJlZAAAAAFiAAAAT1RoZSBjbGFpbSBpc3N1ZXIgaXMgbm90IGFsbG93ZWQgdG8gc2lnbiBjbGFpbXMgYWJvdXQgdGhlIHNwZWNpZmllZApjbGFpbSB0b3BpYy4AAAAAFENsYWltVG9waWNOb3RBbGxvd2VkAAABYwAAADJNYXhpbXVtIG51bWJlciBvZiBzaWduaW5nIGtleXMgcGVyIHRvcGljIGV4Y2VlZGVkLgAAAAAAF01heEtleXNQZXJUb3BpY0V4Y2VlZGVkAAAAAWQAAAA2TWF4aW11bSBudW1iZXIgb2YgcmVnaXN0cmllcyBwZXIgc2lnbmluZyBrZXkgZXhjZWVkZWQuAAAAAAAbTWF4UmVnaXN0cmllc1BlcktleUV4Y2VlZGVkAAAAAWUAAAA0Tm8gc2lnbmluZyBrZXlzIGZvdW5kIGZvciB0aGUgc3BlY2lmaWVkIGNsYWltIHRvcGljLgAAAA5Ob0tleXNGb3JUb3BpYwAAAAABZg==",
        "AAAAAgAAAFBTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xhaW0gdG9waWNzIGFuZCBpc3N1ZXJzCmV4dGVuc2lvbgAAAAAAAAAfQ2xhaW1Ub3BpY3NBbmRJc3N1ZXJzU3RvcmFnZUtleQAAAAAEAAAAAAAAACBTdG9yZXMgdGhlIGNsYWltIHRvcGljcyByZWdpc3RyeQAAAAtDbGFpbVRvcGljcwAAAAAAAAAAI1N0b3JlcyB0aGUgdHJ1c3RlZCBpc3N1ZXJzIHJlZ2lzdHJ5AAAAAA5UcnVzdGVkSXNzdWVycwAAAAAAAQAAAD1TdG9yZXMgdGhlIGNsYWltIHRvcGljcyBhbGxvd2VkIGZvciBhIHNwZWNpZmljIHRydXN0ZWQgaXNzdWVyAAAAAAAAEUlzc3VlckNsYWltVG9waWNzAAAAAAAAAQAAABMAAAABAAAAPVN0b3JlcyB0aGUgdHJ1c3RlZCBpc3N1ZXJzIGFsbG93ZWQgZm9yIGEgc3BlY2lmaWMgY2xhaW0gdG9waWMAAAAAAAARQ2xhaW1Ub3BpY0lzc3VlcnMAAAAAAAABAAAABA==",
        "AAAABAAAAAAAAAAAAAAAGkNsYWltVG9waWNzQW5kSXNzdWVyc0Vycm9yAAAAAAAHAAAAJUluZGljYXRlcyBhIG5vbi1leGlzdGVudCBjbGFpbSB0b3BpYy4AAAAAAAAWQ2xhaW1Ub3BpY0RvZXNOb3RFeGlzdAAAAAABcgAAAChJbmRpY2F0ZXMgYSBub24tZXhpc3RlbnQgdHJ1c3RlZCBpc3N1ZXIuAAAAEklzc3VlckRvZXNOb3RFeGlzdAAAAAABcwAAACdJbmRpY2F0ZXMgYSBjbGFpbSB0b3BpYyBhbHJlYWR5IGV4aXN0cy4AAAAAF0NsYWltVG9waWNBbHJlYWR5RXhpc3RzAAAAAXQAAAAqSW5kaWNhdGVzIGEgdHJ1c3RlZCBpc3N1ZXIgYWxyZWFkeSBleGlzdHMuAAAAAAATSXNzdWVyQWxyZWFkeUV4aXN0cwAAAAF1AAAALEluZGljYXRlcyBtYXggY2xhaW0gdG9waWNzIGxpbWl0IGlzIHJlYWNoZWQuAAAAGk1heENsYWltVG9waWNzTGltaXRSZWFjaGVkAAAAAAF2AAAAL0luZGljYXRlcyBtYXggdHJ1c3RlZCBpc3N1ZXJzIGxpbWl0IGlzIHJlYWNoZWQuAAAAABZNYXhJc3N1ZXJzTGltaXRSZWFjaGVkAAAAAAF3AAAAQ0luZGljYXRlcyBjbGFpbSB0b3BpY3Mgc2V0IHByb3ZpZGVkIGZvciB0aGUgaXNzdWVyIGNhbm5vdCBiZSBlbXB0eS4AAAAAG0NsYWltVG9waWNzU2V0Q2Fubm90QmVFbXB0eQAAAAF4",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSB0b3BpYyBpcyBhZGRlZC4AAAAAAAAAAAAPQ2xhaW1Ub3BpY0FkZGVkAAAAAAEAAAARY2xhaW1fdG9waWNfYWRkZWQAAAAAAAABAAAAAAAAAAtjbGFpbV90b3BpYwAAAAAEAAAAAQAAAAI=",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSB0b3BpYyBpcyByZW1vdmVkLgAAAAAAAAARQ2xhaW1Ub3BpY1JlbW92ZWQAAAAAAAABAAAAE2NsYWltX3RvcGljX3JlbW92ZWQAAAAAAQAAAAAAAAALY2xhaW1fdG9waWMAAAAABAAAAAEAAAAC",
        "AAAABQAAAC1FdmVudCBlbWl0dGVkIHdoZW4gYSB0cnVzdGVkIGlzc3VlciBpcyBhZGRlZC4AAAAAAAAAAAAAElRydXN0ZWRJc3N1ZXJBZGRlZAAAAAAAAQAAABR0cnVzdGVkX2lzc3Vlcl9hZGRlZAAAAAIAAAAAAAAADnRydXN0ZWRfaXNzdWVyAAAAAAATAAAAAQAAAAAAAAAMY2xhaW1fdG9waWNzAAAD6gAAAAQAAAAAAAAAAg==",
        "AAAABQAAAC9FdmVudCBlbWl0dGVkIHdoZW4gYSB0cnVzdGVkIGlzc3VlciBpcyByZW1vdmVkLgAAAAAAAAAAFFRydXN0ZWRJc3N1ZXJSZW1vdmVkAAAAAQAAABZ0cnVzdGVkX2lzc3Vlcl9yZW1vdmVkAAAAAAABAAAAAAAAAA50cnVzdGVkX2lzc3VlcgAAAAAAEwAAAAEAAAAC",
        "AAAABQAAAC1FdmVudCBlbWl0dGVkIHdoZW4gaXNzdWVyIHRvcGljcyBhcmUgdXBkYXRlZC4AAAAAAAAAAAAAE0lzc3VlclRvcGljc1VwZGF0ZWQAAAAAAQAAABVpc3N1ZXJfdG9waWNzX3VwZGF0ZWQAAAAAAAACAAAAAAAAAA50cnVzdGVkX2lzc3VlcgAAAAAAEwAAAAEAAAAAAAAADGNsYWltX3RvcGljcwAAA+oAAAAEAAAAAAAAAAI=",
        "AAAAAgAAADFTdG9yYWdlIGtleXMgZm9yIHRoZSBtb2R1bGFyIGNvbXBsaWFuY2UgY29udHJhY3QuAAAAAAAAAAAAAAdEYXRhS2V5AAAAAAEAAAABAAAAOk1hcHMgQ29tcGxpYW5jZUhvb2sgLT4gVmVjPEFkZHJlc3M+IGZvciByZWdpc3RlcmVkIG1vZHVsZXMAAAAAAAtIb29rTW9kdWxlcwAAAAABAAAH0AAAAA5Db21wbGlhbmNlSG9vawAA",
        "AAAAAgAAAJNIb29rIHR5cGVzIGZvciBtb2R1bGFyIGNvbXBsaWFuY2Ugc3lzdGVtLgoKRWFjaCBob29rIHR5cGUgcmVwcmVzZW50cyBhIHNwZWNpZmljIGV2ZW50IG9yIHZhbGlkYXRpb24gcG9pbnQKd2hlcmUgY29tcGxpYW5jZSBtb2R1bGVzIGNhbiBiZSBleGVjdXRlZC4AAAAAAAAAAA5Db21wbGlhbmNlSG9vawAAAAAABQAAAAAAAACeQ2FsbGVkIGFmdGVyIHRva2VucyBhcmUgc3VjY2Vzc2Z1bGx5IHRyYW5zZmVycmVkIGZyb20gb25lIHdhbGxldCB0bwphbm90aGVyLiBNb2R1bGVzIHJlZ2lzdGVyZWQgZm9yIHRoaXMgaG9vayBjYW4gdXBkYXRlIHRoZWlyIHN0YXRlCmJhc2VkIG9uIHRyYW5zZmVyIGV2ZW50cy4AAAAAAAtUcmFuc2ZlcnJlZAAAAAAAAAAAkUNhbGxlZCBhZnRlciB0b2tlbnMgYXJlIHN1Y2Nlc3NmdWxseSBjcmVhdGVkL21pbnRlZCB0byBhIHdhbGxldC4KTW9kdWxlcyByZWdpc3RlcmVkIGZvciB0aGlzIGhvb2sgY2FuIHVwZGF0ZSB0aGVpciBzdGF0ZSBiYXNlZCBvbiBtaW50aW5nCmV2ZW50cy4AAAAAAAAHQ3JlYXRlZAAAAAAAAAAAlUNhbGxlZCBhZnRlciB0b2tlbnMgYXJlIHN1Y2Nlc3NmdWxseSBkZXN0cm95ZWQvYnVybmVkIGZyb20gYSB3YWxsZXQuCk1vZHVsZXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyBob29rIGNhbiB1cGRhdGUgdGhlaXIgc3RhdGUgYmFzZWQgb24gYnVybmluZwpldmVudHMuAAAAAAAACURlc3Ryb3llZAAAAAAAAAAAAADMQ2FsbGVkIGR1cmluZyB0cmFuc2ZlciB2YWxpZGF0aW9uIHRvIGNoZWNrIGlmIGEgdHJhbnNmZXIgc2hvdWxkIGJlCmFsbG93ZWQuIE1vZHVsZXMgcmVnaXN0ZXJlZCBmb3IgdGhpcyBob29rIGNhbiBpbXBsZW1lbnQgdHJhbnNmZXIKcmVzdHJpY3Rpb25zLiBUaGlzIGlzIGEgUkVBRC1vbmx5IG9wZXJhdGlvbiBhbmQgc2hvdWxkIG5vdCBtb2RpZnkKc3RhdGUuAAAAC0NhblRyYW5zZmVyAAAAAAAAAADOQ2FsbGVkIGR1cmluZyBtaW50IHZhbGlkYXRpb24gdG8gY2hlY2sgaWYgYSBtaW50IG9wZXJhdGlvbiBzaG91bGQgYmUKYWxsb3dlZC4gTW9kdWxlcyByZWdpc3RlcmVkIGZvciB0aGlzIGhvb2sgY2FuIGltcGxlbWVudCB0cmFuc2ZlcgpyZXN0cmljdGlvbnMuIFRoaXMgaXMgYSBSRUFELW9ubHkgb3BlcmF0aW9uIGFuZCBzaG91bGQgbm90IG1vZGlmeQpzdGF0ZS4AAAAAAAlDYW5DcmVhdGUAAAA=",
        "AAAABAAAAAAAAAAAAAAAD0NvbXBsaWFuY2VFcnJvcgAAAAAEAAAAN0luZGljYXRlcyBhIG1vZHVsZSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQgZm9yIHRoaXMgaG9vay4AAAAAF01vZHVsZUFscmVhZHlSZWdpc3RlcmVkAAAAAWgAAAAzSW5kaWNhdGVzIGEgbW9kdWxlIGlzIG5vdCByZWdpc3RlcmVkIGZvciB0aGlzIGhvb2suAAAAABNNb2R1bGVOb3RSZWdpc3RlcmVkAAAAAWkAAAAlSW5kaWNhdGVzIGEgbW9kdWxlIGJvdW5kIGlzIGV4Y2VlZGVkLgAAAAAAABNNb2R1bGVCb3VuZEV4Y2VlZGVkAAAAAWoAAAA7SW5kaWNhdGVzIGEgdG9rZW4gaXMgbm90IGJvdW5kIHRvIHRoaXMgY29tcGxpYW5jZSBjb250cmFjdC4AAAAADVRva2VuTm90Qm91bmQAAAAAAAFr",
        "AAAABQAAADNFdmVudCBlbWl0dGVkIHdoZW4gYSBtb2R1bGUgaXMgYWRkZWQgdG8gY29tcGxpYW5jZS4AAAAAAAAAAAtNb2R1bGVBZGRlZAAAAAABAAAADG1vZHVsZV9hZGRlZAAAAAIAAAAAAAAABGhvb2sAAAfQAAAADkNvbXBsaWFuY2VIb29rAAAAAAABAAAAAAAAAAZtb2R1bGUAAAAAABMAAAAAAAAAAg==",
        "AAAABQAAADdFdmVudCBlbWl0dGVkIHdoZW4gYSBtb2R1bGUgaXMgcmVtb3ZlZCBmcm9tIGNvbXBsaWFuY2UuAAAAAAAAAAANTW9kdWxlUmVtb3ZlZAAAAAAAAAEAAAAObW9kdWxlX3JlbW92ZWQAAAAAAAIAAAAAAAAABGhvb2sAAAfQAAAADkNvbXBsaWFuY2VIb29rAAAAAAABAAAAAAAAAAZtb2R1bGUAAAAAABMAAAAAAAAAAg==",
        "AAAAAQAAAChSZXByZXNlbnRzIGEgZG9jdW1lbnQgd2l0aCBpdHMgbWV0YWRhdGEuAAAAAAAAAAhEb2N1bWVudAAAAAMAAAAiVGhlIGhhc2ggb2YgdGhlIGRvY3VtZW50IGNvbnRlbnRzLgAAAAAADWRvY3VtZW50X2hhc2gAAAAAAAPuAAAAIAAAAC5UaW1lc3RhbXAgd2hlbiB0aGUgZG9jdW1lbnQgd2FzIGxhc3QgbW9kaWZpZWQuAAAAAAAJdGltZXN0YW1wAAAAAAAABgAAACtUaGUgVVJJIHdoZXJlIHRoZSBkb2N1bWVudCBjYW4gYmUgYWNjZXNzZWQuAAAAAAN1cmkAAAAAEA==",
        "AAAAAgAAACVTdG9yYWdlIGtleXMgZm9yIGRvY3VtZW50IG1hbmFnZW1lbnQuAAAAAAAAAAAAABJEb2N1bWVudFN0b3JhZ2VLZXkAAAAAAAMAAAABAAAAJ01hcHMgZG9jdW1lbnQgbmFtZSB0byBpdHMgZ2xvYmFsIGluZGV4LgAAAAANRG9jdW1lbnRJbmRleAAAAAAAAAEAAAPuAAAAIAAAAAEAAAA5TWFwcyBidWNrZXQgaW5kZXggdG8gYSB2ZWN0b3Igb2YgKG5hbWUsIGRvY3VtZW50KSB0dXBsZXMuAAAAAAAADkRvY3VtZW50QnVja2V0AAAAAAABAAAABAAAAAAAAAAZVG90YWwgY291bnQgb2YgZG9jdW1lbnRzLgAAAAAAAA1Eb2N1bWVudENvdW50AAAA",
        "AAAABAAAAC9FcnJvciBjb2RlcyBmb3IgZG9jdW1lbnQgbWFuYWdlbWVudCBvcGVyYXRpb25zLgAAAAAAAAAADURvY3VtZW50RXJyb3IAAAAAAAACAAAAJVRoZSBzcGVjaWZpZWQgZG9jdW1lbnQgd2FzIG5vdCBmb3VuZC4AAAAAAAAQRG9jdW1lbnROb3RGb3VuZAAAAXwAAAAtTWF4aW11bSBudW1iZXIgb2YgZG9jdW1lbnRzIGhhcyBiZWVuIHJlYWNoZWQuAAAAAAAAE01heERvY3VtZW50c1JlYWNoZWQAAAABfQ==",
        "AAAABQAAAD1FdmVudCBlbWl0dGVkIHdoZW4gYSBkb2N1bWVudCBpcyB1cGRhdGVkIChhZGRlZCBvciBtb2RpZmllZCkuAAAAAAAAAAAAAA9Eb2N1bWVudFVwZGF0ZWQAAAAAAQAAABBkb2N1bWVudF91cGRhdGVkAAAABAAAAAAAAAAEbmFtZQAAA+4AAAAgAAAAAQAAAAAAAAADdXJpAAAAABAAAAAAAAAAAAAAAA1kb2N1bWVudF9oYXNoAAAAAAAD7gAAACAAAAAAAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAGAAAAAAAAAAI=",
        "AAAABQAAAClFdmVudCBlbWl0dGVkIHdoZW4gYSBkb2N1bWVudCBpcyByZW1vdmVkLgAAAAAAAAAAAAAPRG9jdW1lbnRSZW1vdmVkAAAAAAEAAAAQZG9jdW1lbnRfcmVtb3ZlZAAAAAEAAAAAAAAABG5hbWUAAAPuAAAAIAAAAAEAAAAC",
        "AAAAAQAAACNSZXByZXNlbnRzIGEgY2xhaW0gc3RvcmVkIG9uLWNoYWluLgAAAAAAAAAABUNsYWltAAAAAAAABgAAAA5UaGUgY2xhaW0gZGF0YQAAAAAABGRhdGEAAAAOAAAAH1RoZSBhZGRyZXNzIG9mIHRoZSBjbGFpbSBpc3N1ZXIAAAAABmlzc3VlcgAAAAAAEwAAABlUaGUgc2lnbmF0dXJlIHNjaGVtZSB1c2VkAAAAAAAABnNjaGVtZQAAAAAABAAAABtUaGUgY3J5cHRvZ3JhcGhpYyBzaWduYXR1cmUAAAAACXNpZ25hdHVyZQAAAAAAAA4AAAAkVGhlIGNsYWltIHRvcGljIChudW1lcmljIGlkZW50aWZpZXIpAAAABXRvcGljAAAAAAAABAAAACdPcHRpb25hbCBVUkkgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24AAAAAA3VyaQAAAAAQ",
        "AAAAAgAAADpTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBJZGVudGl0eSBDbGFpbXMuAAAAAAAAAAAAEENsYWltc1N0b3JhZ2VLZXkAAAACAAAAAQAAABtNYXBzIGNsYWltIElEIHRvIGNsYWltIGRhdGEAAAAABUNsYWltAAAAAAAAAQAAA+4AAAAgAAAAAQAAACFNYXBzIHRvcGljIHRvIHZlY3RvciBvZiBjbGFpbSBJRHMAAAAAAAANQ2xhaW1zQnlUb3BpYwAAAAAAAAEAAAAE",
        "AAAABAAAAAAAAAAAAAAAC0NsYWltc0Vycm9yAAAAAAIAAAAZQ2xhaW0gIElEIGRvZXMgbm90IGV4aXN0LgAAAAAAAA1DbGFpbU5vdEZvdW5kAAAAAAABVAAAAGdDbGFpbSBJc3N1ZXIgY2Fubm90IHZhbGlkYXRlIHRoZSBjbGFpbSAocmV2b2NhdGlvbiwgc2lnbmF0dXJlIG1pc21hdGNoLAp1bmF1dGhvcml6ZWQgc2lnbmluZyBrZXksIGV0Yy4pAAAAAA1DbGFpbU5vdFZhbGlkAAAAAAABVQ==",
        "AAAABQAAACRFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSBpcyBhZGRlZC4AAAAAAAAACkNsYWltQWRkZWQAAAAAAAEAAAALY2xhaW1fYWRkZWQAAAAAAQAAAAAAAAAFY2xhaW0AAAAAAAfQAAAABUNsYWltAAAAAAAAAQAAAAI=",
        "AAAABQAAACZFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSBpcyByZW1vdmVkLgAAAAAAAAAAAAxDbGFpbVJlbW92ZWQAAAABAAAADWNsYWltX3JlbW92ZWQAAAAAAAABAAAAAAAAAAVjbGFpbQAAAAAAB9AAAAAFQ2xhaW0AAAAAAAABAAAAAg==",
        "AAAABQAAACZFdmVudCBlbWl0dGVkIHdoZW4gYSBjbGFpbSBpcyBjaGFuZ2VkLgAAAAAAAAAAAAxDbGFpbUNoYW5nZWQAAAABAAAADWNsYWltX2NoYW5nZWQAAAAAAAABAAAAAAAAAAVjbGFpbQAAAAAAB9AAAAAFQ2xhaW0AAAAAAAABAAAAAg==",
        "AAAAAgAAACZSZXByZXNlbnRzIHRoZSB0eXBlIG9mIGlkZW50aXR5IGhvbGRlcgAAAAAAAAAAAAxJZGVudGl0eVR5cGUAAAACAAAAAAAAAAAAAAAKSW5kaXZpZHVhbAAAAAAAAAAAAAAAAAAMT3JnYW5pemF0aW9u",
        "AAAAAgAAAENSZXByZXNlbnRzIGRpZmZlcmVudCB0eXBlcyBvZiBjb3VudHJ5IHJlbGF0aW9uc2hpcHMgZm9yIGluZGl2aWR1YWxzAAAAAAAAAAAZSW5kaXZpZHVhbENvdW50cnlSZWxhdGlvbgAAAAAAAAUAAAABAAAAFENvdW50cnkgb2YgcmVzaWRlbmNlAAAACVJlc2lkZW5jZQAAAAAAAAEAAAfQAAAAC0NvdW50cnlDb2RlAAAAAAEAAAAWQ291bnRyeSBvZiBjaXRpemVuc2hpcAAAAAAAC0NpdGl6ZW5zaGlwAAAAAAEAAAfQAAAAC0NvdW50cnlDb2RlAAAAAAEAAAAdQ291bnRyeSB3aGVyZSBmdW5kcyBvcmlnaW5hdGUAAAAAAAANU291cmNlT2ZGdW5kcwAAAAAAAAEAAAfQAAAAC0NvdW50cnlDb2RlAAAAAAEAAAApVGF4IHJlc2lkZW5jeSAoY2FuIGRpZmZlciBmcm9tIHJlc2lkZW5jZSkAAAAAAAAMVGF4UmVzaWRlbmN5AAAAAQAAB9AAAAALQ291bnRyeUNvZGUAAAAAAQAAAClDdXN0b20gY291bnRyeSB0eXBlIGZvciBmdXR1cmUgZXh0ZW5zaW9ucwAAAAAAAAZDdXN0b20AAAAAAAIAAAARAAAH0AAAAAtDb3VudHJ5Q29kZQA=",
        "AAAAAgAAAEVSZXByZXNlbnRzIGRpZmZlcmVudCB0eXBlcyBvZiBjb3VudHJ5IHJlbGF0aW9uc2hpcHMgZm9yIG9yZ2FuaXphdGlvbnMAAAAAAAAAAAAAG09yZ2FuaXphdGlvbkNvdW50cnlSZWxhdGlvbgAAAAAFAAAAAQAAACVDb3VudHJ5IG9mIGluY29ycG9yYXRpb24vcmVnaXN0cmF0aW9uAAAAAAAADUluY29ycG9yYXRpb24AAAAAAAABAAAH0AAAAAtDb3VudHJ5Q29kZQAAAAABAAAAJUNvdW50cmllcyB3aGVyZSBvcmdhbml6YXRpb24gb3BlcmF0ZXMAAAAAAAAVT3BlcmF0aW5nSnVyaXNkaWN0aW9uAAAAAAAAAQAAB9AAAAALQ291bnRyeUNvZGUAAAAAAQAAABBUYXgganVyaXNkaWN0aW9uAAAAD1RheEp1cmlzZGljdGlvbgAAAAABAAAH0AAAAAtDb3VudHJ5Q29kZQAAAAABAAAAHUNvdW50cnkgd2hlcmUgZnVuZHMgb3JpZ2luYXRlAAAAAAAADVNvdXJjZU9mRnVuZHMAAAAAAAABAAAH0AAAAAtDb3VudHJ5Q29kZQAAAAABAAAAKUN1c3RvbSBjb3VudHJ5IHR5cGUgZm9yIGZ1dHVyZSBleHRlbnNpb25zAAAAAAAABkN1c3RvbQAAAAAAAgAAABEAAAfQAAAAC0NvdW50cnlDb2RlAA==",
        "AAAAAgAAAExVbmlmaWVkIGNvdW50cnkgcmVsYXRpb25zaGlwIHRoYXQgY2FuIGJlIGVpdGhlciBpbmRpdmlkdWFsIG9yIG9yZ2FuaXphdGlvbmFsAAAAAAAAAA9Db3VudHJ5UmVsYXRpb24AAAAAAgAAAAEAAAAAAAAACkluZGl2aWR1YWwAAAAAAAEAAAfQAAAAGUluZGl2aWR1YWxDb3VudHJ5UmVsYXRpb24AAAAAAAABAAAAAAAAAAxPcmdhbml6YXRpb24AAAABAAAH0AAAABtPcmdhbml6YXRpb25Db3VudHJ5UmVsYXRpb24A",
        "AAAAAQAAAEhBIGNvdW50cnkgZGF0YSBjb250YWluaW5nIHRoZSBjb3VudHJ5IHJlbGF0aW9uc2hpcCBhbmQgb3B0aW9uYWwgbWV0YWRhdGEAAAAAAAAAC0NvdW50cnlEYXRhAAAAAAIAAAAcVHlwZSBvZiBjb3VudHJ5IHJlbGF0aW9uc2hpcAAAAAdjb3VudHJ5AAAAB9AAAAAPQ291bnRyeVJlbGF0aW9uAAAAADRPcHRpb25hbCBtZXRhZGF0YSAoZS5nLiwgdmlzYSB0eXBlLCB2YWxpZGl0eSBwZXJpb2QpAAAACG1ldGFkYXRhAAAD6AAAA+wAAAARAAAAEA==",
        "AAAAAQAAAENDb21wbGV0ZSBpZGVudGl0eSBwcm9maWxlIGNvbnRhaW5pbmcgaWRlbnRpdHkgdHlwZSBhbmQgY291bnRyeSBkYXRhAAAAAAAAAAAPSWRlbnRpdHlQcm9maWxlAAAAAAIAAAAAAAAACWNvdW50cmllcwAAAAAAA+oAAAfQAAAAC0NvdW50cnlEYXRhAAAAAAAAAAANaWRlbnRpdHlfdHlwZQAAAAAAB9AAAAAMSWRlbnRpdHlUeXBl",
        "AAAAAgAAAERTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBJZGVudGl0eSBTdG9yYWdlIFJlZ2lzdHJ5LgAAAAAAAAANSVJTU3RvcmFnZUtleQAAAAAAAAMAAAABAAAAKE1hcHMgYWNjb3VudCBhZGRyZXNzIHRvIGlkZW50aXR5IGFkZHJlc3MAAAAISWRlbnRpdHkAAAABAAAAEwAAAAEAAAAwTWFwcyBhbiBhY2NvdW50IHRvIGl0cyBjb21wbGV0ZSBpZGVudGl0eSBwcm9maWxlAAAAD0lkZW50aXR5UHJvZmlsZQAAAAABAAAAEwAAAAEAAAAuTWFwcyBvbGQgYWNjb3VudCB0byBuZXcgYWNjb3VudCBhZnRlciByZWNvdmVyeQAAAAAAC1JlY292ZXJlZFRvAAAAAAEAAAAT",
        "AAAABAAAADVFcnJvciBjb2RlcyBmb3IgdGhlIElkZW50aXR5IFJlZ2lzdHJ5IFN0b3JhZ2Ugc3lzdGVtLgAAAAAAAAAAAAAISVJTRXJyb3IAAAAGAAAAMUFuIGlkZW50aXR5IGFscmVhZHkgZXhpc3RzIGZvciB0aGUgZ2l2ZW4gYWNjb3VudC4AAAAAAAARSWRlbnRpdHlPdmVyd3JpdGUAAAAAAAFAAAAAKE5vIGlkZW50aXR5IGZvdW5kIGZvciB0aGUgZ2l2ZW4gYWNjb3VudC4AAAAQSWRlbnRpdHlOb3RGb3VuZAAAAUEAAAAuQ291bnRyeSBkYXRhIG5vdCBmb3VuZCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LgAAAAAAE0NvdW50cnlEYXRhTm90Rm91bmQAAAABQgAAAC9JZGVudGl0eSBjYW4ndCBiZSB3aXRoIGVtcHR5IGNvdW50cnkgZGF0YSBsaXN0LgAAAAAQRW1wdHlDb3VudHJ5TGlzdAAAAUMAAAA3VGhlIG1heGltdW0gbnVtYmVyIG9mIGNvdW50cnkgZW50cmllcyBoYXMgYmVlbiByZWFjaGVkLgAAAAAYTWF4Q291bnRyeUVudHJpZXNSZWFjaGVkAAABRAAAAC5BY2NvdW50IGhhcyBiZWVuIHJlY292ZXJlZCBhbmQgY2Fubm90IGJlIHVzZWQuAAAAAAAQQWNjb3VudFJlY292ZXJlZAAAAUU=",
        "AAAABQAAADhFdmVudCBlbWl0dGVkIHdoZW4gYW4gaWRlbnRpdHkgaXMgc3RvcmVkIGZvciBhbiBhY2NvdW50LgAAAAAAAAAOSWRlbnRpdHlTdG9yZWQAAAAAAAEAAAAPaWRlbnRpdHlfc3RvcmVkAAAAAAIAAAAAAAAAB2FjY291bnQAAAAAEwAAAAEAAAAAAAAACGlkZW50aXR5AAAAEwAAAAEAAAAC",
        "AAAABQAAADpFdmVudCBlbWl0dGVkIHdoZW4gYW4gaWRlbnRpdHkgaXMgcmVtb3ZlZCBmcm9tIGFuIGFjY291bnQuAAAAAAAAAAAAEElkZW50aXR5VW5zdG9yZWQAAAABAAAAEWlkZW50aXR5X3Vuc3RvcmVkAAAAAAAAAgAAAAAAAAAHYWNjb3VudAAAAAATAAAAAQAAAAAAAAAIaWRlbnRpdHkAAAATAAAAAQAAAAI=",
        "AAAABQAAADpFdmVudCBlbWl0dGVkIHdoZW4gYW4gaWRlbnRpdHkgaXMgbW9kaWZpZWQgZm9yIGFuIGFjY291bnQuAAAAAAAAAAAAEElkZW50aXR5TW9kaWZpZWQAAAABAAAAEWlkZW50aXR5X21vZGlmaWVkAAAAAAAAAgAAAAAAAAAMb2xkX2lkZW50aXR5AAAAEwAAAAEAAAAAAAAADG5ld19pZGVudGl0eQAAABMAAAABAAAAAg==",
        "AAAABQAAAD5FdmVudCBlbWl0dGVkIHdoZW4gYW4gaWRlbnRpdHkgaXMgcmVjb3ZlcmVkIGZvciBhIG5ldyBhY2NvdW50LgAAAAAAAAAAABFJZGVudGl0eVJlY292ZXJlZAAAAAAAAAEAAAASaWRlbnRpdHlfcmVjb3ZlcmVkAAAAAAACAAAAAAAAAAtvbGRfYWNjb3VudAAAAAATAAAAAQAAAAAAAAALbmV3X2FjY291bnQAAAAAEwAAAAEAAAAC",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIGZvciBjb3VudHJ5IGRhdGEgb3BlcmF0aW9ucy4AAAAAAAAAAAAQQ291bnRyeURhdGFBZGRlZAAAAAEAAAASY291bnRyeV9kYXRhX2FkZGVkAAAAAAACAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAAAAAAAAxjb3VudHJ5X2RhdGEAAAfQAAAAC0NvdW50cnlEYXRhAAAAAAEAAAAC",
        "AAAABQAAAAAAAAAAAAAAEkNvdW50cnlEYXRhUmVtb3ZlZAAAAAAAAQAAABRjb3VudHJ5X2RhdGFfcmVtb3ZlZAAAAAIAAAAAAAAAB2FjY291bnQAAAAAEwAAAAEAAAAAAAAADGNvdW50cnlfZGF0YQAAB9AAAAALQ291bnRyeURhdGEAAAAAAQAAAAI=",
        "AAAABQAAAAAAAAAAAAAAE0NvdW50cnlEYXRhTW9kaWZpZWQAAAAAAQAAABVjb3VudHJ5X2RhdGFfbW9kaWZpZWQAAAAAAAACAAAAAAAAAAdhY2NvdW50AAAAABMAAAABAAAAAAAAAAxjb3VudHJ5X2RhdGEAAAfQAAAAC0NvdW50cnlEYXRhAAAAAAEAAAAC",
        "AAAAAgAAADVTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgUldBYCB0b2tlbgAAAAAAAAAAAAAaSWRlbnRpdHlWZXJpZmllclN0b3JhZ2VLZXkAAAAAAAIAAAAAAAAAKUNsYWltIFRvcGljcyBhbmQgSXNzdWVycyBjb250cmFjdCBhZGRyZXNzAAAAAAAAFUNsYWltVG9waWNzQW5kSXNzdWVycwAAAAAAAAAAAAAqSWRlbnRpdHkgUmVnaXN0cnkgU3RvcmFnZSBjb250cmFjdCBhZGRyZXNzAAAAAAAXSWRlbnRpdHlSZWdpc3RyeVN0b3JhZ2UA",
        "AAAAAgAAADVTdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgUldBYCB0b2tlbgAAAAAAAAAAAAANUldBU3RvcmFnZUtleQAAAAAAAAYAAAABAAAAP0Zyb3plbiBzdGF0dXMgb2YgYW4gYWRkcmVzcyAodHJ1ZSA9IGZyb3plbiwgZmFsc2UgPSBub3QgZnJvemVuKQAAAAANQWRkcmVzc0Zyb3plbgAAAAAAAAEAAAATAAAAAQAAAC5BbW91bnQgb2YgdG9rZW5zIGZyb3plbiBmb3IgYSBzcGVjaWZpYyBhZGRyZXNzAAAAAAAMRnJvemVuVG9rZW5zAAAAAQAAABMAAAAAAAAAG0NvbXBsaWFuY2UgY29udHJhY3QgYWRkcmVzcwAAAAAKQ29tcGxpYW5jZQAAAAAAAAAAABpPbmNoYWluSUQgY29udHJhY3QgYWRkcmVzcwAAAAAACU9uY2hhaW5JZAAAAAAAAAAAAAAUVmVyc2lvbiBvZiB0aGUgdG9rZW4AAAAHVmVyc2lvbgAAAAAAAAAAIklkZW50aXR5IFZlcmlmaWVyIGNvbnRyYWN0IGFkZHJlc3MAAAAAABBJZGVudGl0eVZlcmlmaWVy",
        "AAAAAgAAARxTdG9yYWdlIGtleXMgZm9yIHRoZSB0b2tlbiBiaW5kZXIgc3lzdGVtLgoKLSBUb2tlbnMgYXJlIHN0b3JlZCBpbiBidWNrZXRzIG9mIDEwMCBhZGRyZXNzZXMgZWFjaAotIEVhY2ggYnVja2V0IGlzIGEgYFZlYzxBZGRyZXNzPmAgc3RvcmVkIHVuZGVyIGl0cyBidWNrZXQgaW5kZXgKLSBUb3RhbCBjb3VudCBpcyB0cmFja2VkIHNlcGFyYXRlbHkKLSBXaGVuIGEgdG9rZW4gaXMgdW5ib3VuZCwgdGhlIGxhc3QgdG9rZW4gaXMgbW92ZWQgdG8gZmlsbCB0aGUgZ2FwCihzd2FwLXJlbW92ZSBwYXR0ZXJuKQAAAAAAAAAVVG9rZW5CaW5kZXJTdG9yYWdlS2V5AAAAAAAAAgAAAAEAAABFTWFwcyBidWNrZXQgaW5kZXggdG8gYSB2ZWN0b3Igb2YgdG9rZW4gYWRkcmVzc2VzIChtYXggMTAwIHBlciBidWNrZXQpAAAAAAAAC1Rva2VuQnVja2V0AAAAAAEAAAAEAAAAAAAAABtUb3RhbCBjb3VudCBvZiBib3VuZCB0b2tlbnMAAAAAClRvdGFsQ291bnQAAA==",
        "AAAABAAAAChFcnJvciBjb2RlcyBmb3IgdGhlIFRva2VuIEJpbmRlciBzeXN0ZW0uAAAAAAAAABBUb2tlbkJpbmRlckVycm9yAAAABQAAADtUaGUgc3BlY2lmaWVkIHRva2VuIHdhcyBub3QgZm91bmQgaW4gdGhlIGJvdW5kIHRva2VucyBsaXN0LgAAAAANVG9rZW5Ob3RGb3VuZAAAAAAAAUoAAAAwQXR0ZW1wdGVkIHRvIGJpbmQgYSB0b2tlbiB0aGF0IGlzIGFscmVhZHkgYm91bmQuAAAAEVRva2VuQWxyZWFkeUJvdW5kAAAAAAABSwAAADNUb3RhbCB0b2tlbiBjYXBhY2l0eSAoTUFYX1RPS0VOUykgaGFzIGJlZW4gcmVhY2hlZC4AAAAAEE1heFRva2Vuc1JlYWNoZWQAAAFMAAAAGUJhdGNoIGJpbmQgc2l6ZSBleGNlZWRlZC4AAAAAAAARQmluZEJhdGNoVG9vTGFyZ2UAAAAAAAFNAAAAHlRoZSBiYXRjaCBjb250YWlucyBkdXBsaWNhdGVzLgAAAAAAE0JpbmRCYXRjaER1cGxpY2F0ZXMAAAABTg==",
        "AAAABQAAADRFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyBib3VuZCB0byB0aGUgY29udHJhY3QuAAAAAAAAAApUb2tlbkJvdW5kAAAAAAABAAAAC3Rva2VuX2JvdW5kAAAAAAEAAAAAAAAABXRva2VuAAAAAAAAEwAAAAEAAAAC",
        "AAAABQAAADhFdmVudCBlbWl0dGVkIHdoZW4gYSB0b2tlbiBpcyB1bmJvdW5kIGZyb20gdGhlIGNvbnRyYWN0LgAAAAAAAAAMVG9rZW5VbmJvdW5kAAAAAQAAAA10b2tlbl91bmJvdW5kAAAAAAAAAQAAAAAAAAAFdG9rZW4AAAAAAAATAAAAAQAAAAI=",
        "AAAABAAAAAAAAAAAAAAACFJXQUVycm9yAAAADgAAAEVJbmRpY2F0ZXMgYW4gZXJyb3IgcmVsYXRlZCB0byBpbnN1ZmZpY2llbnQgYmFsYW5jZSBmb3IgdGhlIG9wZXJhdGlvbi4AAAAAAAATSW5zdWZmaWNpZW50QmFsYW5jZQAAAAEsAAAALkluZGljYXRlcyBhbiBlcnJvciB3aGVuIGFuIGlucHV0IG11c3QgYmUgPj0gMC4AAAAAAAxMZXNzVGhhblplcm8AAAEtAAAAPkluZGljYXRlcyB0aGUgYWRkcmVzcyBpcyBmcm96ZW4gYW5kIGNhbm5vdCBwZXJmb3JtIG9wZXJhdGlvbnMuAAAAAAANQWRkcmVzc0Zyb3plbgAAAAAAAS4AAAA9SW5kaWNhdGVzIGluc3VmZmljaWVudCBmcmVlIHRva2VucyAoZHVlIHRvIHBhcnRpYWwgZnJlZXppbmcpLgAAAAAAABZJbnN1ZmZpY2llbnRGcmVlVG9rZW5zAAAAAAEvAAAAKUluZGljYXRlcyBhbiBpZGVudGl0eSBjYW5ub3QgYmUgdmVyaWZpZWQuAAAAAAAAGklkZW50aXR5VmVyaWZpY2F0aW9uRmFpbGVkAAAAAAEwAAAAQUluZGljYXRlcyB0aGUgdHJhbnNmZXIgZG9lcyBub3QgY29tcGx5IHdpdGggdGhlIGNvbXBsaWFuY2UgcnVsZXMuAAAAAAAAFFRyYW5zZmVyTm90Q29tcGxpYW50AAABMQAAAEdJbmRpY2F0ZXMgdGhlIG1pbnQgb3BlcmF0aW9uIGRvZXMgbm90IGNvbXBseSB3aXRoIHRoZSBjb21wbGlhbmNlIHJ1bGVzLgAAAAAQTWludE5vdENvbXBsaWFudAAAATIAAAAtSW5kaWNhdGVzIHRoZSBjb21wbGlhbmNlIGNvbnRyYWN0IGlzIG5vdCBzZXQuAAAAAAAAEENvbXBsaWFuY2VOb3RTZXQAAAEzAAAAJEluZGljYXRlcyB0aGUgb25jaGFpbiBJRCBpcyBub3Qgc2V0LgAAAA9PbmNoYWluSWROb3RTZXQAAAABNAAAACFJbmRpY2F0ZXMgdGhlIHZlcnNpb24gaXMgbm90IHNldC4AAAAAAAANVmVyc2lvbk5vdFNldAAAAAAAATUAAAA7SW5kaWNhdGVzIHRoZSBjbGFpbSB0b3BpY3MgYW5kIGlzc3VlcnMgY29udHJhY3QgaXMgbm90IHNldC4AAAAAG0NsYWltVG9waWNzQW5kSXNzdWVyc05vdFNldAAAAAE2AAAAPEluZGljYXRlcyB0aGUgaWRlbnRpdHkgcmVnaXN0cnkgc3RvcmFnZSBjb250cmFjdCBpcyBub3Qgc2V0LgAAAB1JZGVudGl0eVJlZ2lzdHJ5U3RvcmFnZU5vdFNldAAAAAAAATcAAAA0SW5kaWNhdGVzIHRoZSBpZGVudGl0eSB2ZXJpZmllciBjb250cmFjdCBpcyBub3Qgc2V0LgAAABZJZGVudGl0eVZlcmlmaWVyTm90U2V0AAAAAAE4AAAAREluZGljYXRlcyB0aGUgb2xkIGFjY291bnQgYW5kIG5ldyBhY2NvdW50IGhhdmUgZGlmZmVyZW50IGlkZW50aXRpZXMuAAAAEElkZW50aXR5TWlzbWF0Y2gAAAE5",
        "AAAABQAAAC9FdmVudCBlbWl0dGVkIHdoZW4gdG9rZW4gb25jaGFpbiBJRCBpcyB1cGRhdGVkLgAAAAAAAAAAFVRva2VuT25jaGFpbklkVXBkYXRlZAAAAAAAAAEAAAAYdG9rZW5fb25jaGFpbl9pZF91cGRhdGVkAAAAAQAAAAAAAAAKb25jaGFpbl9pZAAAAAAAEwAAAAEAAAAC",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gYSByZWNvdmVyeSBpcyBzdWNjZXNzZnVsLgAAAAAAAAAPUmVjb3ZlcnlTdWNjZXNzAAAAAAEAAAAQcmVjb3Zlcnlfc3VjY2VzcwAAAAIAAAAAAAAAC29sZF9hY2NvdW50AAAAABMAAAABAAAAAAAAAAtuZXdfYWNjb3VudAAAAAATAAAAAQAAAAI=",
        "AAAABQAAADRFdmVudCBlbWl0dGVkIHdoZW4gYW4gYWRkcmVzcyBpcyBmcm96ZW4gb3IgdW5mcm96ZW4uAAAAAAAAAA1BZGRyZXNzRnJvemVuAAAAAAAAAQAAAA5hZGRyZXNzX2Zyb3plbgAAAAAAAwAAAAAAAAAMdXNlcl9hZGRyZXNzAAAAEwAAAAEAAAAAAAAACWlzX2Zyb3plbgAAAAAAAAEAAAABAAAAAAAAAAZjYWxsZXIAAAAAABMAAAABAAAAAg==",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBmcm96ZW4uAAAAAAAAAAAAAAxUb2tlbnNGcm96ZW4AAAABAAAADXRva2Vuc19mcm96ZW4AAAAAAAACAAAAAAAAAAx1c2VyX2FkZHJlc3MAAAATAAAAAQAAAAAAAAAGYW1vdW50AAAAAAALAAAAAAAAAAI=",
        "AAAABQAAACdFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSB1bmZyb3plbi4AAAAAAAAAAA5Ub2tlbnNVbmZyb3plbgAAAAAAAQAAAA90b2tlbnNfdW5mcm96ZW4AAAAAAgAAAAAAAAAMdXNlcl9hZGRyZXNzAAAAEwAAAAEAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAC",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBtaW50ZWQuAAAAAAAAAAAAAARNaW50AAAAAQAAAARtaW50AAAAAgAAAAAAAAACdG8AAAAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAACVFdmVudCBlbWl0dGVkIHdoZW4gdG9rZW5zIGFyZSBidXJuZWQuAAAAAAAAAAAAAARCdXJuAAAAAQAAAARidXJuAAAAAgAAAAAAAAAEZnJvbQAAABMAAAABAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAAAAAAAg==",
        "AAAABQAAAC5FdmVudCBlbWl0dGVkIHdoZW4gY29tcGxpYW5jZSBjb250cmFjdCBpcyBzZXQuAAAAAAAAAAAADUNvbXBsaWFuY2VTZXQAAAAAAAABAAAADmNvbXBsaWFuY2Vfc2V0AAAAAAABAAAAAAAAAApjb21wbGlhbmNlAAAAAAATAAAAAQAAAAI=",
        "AAAABQAAADxFdmVudCBlbWl0dGVkIHdoZW4gY2xhaW0gdG9waWNzIGFuZCBpc3N1ZXJzIGNvbnRyYWN0IGlzIHNldC4AAAAAAAAAGENsYWltVG9waWNzQW5kSXNzdWVyc1NldAAAAAEAAAAcY2xhaW1fdG9waWNzX2FuZF9pc3N1ZXJzX3NldAAAAAEAAAAAAAAAGGNsYWltX3RvcGljc19hbmRfaXNzdWVycwAAABMAAAABAAAAAg==",
        "AAAABQAAADVFdmVudCBlbWl0dGVkIHdoZW4gaWRlbnRpdHkgdmVyaWZpZXIgY29udHJhY3QgaXMgc2V0LgAAAAAAAAAAAAATSWRlbnRpdHlWZXJpZmllclNldAAAAAABAAAAFWlkZW50aXR5X3ZlcmlmaWVyX3NldAAAAAAAAAEAAAAAAAAAEWlkZW50aXR5X3ZlcmlmaWVyAAAAAAAAEwAAAAEAAAAC",
        "AAAABAAAAAAAAAAAAAAAC0NyeXB0b0Vycm9yAAAAAAMAAAApVGhlIG1lcmtsZSBwcm9vZiBsZW5ndGggaXMgb3V0IG9mIGJvdW5kcy4AAAAAAAAWTWVya2xlUHJvb2ZPdXRPZkJvdW5kcwAAAAAFeAAAACdUaGUgaW5kZXggb2YgdGhlIGxlYWYgaXMgb3V0IG9mIGJvdW5kcy4AAAAAFk1lcmtsZUluZGV4T3V0T2ZCb3VuZHMAAAAABXkAAAAYTm8gZGF0YSBpbiBoYXNoZXIgc3RhdGUuAAAAEEhhc2hlckVtcHR5U3RhdGUAAAV6",
        "AAAAAgAAAAAAAAAAAAAACFJvdW5kaW5nAAAAAgAAAAAAAAAAAAAABUZsb29yAAAAAAAAAAAAAAAAAAAEQ2VpbA==",
        "AAAAAgAAAD1TdG9yYWdlIGtleXMgZm9yIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBgTWVya2xlRGlzdHJpYnV0b3JgAAAAAAAAAAAAABtNZXJrbGVEaXN0cmlidXRvclN0b3JhZ2VLZXkAAAAAAgAAAAAAAAAoVGhlIE1lcmtsZSByb290IG9mIHRoZSBkaXN0cmlidXRpb24gdHJlZQAAAARSb290AAAAAQAAACNNYXBzIGFuIGluZGV4IHRvIGl0cyBjbGFpbWVkIHN0YXR1cwAAAAAHQ2xhaW1lZAAAAAABAAAABA==",
        "AAAABAAAAAAAAAAAAAAAFk1lcmtsZURpc3RyaWJ1dG9yRXJyb3IAAAAAAAMAAAAbVGhlIG1lcmtsZSByb290IGlzIG5vdCBzZXQuAAAAAApSb290Tm90U2V0AAAAAAUUAAAAJ1RoZSBwcm92aWRlZCBpbmRleCB3YXMgYWxyZWFkeSBjbGFpbWVkLgAAAAATSW5kZXhBbHJlYWR5Q2xhaW1lZAAAAAUVAAAAFVRoZSBwcm9vZiBpcyBpbnZhbGlkLgAAAAAAAAxJbnZhbGlkUHJvb2YAAAUW",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG1lcmtsZSByb290IGlzIHNldC4AAAAAAAAAAAAHU2V0Um9vdAAAAAABAAAACHNldF9yb290AAAAAQAAAAAAAAAEcm9vdAAAAA4AAAAAAAAAAg==",
        "AAAABQAAACdFdmVudCBlbWl0dGVkIHdoZW4gYW4gaW5kZXggaXMgY2xhaW1lZC4AAAAAAAAAAApTZXRDbGFpbWVkAAAAAAABAAAAC3NldF9jbGFpbWVkAAAAAAEAAAAAAAAABWluZGV4AAAAAAAAAAAAAAAAAAAC",
        "AAAAAgAAACJTdG9yYWdlIGtleSBmb3IgdGhlIHBhdXNhYmxlIHN0YXRlAAAAAAAAAAAAElBhdXNhYmxlU3RvcmFnZUtleQAAAAAAAQAAAAAAAAAySW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNvbnRyYWN0IGlzIGluIHBhdXNlZCBzdGF0ZS4AAAAAAAZQYXVzZWQAAA==",
        "AAAABAAAAAAAAAAAAAAADVBhdXNhYmxlRXJyb3IAAAAAAAACAAAANFRoZSBvcGVyYXRpb24gZmFpbGVkIGJlY2F1c2UgdGhlIGNvbnRyYWN0IGlzIHBhdXNlZC4AAAANRW5mb3JjZWRQYXVzZQAAAAAAA+gAAAA4VGhlIG9wZXJhdGlvbiBmYWlsZWQgYmVjYXVzZSB0aGUgY29udHJhY3QgaXMgbm90IHBhdXNlZC4AAAANRXhwZWN0ZWRQYXVzZQAAAAAAA+k=",
        "AAAABQAAACpFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbnRyYWN0IGlzIHBhdXNlZC4AAAAAAAAAAAAGUGF1c2VkAAAAAAABAAAABnBhdXNlZAAAAAAAAAAAAAI=",
        "AAAABQAAACxFdmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbnRyYWN0IGlzIHVucGF1c2VkLgAAAAAAAAAIVW5wYXVzZWQAAAABAAAACHVucGF1c2VkAAAAAAAAAAI=",
        "AAAABAAAAAAAAAAAAAAAEFVwZ3JhZGVhYmxlRXJyb3IAAAABAAAAQVdoZW4gbWlncmF0aW9uIGlzIGF0dGVtcHRlZCBidXQgbm90IGFsbG93ZWQgZHVlIHRvIHVwZ3JhZGUgc3RhdGUuAAAAAAAAE01pZ3JhdGlvbk5vdEFsbG93ZWQAAAAETA==",
        "AAAAAQAAALpRMTI4LjEyOCBmaXhlZC1wb2ludCBudW1iZXIKClJlcHJlc2VudHMgYSBudW1iZXIgYXM6IHZhbHVlIC8gMl4xMjgKClVzZWQgZXhjbHVzaXZlbHkgZm9yIGZlZSBncm93dGggdHJhY2tpbmcgaW4gVW5pc3dhcCBWMyBhcmNoaXRlY3R1cmUuCkZvciBwcmljZSBjYWxjdWxhdGlvbnMsIHVzZSBGaXhlZFBvaW50OTYgaW5zdGVhZC4AAAAAAAAAAAANRml4ZWRQb2ludDEyOAAAAAAAAAEAAAAAAAAAATAAAAAAAAAM",
        "AAAAAQAAAHdRNjQuOTYgZml4ZWQtcG9pbnQgbnVtYmVyCgpJbnRlcm5hbGx5IHN0b3JlZCBhcyBhIFUyNTYgd2hlcmUgdGhlIHZhbHVlIHJlcHJlc2VudHM6CmBhY3R1YWxfdmFsdWUgPSBzdG9yZWRfdmFsdWUgLyAyXjk2YAAAAAAAAAAADEZpeGVkUG9pbnQ5NgAAAAEAAAAAAAAAATAAAAAAAAAM",
        "AAAAAQAAAAAAAAAAAAAADlN3YXBTdGVwUmVzdWx0AAAAAAAEAAAAAAAAAAlhbW91bnRfaW4AAAAAAAAMAAAAAAAAAAphbW91bnRfb3V0AAAAAAAMAAAAAAAAAApmZWVfYW1vdW50AAAAAAAMAAAAAAAAAA9zcXJ0X3JhdGlvX25leHQAAAAH0AAAAAxTcXJ0UHJpY2VYOTY=",
        "AAAAAQAAAJQ1MTItYml0IHVuc2lnbmVkIGludGVnZXIKClJlcHJlc2VudGVkIGFzIHR3byAyNTYtYml0IGNvbXBvbmVudHM6Ci0gYGxvd2A6IGJpdHMgMC0yNTUKLSBgaGlnaGA6IGJpdHMgMjU2LTUxMQoKVGhlIGFjdHVhbCB2YWx1ZSBpczogaGlnaCAqIDJeMjU2ICsgbG93AAAAAAAAAARVNTEyAAAAAgAAAAAAAAAEaGlnaAAAAAwAAAAAAAAAA2xvdwAAAAAM" ]),
      options
    )
  }
  public readonly fromJSON = {
    init: this.txFromJSON<null>,
        positions: this.txFromJSON<Result<PositionTuple>>,
        mint: this.txFromJSON<Result<readonly [u32, u128, u128, u128]>>,
        increase_liquidity: this.txFromJSON<Result<readonly [u128, u128, u128]>>,
        decrease_liquidity: this.txFromJSON<Result<readonly [u128, u128]>>,
        collect: this.txFromJSON<Result<readonly [u128, u128]>>,
        get_token_descriptor: this.txFromJSON<string>,
        get_factory: this.txFromJSON<string>,
        get_xlm_address: this.txFromJSON<string>,
        owner_of: this.txFromJSON<string>,
        name: this.txFromJSON<string>,
        symbol: this.txFromJSON<string>,
        balance: this.txFromJSON<u32>,
        transfer: this.txFromJSON<null>,
        approve: this.txFromJSON<null>,
        get_approved: this.txFromJSON<Option<string>>,
        approve_for_all: this.txFromJSON<null>,
        is_approved_for_all: this.txFromJSON<boolean>,
        transfer_from: this.txFromJSON<null>,
        exists: this.txFromJSON<boolean>,
        token_uri: this.txFromJSON<string>,
        burn: this.txFromJSON<null>,
        get_user_token_ids: this.txFromJSON<Array<u32>>,
        get_position_with_fees: this.txFromJSON<Result<UserPositionInfo>>,
        get_positions_with_fees: this.txFromJSON<Result<Array<UserPositionInfo>>>,
        get_user_positions_with_fees: this.txFromJSON<Result<Array<UserPositionInfo>>>,
        position_principal: this.txFromJSON<Result<readonly [u128, u128]>>,
        position_fees: this.txFromJSON<Result<readonly [u128, u128]>>,
        position_total: this.txFromJSON<Result<readonly [u128, u128]>>
  }
}