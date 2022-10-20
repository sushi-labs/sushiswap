/*!
 Copyright (c) Peculiar Ventures, LLC
*/

import { BufferSource as BufferSource$1 } from 'pvtsutils';
export { BufferSourceConverter } from 'pvtsutils';
import { IJsonConvertible, IJsonConverter } from '@peculiar/json-schema';
import { IAsnConverter } from '@peculiar/asn1-schema';

declare class CryptoError extends Error {
}

declare class AlgorithmError extends CryptoError {
}

declare class UnsupportedOperationError extends CryptoError {
    constructor(methodName?: string);
}

declare class OperationError extends CryptoError {
}

declare class RequiredPropertyError extends CryptoError {
    constructor(propName: string);
}

declare type NativeCrypto = Crypto;
declare type NativeSubtleCrypto = SubtleCrypto;
declare type NativeCryptoKey = CryptoKey;
declare type HexString = string;
declare type KeyUsages = KeyUsage[];
declare type ProviderKeyUsage = KeyUsages;
interface ProviderKeyPairUsage {
    privateKey: KeyUsages;
    publicKey: KeyUsages;
}
declare type ProviderKeyUsages = ProviderKeyUsage | ProviderKeyPairUsage;
interface HashedAlgorithm extends Algorithm {
    hash: AlgorithmIdentifier;
}
declare type ImportAlgorithms = Algorithm | RsaHashedImportParams | EcKeyImportParams;
/**
 * Base generic class for crypto storages
 */
interface CryptoStorage<T> {
    /**
     * Returns list of indexes from storage
     */
    keys(): Promise<string[]>;
    /**
     * Returns index of item in storage
     * @param item Crypto item
     * @returns Index of item in storage otherwise null
     */
    indexOf(item: T): Promise<string | null>;
    /**
     * Add crypto item to storage and returns it's index
     */
    setItem(item: T): Promise<string>;
    /**
     * Returns crypto item from storage by index
     * @param index index of crypto item
     * @returns Crypto item
     * @throws Throws Error when cannot find crypto item in storage
     */
    getItem(index: string): Promise<T>;
    /**
     * Returns `true` if item is in storage otherwise `false`
     * @param item Crypto item
     */
    hasItem(item: T): Promise<boolean>;
    /**
     * Removes all items from storage
     */
    clear(): Promise<void>;
    /**
     * Removes crypto item from storage by index
     * @param index Index of crypto storage
     */
    removeItem(index: string): Promise<void>;
}
interface CryptoKeyStorage extends CryptoStorage<CryptoKey> {
    getItem(index: string): Promise<CryptoKey>;
    getItem(index: string, algorithm: ImportAlgorithms, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey>;
}
declare type CryptoCertificateFormat = "raw" | "pem";
declare type CryptoCertificateType = "x509" | "request";
interface CryptoCertificate {
    type: CryptoCertificateType;
    publicKey: CryptoKey;
}
interface CryptoX509Certificate extends CryptoCertificate {
    type: "x509";
    notBefore: Date;
    notAfter: Date;
    serialNumber: HexString;
    issuerName: string;
    subjectName: string;
}
interface CryptoX509CertificateRequest extends CryptoCertificate {
    type: "request";
    subjectName: string;
}
interface CryptoCertificateStorage extends CryptoStorage<CryptoCertificate> {
    getItem(index: string): Promise<CryptoCertificate>;
    getItem(index: string, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
    exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string>;
    exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>;
    exportCert(format: "pem", item: CryptoCertificate): Promise<string>;
    importCert(format: CryptoCertificateFormat, data: BufferSource | string, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
    importCert(format: "raw", data: BufferSource, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
    importCert(format: "pem", data: string, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
}
interface CryptoStorages {
    keyStorage: CryptoKeyStorage;
    certStorage: CryptoCertificateStorage;
}

interface IProviderCheckOptions {
    keyUsage?: boolean;
}
declare abstract class ProviderCrypto {
    /**
     * Name of the algorithm
     */
    abstract readonly name: string;
    /**
     * Key usages for secret key or key pair
     */
    abstract readonly usages: ProviderKeyUsages;
    digest(algorithm: Algorithm, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    checkDigest(algorithm: Algorithm, data: ArrayBuffer): void;
    onDigest(algorithm: Algorithm, data: ArrayBuffer): Promise<ArrayBuffer>;
    generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKeyPair>;
    generateKey(algorithm: AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKey>;
    generateKey(algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKeyPair | CryptoKey>;
    checkGenerateKey(algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): void;
    checkGenerateKeyParams(algorithm: Algorithm): void;
    onGenerateKey(algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKeyPair | CryptoKey>;
    sign(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    checkSign(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, ...args: any[]): void;
    onSign(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    verify(algorithm: Algorithm, key: CryptoKey, signature: ArrayBuffer, data: ArrayBuffer, ...args: any[]): Promise<boolean>;
    checkVerify(algorithm: Algorithm, key: CryptoKey, signature: ArrayBuffer, data: ArrayBuffer, ...args: any[]): void;
    onVerify(algorithm: Algorithm, key: CryptoKey, signature: ArrayBuffer, data: ArrayBuffer, ...args: any[]): Promise<boolean>;
    encrypt(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, options?: IProviderCheckOptions, ...args: any[]): Promise<ArrayBuffer>;
    checkEncrypt(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, options?: IProviderCheckOptions, ...args: any[]): void;
    onEncrypt(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    decrypt(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, options?: IProviderCheckOptions, ...args: any[]): Promise<ArrayBuffer>;
    checkDecrypt(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, options?: IProviderCheckOptions, ...args: any[]): void;
    onDecrypt(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    deriveBits(algorithm: Algorithm, baseKey: CryptoKey, length: number, options?: IProviderCheckOptions, ...args: any[]): Promise<ArrayBuffer>;
    checkDeriveBits(algorithm: Algorithm, baseKey: CryptoKey, length: number, options?: IProviderCheckOptions, ...args: any[]): void;
    onDeriveBits(algorithm: Algorithm, baseKey: CryptoKey, length: number, ...args: any[]): Promise<ArrayBuffer>;
    exportKey(format: KeyFormat, key: CryptoKey, ...args: any[]): Promise<JsonWebKey | ArrayBuffer>;
    checkExportKey(format: KeyFormat, key: CryptoKey, ...args: any[]): void;
    onExportKey(format: KeyFormat, key: CryptoKey, ...args: any[]): Promise<JsonWebKey | ArrayBuffer>;
    importKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey>;
    checkImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): void;
    onImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey>;
    checkAlgorithmName(algorithm: Algorithm): void;
    checkAlgorithmParams(algorithm: Algorithm): void;
    checkDerivedKeyParams(algorithm: Algorithm): void;
    checkKeyUsages(usages: KeyUsages, allowed: KeyUsages): void;
    checkCryptoKey(key: CryptoKey, keyUsage?: KeyUsage): void;
    checkRequiredProperty(data: object, propName: string): void;
    checkHashAlgorithm(algorithm: Algorithm, hashAlgorithms: string[]): void;
    checkImportParams(algorithm: Algorithm): void;
    checkKeyFormat(format: any): void;
    checkKeyData(format: KeyFormat, keyData: any): void;
    protected prepareData(data: any): ArrayBuffer;
}

interface KeyAlgorithm extends Algorithm {
}
declare class CryptoKey$1 implements globalThis.CryptoKey {
    static create<T extends CryptoKey$1>(this: new () => T, algorithm: KeyAlgorithm, type: KeyType, extractable: boolean, usages: KeyUsages): T;
    static isKeyType(data: any): data is KeyType;
    algorithm: KeyAlgorithm;
    type: KeyType;
    usages: KeyUsages;
    extractable: boolean;
}

declare abstract class AesProvider extends ProviderCrypto {
    checkGenerateKeyParams(algorithm: AesKeyGenParams): void;
    checkDerivedKeyParams(algorithm: AesKeyGenParams): void;
    abstract onGenerateKey(algorithm: AesKeyGenParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
    abstract onExportKey(format: KeyFormat, key: CryptoKey$1, ...args: any[]): Promise<JsonWebKey | ArrayBuffer>;
    abstract onImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
}

declare abstract class AesCbcProvider extends AesProvider {
    readonly name = "AES-CBC";
    usages: KeyUsages;
    checkAlgorithmParams(algorithm: AesCbcParams): void;
    abstract onEncrypt(algorithm: AesCbcParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onDecrypt(algorithm: AesCbcParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
}

interface AesCmacParams extends Algorithm {
    length: number;
}
declare abstract class AesCmacProvider extends AesProvider {
    readonly name = "AES-CMAC";
    usages: KeyUsages;
    checkAlgorithmParams(algorithm: AesCmacParams): void;
    abstract onSign(algorithm: AesCmacParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onVerify(algorithm: AesCmacParams, key: CryptoKey, signature: ArrayBuffer, data: ArrayBuffer, ...args: any[]): Promise<boolean>;
}

declare abstract class AesCtrProvider extends AesProvider {
    readonly name = "AES-CTR";
    usages: KeyUsages;
    checkAlgorithmParams(algorithm: AesCtrParams): void;
    abstract onEncrypt(algorithm: AesCtrParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onDecrypt(algorithm: AesCtrParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
}

declare abstract class AesEcbProvider extends AesProvider {
    readonly name = "AES-ECB";
    usages: KeyUsages;
    abstract onEncrypt(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onDecrypt(algorithm: Algorithm, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
}

declare abstract class AesGcmProvider extends AesProvider {
    readonly name = "AES-GCM";
    usages: KeyUsages;
    checkAlgorithmParams(algorithm: AesGcmParams): void;
    abstract onEncrypt(algorithm: AesGcmParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onDecrypt(algorithm: AesGcmParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
}

declare abstract class AesKwProvider extends AesProvider {
    readonly name = "AES-KW";
    usages: KeyUsages;
}

interface DesKeyAlgorithm extends KeyAlgorithm {
    length: number;
}
interface DesParams extends Algorithm {
    iv: BufferSource;
}
interface DesKeyGenParams extends Algorithm {
    length: number;
}
interface DesDerivedKeyParams extends Algorithm {
    length: number;
}
interface DesImportParams extends Algorithm {
}
declare abstract class DesProvider extends ProviderCrypto {
    usages: KeyUsages;
    abstract keySizeBits: number;
    abstract ivSize: number;
    checkAlgorithmParams(algorithm: AesCbcParams): void;
    checkGenerateKeyParams(algorithm: DesKeyGenParams): void;
    checkDerivedKeyParams(algorithm: DesDerivedKeyParams): void;
    abstract onGenerateKey(algorithm: DesKeyGenParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
    abstract onExportKey(format: KeyFormat, key: CryptoKey$1, ...args: any[]): Promise<JsonWebKey | ArrayBuffer>;
    abstract onImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: DesImportParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
    abstract onEncrypt(algorithm: DesParams, key: CryptoKey$1, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onDecrypt(algorithm: DesParams, key: CryptoKey$1, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
}

declare abstract class RsaProvider extends ProviderCrypto {
    hashAlgorithms: string[];
    checkGenerateKeyParams(algorithm: RsaHashedKeyGenParams): void;
    checkImportParams(algorithm: RsaHashedImportParams): void;
    abstract onGenerateKey(algorithm: RsaHashedKeyGenParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKeyPair>;
    abstract onExportKey(format: KeyFormat, key: CryptoKey$1, ...args: any[]): Promise<JsonWebKey | ArrayBuffer>;
    abstract onImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: RsaHashedImportParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
}

interface RsaSsaParams extends Algorithm {
}
declare abstract class RsaSsaProvider extends RsaProvider {
    readonly name = "RSASSA-PKCS1-v1_5";
    usages: ProviderKeyUsages;
    abstract onSign(algorithm: RsaSsaParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onVerify(algorithm: RsaSsaParams, key: CryptoKey, signature: ArrayBuffer, data: ArrayBuffer, ...args: any[]): Promise<boolean>;
}

declare abstract class RsaPssProvider extends RsaProvider {
    readonly name = "RSA-PSS";
    usages: ProviderKeyUsages;
    checkAlgorithmParams(algorithm: RsaPssParams): void;
    abstract onSign(algorithm: RsaPssParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onVerify(algorithm: RsaPssParams, key: CryptoKey, signature: ArrayBuffer, data: ArrayBuffer, ...args: any[]): Promise<boolean>;
}

declare abstract class RsaOaepProvider extends RsaProvider {
    readonly name = "RSA-OAEP";
    usages: ProviderKeyUsages;
    checkAlgorithmParams(algorithm: RsaOaepParams): void;
    abstract onEncrypt(algorithm: RsaOaepParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onDecrypt(algorithm: RsaOaepParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
}

declare abstract class EllipticProvider extends ProviderCrypto {
    abstract namedCurves: string[];
    checkGenerateKeyParams(algorithm: EcKeyGenParams): void;
    checkNamedCurve(namedCurve: string): void;
    abstract onGenerateKey(algorithm: EcKeyGenParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKeyPair>;
    abstract onExportKey(format: KeyFormat, key: CryptoKey$1, ...args: any[]): Promise<JsonWebKey | ArrayBuffer>;
    abstract onImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: EcKeyImportParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
}

declare abstract class EcdsaProvider extends EllipticProvider {
    readonly name: string;
    readonly hashAlgorithms: string[];
    usages: ProviderKeyUsages;
    namedCurves: string[];
    checkAlgorithmParams(algorithm: EcdsaParams): void;
    abstract onSign(algorithm: EcdsaParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onVerify(algorithm: EcdsaParams, key: CryptoKey, signature: ArrayBuffer, data: ArrayBuffer, ...args: any[]): Promise<boolean>;
}

declare abstract class EcdhProvider extends EllipticProvider {
    readonly name: string;
    usages: ProviderKeyUsages;
    namedCurves: string[];
    checkAlgorithmParams(algorithm: EcdhKeyDeriveParams): void;
    abstract onDeriveBits(algorithm: EcdhKeyDeriveParams, baseKey: CryptoKey$1, length: number, ...args: any[]): Promise<ArrayBuffer>;
}

declare abstract class EcdhEsProvider extends EcdhProvider {
    readonly name: string;
    namedCurves: string[];
}

declare abstract class EdDsaProvider extends EllipticProvider {
    readonly name: string;
    usages: ProviderKeyUsages;
    namedCurves: string[];
    abstract onSign(algorithm: EcdsaParams, key: CryptoKey, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    abstract onVerify(algorithm: EcdsaParams, key: CryptoKey, signature: ArrayBuffer, data: ArrayBuffer, ...args: any[]): Promise<boolean>;
}

interface EcCurveParams {
    /**
     * The name of the curve
     */
    name: string;
    /**
     * The object identifier of the curve
     */
    id: string;
    /**
     * Curve point size in bits
     */
    size: number;
}
interface EcCurve extends EcCurveParams {
    raw: ArrayBuffer;
}
declare class EcCurves {
    protected static items: EcCurve[];
    static readonly names: string[];
    private constructor();
    static register(item: EcCurveParams): void;
    static find(nameOrId: string): EcCurve | null;
    static get(nameOrId: string): EcCurve;
}

interface EcPoint {
    x: BufferSource$1;
    y: BufferSource$1;
}
interface EcSignaturePoint {
    r: BufferSource$1;
    s: BufferSource$1;
}
declare class EcUtils {
    /**
     * Decodes ANSI X9.62 encoded point
     * @note Used by SunPKCS11 and SunJSSE
     * @param data ANSI X9.62 encoded point
     * @param pointSize Size of the point in bits
     * @returns Decoded point with x and y coordinates
     */
    static decodePoint(data: BufferSource$1, pointSize: number): EcPoint;
    /**
     * Encodes EC point to ANSI X9.62 encoded point
     * @param point EC point
     * @param pointSize Size of the point in bits
     * @returns ANSI X9.62 encoded point
     */
    static encodePoint(point: EcPoint, pointSize: number): Uint8Array;
    static getSize(pointSize: number): number;
    static encodeSignature(signature: EcSignaturePoint, pointSize: number): Uint8Array;
    static decodeSignature(data: BufferSource$1, pointSize: number): EcSignaturePoint;
    static trimStart(data: Uint8Array): Uint8Array;
    static padStart(data: Uint8Array, size: number): Uint8Array;
}

declare abstract class HmacProvider extends ProviderCrypto {
    name: string;
    hashAlgorithms: string[];
    usages: KeyUsages;
    /**
     * Returns default size in bits by hash algorithm name
     * @param algName Name of the hash algorithm
     */
    getDefaultLength(algName: string): number;
    checkGenerateKeyParams(algorithm: HmacKeyGenParams): void;
    checkImportParams(algorithm: HmacImportParams): void;
    abstract onGenerateKey(algorithm: HmacKeyGenParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
    abstract onExportKey(format: KeyFormat, key: CryptoKey$1, ...args: any[]): Promise<JsonWebKey | ArrayBuffer>;
    abstract onImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: HmacImportParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
}

declare abstract class Pbkdf2Provider extends ProviderCrypto {
    name: string;
    hashAlgorithms: string[];
    usages: KeyUsages;
    checkAlgorithmParams(algorithm: Pbkdf2Params): void;
    checkImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): void;
    abstract onImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
    abstract onDeriveBits(algorithm: Pbkdf2Params, baseKey: CryptoKey$1, length: number, ...args: any[]): Promise<ArrayBuffer>;
}

declare abstract class HkdfProvider extends ProviderCrypto {
    name: string;
    hashAlgorithms: string[];
    usages: KeyUsages;
    checkAlgorithmParams(algorithm: HkdfParams): void;
    checkImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): void;
    abstract onImportKey(format: KeyFormat, keyData: JsonWebKey | ArrayBuffer, algorithm: Algorithm, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<CryptoKey$1>;
    abstract onDeriveBits(algorithm: HkdfParams, baseKey: CryptoKey$1, length: number, ...args: any[]): Promise<ArrayBuffer>;
}

interface ShakeParams extends Algorithm {
    /**
     * Output length in bytes
     */
    length?: number;
}
declare abstract class ShakeProvider extends ProviderCrypto {
    usages: never[];
    defaultLength: number;
    digest(algorithm: Algorithm, data: ArrayBuffer, ...args: any[]): Promise<ArrayBuffer>;
    checkDigest(algorithm: ShakeParams, data: ArrayBuffer): void;
    abstract onDigest(algorithm: Required<ShakeParams>, data: ArrayBuffer): Promise<ArrayBuffer>;
}

declare abstract class Shake128Provider extends ShakeProvider {
    name: string;
    defaultLength: number;
}

declare abstract class Shake256Provider extends ShakeProvider {
    name: string;
    defaultLength: number;
}

declare class ProviderStorage {
    private items;
    get(algorithmName: string): ProviderCrypto | null;
    set(provider: ProviderCrypto): void;
    removeAt(algorithmName: string): ProviderCrypto | null;
    has(name: string): boolean;
    get length(): number;
    get algorithms(): string[];
}

declare class SubtleCrypto$1 implements globalThis.SubtleCrypto {
    static isHashedAlgorithm(data: any): data is HashedAlgorithm;
    providers: ProviderStorage;
    digest(algorithm: AlgorithmIdentifier, data: BufferSource, ...args: any[]): Promise<ArrayBuffer>;
    generateKey(algorithm: RsaHashedKeyGenParams | EcKeyGenParams, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<globalThis.CryptoKeyPair>;
    generateKey(algorithm: AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<globalThis.CryptoKey>;
    generateKey(algorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: Iterable<KeyUsage>, ...args: any[]): Promise<globalThis.CryptoKeyPair | globalThis.CryptoKey>;
    sign(algorithm: AlgorithmIdentifier, key: globalThis.CryptoKey, data: BufferSource, ...args: any[]): Promise<ArrayBuffer>;
    verify(algorithm: AlgorithmIdentifier, key: globalThis.CryptoKey, signature: BufferSource, data: BufferSource, ...args: any[]): Promise<boolean>;
    encrypt(algorithm: AlgorithmIdentifier, key: globalThis.CryptoKey, data: BufferSource, ...args: any[]): Promise<ArrayBuffer>;
    decrypt(algorithm: AlgorithmIdentifier, key: globalThis.CryptoKey, data: BufferSource, ...args: any[]): Promise<ArrayBuffer>;
    deriveBits(algorithm: AlgorithmIdentifier, baseKey: globalThis.CryptoKey, length: number, ...args: any[]): Promise<ArrayBuffer>;
    deriveKey(algorithm: AlgorithmIdentifier, baseKey: globalThis.CryptoKey, derivedKeyType: AlgorithmIdentifier, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<globalThis.CryptoKey>;
    exportKey(format: "raw" | "spki" | "pkcs8", key: globalThis.CryptoKey, ...args: any[]): Promise<ArrayBuffer>;
    exportKey(format: "jwk", key: globalThis.CryptoKey, ...args: any[]): Promise<JsonWebKey>;
    exportKey(format: KeyFormat, key: globalThis.CryptoKey, ...args: any[]): Promise<JsonWebKey | ArrayBuffer>;
    importKey(format: KeyFormat, keyData: JsonWebKey | BufferSource, algorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<globalThis.CryptoKey>;
    wrapKey(format: KeyFormat, key: globalThis.CryptoKey, wrappingKey: globalThis.CryptoKey, wrapAlgorithm: AlgorithmIdentifier, ...args: any[]): Promise<ArrayBuffer>;
    unwrapKey(format: KeyFormat, wrappedKey: BufferSource, unwrappingKey: globalThis.CryptoKey, unwrapAlgorithm: AlgorithmIdentifier, unwrappedKeyAlgorithm: AlgorithmIdentifier, extractable: boolean, keyUsages: KeyUsage[], ...args: any[]): Promise<globalThis.CryptoKey>;
    protected checkRequiredArguments(args: any[], size: number, methodName: string): void;
    protected prepareAlgorithm(algorithm: AlgorithmIdentifier): Algorithm | HashedAlgorithm;
    protected getProvider(name: string): ProviderCrypto;
    protected checkCryptoKey(key: globalThis.CryptoKey): asserts key is CryptoKey$1;
}

declare abstract class Crypto$1 implements globalThis.Crypto {
    /**
     * Returns a SubtleCrypto object providing access to common cryptographic primitives,
     * like hashing, signing, encryption or decryption
     */
    abstract readonly subtle: SubtleCrypto$1;
    /**
     * Generates cryptographically random values
     * @param array Is an integer-based BufferSource.
     * All elements in the array are going to be overridden with random numbers.
     */
    abstract getRandomValues<T extends ArrayBufferView | null>(array: T): T;
    /**
     * Generates a v4 UUID using a cryptographically secure random number generator
     * @returns UUID v4 string
     */
    randomUUID(): string;
}

/**
 * PEM converter
 */
declare class PemConverter {
    /**
     * Converts PEM to Array buffer
     * @param pem PEM string
     */
    static toArrayBuffer(pem: string): ArrayBuffer;
    /**
     * Converts PEM to Uint8Array
     * @param pem PEM string
     */
    static toUint8Array(pem: string): Uint8Array;
    /**
     * Converts buffer source to PEM
     * @param buffer Buffer source
     * @param tag PEM tag name
     */
    static fromBufferSource(buffer: BufferSource, tag: string): string;
    /**
     * Returns `true` if incoming data is PEM string, otherwise `false`
     * @param data Data
     */
    static isPEM(data: string): boolean;
    /**
     * Returns tag name from PEM string
     * @param pem PEM string
     */
    static getTagName(pem: string): string;
    /**
     * Returns `true` if tag name from PEM matches to tagName parameter
     * @param pem PEM string
     * @param tagName Tag name for comparison
     */
    static hasTagName(pem: string, tagName: string): boolean;
    static isCertificate(pem: string): boolean;
    static isCertificateRequest(pem: string): boolean;
    static isCRL(pem: string): boolean;
    static isPublicKey(pem: string): boolean;
}

declare function isJWK(data: any): data is JsonWebKey;

declare class ObjectIdentifier {
    value: string;
    constructor(value?: string);
}

declare type ParametersType = ArrayBuffer | null;
declare class AlgorithmIdentifier$1 {
    algorithm: string;
    parameters?: ParametersType;
    constructor(params?: Partial<AlgorithmIdentifier$1>);
}

declare class PrivateKeyInfo {
    version: number;
    privateKeyAlgorithm: AlgorithmIdentifier$1;
    privateKey: ArrayBuffer;
    attributes?: ArrayBuffer;
}

declare class PublicKeyInfo {
    publicKeyAlgorithm: AlgorithmIdentifier$1;
    publicKey: ArrayBuffer;
}

declare class RsaPrivateKey {
    version: number;
    modulus: ArrayBuffer;
    publicExponent: ArrayBuffer;
    privateExponent: ArrayBuffer;
    prime1: ArrayBuffer;
    prime2: ArrayBuffer;
    exponent1: ArrayBuffer;
    exponent2: ArrayBuffer;
    coefficient: ArrayBuffer;
    otherPrimeInfos?: ArrayBuffer;
}

declare class RsaPublicKey {
    modulus: ArrayBuffer;
    publicExponent: ArrayBuffer;
}

declare class EcPrivateKey implements IJsonConvertible {
    version: number;
    privateKey: ArrayBuffer;
    parameters?: ArrayBuffer;
    publicKey?: ArrayBuffer;
    fromJSON(json: any): this;
    toJSON(): JsonWebKey;
}

declare class EcPublicKey implements IJsonConvertible {
    value: ArrayBuffer;
    constructor(value?: ArrayBuffer);
    toJSON(): {
        x: string;
        y: string;
    };
    fromJSON(json: any): this;
}

declare class EcDsaSignature {
    /**
     * Create EcDsaSignature from X9.62 signature
     * @param value X9.62 signature
     * @returns EcDsaSignature
     */
    static fromWebCryptoSignature(value: BufferSource$1): EcDsaSignature;
    r: ArrayBuffer;
    s: ArrayBuffer;
    /**
     * Converts ECDSA signature into X9.62 signature format
     * @param pointSize EC point size in bits
     * @returns ECDSA signature in X9.62 signature format
     */
    toWebCryptoSignature(pointSize?: number): ArrayBuffer;
}

/**
 * ```asn
 * OneAsymmetricKey ::= SEQUENCE {
 *   version Version,
 *   privateKeyAlgorithm PrivateKeyAlgorithmIdentifier,
 *   privateKey PrivateKey,
 *   attributes [0] IMPLICIT Attributes OPTIONAL,
 *   ...,
 *   [[2: publicKey [1] IMPLICIT PublicKey OPTIONAL ]],
 *   ...
 * }
 *
 * PrivateKey ::= OCTET STRING
 *
 * PublicKey ::= BIT STRING
 * ```
 */
declare class OneAsymmetricKey extends PrivateKeyInfo {
    publicKey?: ArrayBuffer;
}

declare class EdPrivateKey implements IJsonConvertible {
    value: ArrayBuffer;
    fromJSON(json: any): this;
    toJSON(): JsonWebKey;
}

declare class EdPublicKey implements IJsonConvertible {
    value: ArrayBuffer;
    constructor(value?: ArrayBuffer);
    toJSON(): {
        x: string;
    };
    fromJSON(json: any): this;
}

/**
 * ASN.1
 * ```
 * CurvePrivateKey ::= OCTET STRING
 * ```
 *
 * JSON
 * ```json
 * {
 *   "d": "base64url"
 * }
 * ```
 */
declare class CurvePrivateKey {
    d: ArrayBuffer;
}

/**
 * ```
 * secp256r1 OBJECT IDENTIFIER ::= {
 *    iso(1) member-body(2) us(840) ansi-X9-62(10045) curves(3)
 *    prime(1) 7 }
 * ```
 */
declare const idSecp256r1 = "1.2.840.10045.3.1.7";
/**
 * ```
 * ellipticCurve OBJECT IDENTIFIER ::= {
 *    iso(1) identified-organization(3) certicom(132) curve(0) }
 * ```
 */
declare const idEllipticCurve = "1.3.132.0";
/**
 * ```
 * secp384r1 OBJECT IDENTIFIER ::= { ellipticCurve 34 }
 * ```
 */
declare const idSecp384r1: string;
/**
 * ```
 * secp521r1 OBJECT IDENTIFIER ::= { ellipticCurve 35 }
 * ```
 */
declare const idSecp521r1: string;
/**
 * ```
 * secp256k1 OBJECT IDENTIFIER ::= { ellipticCurve 10 }
 * ```
 */
declare const idSecp256k1: string;
/**
 * ```
 * ecStdCurvesAndGeneration OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) teletrust(36) algorithm(3)
 *   signature-algorithm(3) ecSign(2) ecStdCurvesAndGeneration(8)
 * }
 * ellipticCurve OBJECT IDENTIFIER ::= { ecStdCurvesAndGeneration 1 }
 * versionOne OBJECT IDENTIFIER ::= { ellipticCurve 1 }
 * ```
 */
declare const idVersionOne = "1.3.36.3.3.2.8.1.1";
/**
 * ```
 * brainpoolP160r1 OBJECT IDENTIFIER ::= { versionOne 1 }
 * ```
 */
declare const idBrainpoolP160r1: string;
/**
 * ```
 * brainpoolP160t1 OBJECT IDENTIFIER ::= { versionOne 2 }
 * ```
 */
declare const idBrainpoolP160t1: string;
/**
 * ```
 * brainpoolP192r1 OBJECT IDENTIFIER ::= { versionOne 3 }
 * ```
 */
declare const idBrainpoolP192r1: string;
/**
 * ```
 * brainpoolP192t1 OBJECT IDENTIFIER ::= { versionOne 4 }
 * ```
 */
declare const idBrainpoolP192t1: string;
/**
 * ```
 * brainpoolP224r1 OBJECT IDENTIFIER ::= { versionOne 5 }
 * ```
 */
declare const idBrainpoolP224r1: string;
/**
 * ```
 * brainpoolP224t1 OBJECT IDENTIFIER ::= { versionOne 6 }
 * ```
 */
declare const idBrainpoolP224t1: string;
/**
 * ```
 * brainpoolP256r1 OBJECT IDENTIFIER ::= { versionOne 7 }
 * ```
 */
declare const idBrainpoolP256r1: string;
/**
 * ```
 * brainpoolP256t1 OBJECT IDENTIFIER ::= { versionOne 8 }
 * ```
 */
declare const idBrainpoolP256t1: string;
/**
 * ```
 * brainpoolP320r1 OBJECT IDENTIFIER ::= { versionOne 9 }
 * ```
 */
declare const idBrainpoolP320r1: string;
/**
 * ```
 * brainpoolP320t1 OBJECT IDENTIFIER ::= { versionOne 10 }
 * ```
 */
declare const idBrainpoolP320t1: string;
/**
 * ```
 * brainpoolP384r1 OBJECT IDENTIFIER ::= { versionOne 11 }
 * ```
 */
declare const idBrainpoolP384r1: string;
/**
 * ```
 * brainpoolP384t1 OBJECT IDENTIFIER ::= { versionOne 12 }
 * ```
 */
declare const idBrainpoolP384t1: string;
/**
 * ```
 * brainpoolP512r1 OBJECT IDENTIFIER ::= { versionOne 13 }
 * ```
 */
declare const idBrainpoolP512r1: string;
/**
 * ```
 * brainpoolP512t1 OBJECT IDENTIFIER ::= { versionOne 14 }
 * ```
 */
declare const idBrainpoolP512t1: string;
/**
 * ```
 * id-X25519 OBJECT IDENTIFIER ::= { 1 3 101 110 }
 * ```
 */
declare const idX25519 = "1.3.101.110";
/**
 * ```
 * id-X448 OBJECT IDENTIFIER ::= { 1 3 101 111 }
 * ```
 */
declare const idX448 = "1.3.101.111";
/**
 * ```
 * id-Ed25519 OBJECT IDENTIFIER ::= { 1 3 101 112 }
 * ```
 */
declare const idEd25519 = "1.3.101.112";
/**
 * ```
 * id-Ed448 OBJECT IDENTIFIER ::= { 1 3 101 113 }
 * ```
 */
declare const idEd448 = "1.3.101.113";

declare const AsnIntegerWithoutPaddingConverter: IAsnConverter<ArrayBuffer>;

declare const index$3_AsnIntegerWithoutPaddingConverter: typeof AsnIntegerWithoutPaddingConverter;
declare namespace index$3 {
  export {
    index$3_AsnIntegerWithoutPaddingConverter as AsnIntegerWithoutPaddingConverter,
  };
}

type index$2_ObjectIdentifier = ObjectIdentifier;
declare const index$2_ObjectIdentifier: typeof ObjectIdentifier;
type index$2_ParametersType = ParametersType;
type index$2_PrivateKeyInfo = PrivateKeyInfo;
declare const index$2_PrivateKeyInfo: typeof PrivateKeyInfo;
type index$2_PublicKeyInfo = PublicKeyInfo;
declare const index$2_PublicKeyInfo: typeof PublicKeyInfo;
type index$2_RsaPrivateKey = RsaPrivateKey;
declare const index$2_RsaPrivateKey: typeof RsaPrivateKey;
type index$2_RsaPublicKey = RsaPublicKey;
declare const index$2_RsaPublicKey: typeof RsaPublicKey;
type index$2_EcPrivateKey = EcPrivateKey;
declare const index$2_EcPrivateKey: typeof EcPrivateKey;
type index$2_EcPublicKey = EcPublicKey;
declare const index$2_EcPublicKey: typeof EcPublicKey;
type index$2_EcDsaSignature = EcDsaSignature;
declare const index$2_EcDsaSignature: typeof EcDsaSignature;
type index$2_OneAsymmetricKey = OneAsymmetricKey;
declare const index$2_OneAsymmetricKey: typeof OneAsymmetricKey;
type index$2_EdPrivateKey = EdPrivateKey;
declare const index$2_EdPrivateKey: typeof EdPrivateKey;
type index$2_EdPublicKey = EdPublicKey;
declare const index$2_EdPublicKey: typeof EdPublicKey;
type index$2_CurvePrivateKey = CurvePrivateKey;
declare const index$2_CurvePrivateKey: typeof CurvePrivateKey;
declare const index$2_idSecp256r1: typeof idSecp256r1;
declare const index$2_idEllipticCurve: typeof idEllipticCurve;
declare const index$2_idSecp384r1: typeof idSecp384r1;
declare const index$2_idSecp521r1: typeof idSecp521r1;
declare const index$2_idSecp256k1: typeof idSecp256k1;
declare const index$2_idVersionOne: typeof idVersionOne;
declare const index$2_idBrainpoolP160r1: typeof idBrainpoolP160r1;
declare const index$2_idBrainpoolP160t1: typeof idBrainpoolP160t1;
declare const index$2_idBrainpoolP192r1: typeof idBrainpoolP192r1;
declare const index$2_idBrainpoolP192t1: typeof idBrainpoolP192t1;
declare const index$2_idBrainpoolP224r1: typeof idBrainpoolP224r1;
declare const index$2_idBrainpoolP224t1: typeof idBrainpoolP224t1;
declare const index$2_idBrainpoolP256r1: typeof idBrainpoolP256r1;
declare const index$2_idBrainpoolP256t1: typeof idBrainpoolP256t1;
declare const index$2_idBrainpoolP320r1: typeof idBrainpoolP320r1;
declare const index$2_idBrainpoolP320t1: typeof idBrainpoolP320t1;
declare const index$2_idBrainpoolP384r1: typeof idBrainpoolP384r1;
declare const index$2_idBrainpoolP384t1: typeof idBrainpoolP384t1;
declare const index$2_idBrainpoolP512r1: typeof idBrainpoolP512r1;
declare const index$2_idBrainpoolP512t1: typeof idBrainpoolP512t1;
declare const index$2_idX25519: typeof idX25519;
declare const index$2_idX448: typeof idX448;
declare const index$2_idEd25519: typeof idEd25519;
declare const index$2_idEd448: typeof idEd448;
declare namespace index$2 {
  export {
    index$3 as converters,
    index$2_ObjectIdentifier as ObjectIdentifier,
    index$2_ParametersType as ParametersType,
    AlgorithmIdentifier$1 as AlgorithmIdentifier,
    index$2_PrivateKeyInfo as PrivateKeyInfo,
    index$2_PublicKeyInfo as PublicKeyInfo,
    index$2_RsaPrivateKey as RsaPrivateKey,
    index$2_RsaPublicKey as RsaPublicKey,
    index$2_EcPrivateKey as EcPrivateKey,
    index$2_EcPublicKey as EcPublicKey,
    index$2_EcDsaSignature as EcDsaSignature,
    index$2_OneAsymmetricKey as OneAsymmetricKey,
    index$2_EdPrivateKey as EdPrivateKey,
    index$2_EdPublicKey as EdPublicKey,
    index$2_CurvePrivateKey as CurvePrivateKey,
    index$2_idSecp256r1 as idSecp256r1,
    index$2_idEllipticCurve as idEllipticCurve,
    index$2_idSecp384r1 as idSecp384r1,
    index$2_idSecp521r1 as idSecp521r1,
    index$2_idSecp256k1 as idSecp256k1,
    index$2_idVersionOne as idVersionOne,
    index$2_idBrainpoolP160r1 as idBrainpoolP160r1,
    index$2_idBrainpoolP160t1 as idBrainpoolP160t1,
    index$2_idBrainpoolP192r1 as idBrainpoolP192r1,
    index$2_idBrainpoolP192t1 as idBrainpoolP192t1,
    index$2_idBrainpoolP224r1 as idBrainpoolP224r1,
    index$2_idBrainpoolP224t1 as idBrainpoolP224t1,
    index$2_idBrainpoolP256r1 as idBrainpoolP256r1,
    index$2_idBrainpoolP256t1 as idBrainpoolP256t1,
    index$2_idBrainpoolP320r1 as idBrainpoolP320r1,
    index$2_idBrainpoolP320t1 as idBrainpoolP320t1,
    index$2_idBrainpoolP384r1 as idBrainpoolP384r1,
    index$2_idBrainpoolP384t1 as idBrainpoolP384t1,
    index$2_idBrainpoolP512r1 as idBrainpoolP512r1,
    index$2_idBrainpoolP512t1 as idBrainpoolP512t1,
    index$2_idX25519 as idX25519,
    index$2_idX448 as idX448,
    index$2_idEd25519 as idEd25519,
    index$2_idEd448 as idEd448,
  };
}

declare const JsonBase64UrlArrayBufferConverter: IJsonConverter<ArrayBuffer, string>;

declare const AsnIntegerArrayBufferConverter: IAsnConverter<ArrayBuffer>;

declare const index$1_JsonBase64UrlArrayBufferConverter: typeof JsonBase64UrlArrayBufferConverter;
declare const index$1_AsnIntegerArrayBufferConverter: typeof AsnIntegerArrayBufferConverter;
declare namespace index$1 {
  export {
    index$1_JsonBase64UrlArrayBufferConverter as JsonBase64UrlArrayBufferConverter,
    index$1_AsnIntegerArrayBufferConverter as AsnIntegerArrayBufferConverter,
  };
}

declare namespace index {
  export {
    index$1 as converters,
  };
}

declare class JwkUtils {
    static thumbprint(hash: AlgorithmIdentifier, jwk: JsonWebKey, crypto: Crypto): Promise<ArrayBuffer>;
    static format(jwk: JsonWebKey, remove?: boolean): JsonWebKey;
}

export { AesCbcProvider, AesCmacParams, AesCmacProvider, AesCtrProvider, AesEcbProvider, AesGcmProvider, AesKwProvider, AesProvider, AlgorithmError, Crypto$1 as Crypto, CryptoCertificate, CryptoCertificateFormat, CryptoCertificateStorage, CryptoCertificateType, CryptoError, CryptoKey$1 as CryptoKey, CryptoKeyStorage, CryptoStorage, CryptoStorages, CryptoX509Certificate, CryptoX509CertificateRequest, DesDerivedKeyParams, DesImportParams, DesKeyAlgorithm, DesKeyGenParams, DesParams, DesProvider, EcCurve, EcCurveParams, EcCurves, EcUtils, EcdhEsProvider, EcdhProvider, EcdsaProvider, EdDsaProvider, EllipticProvider, HashedAlgorithm, HexString, HkdfProvider, HmacProvider, IProviderCheckOptions, ImportAlgorithms, JwkUtils, KeyAlgorithm, KeyUsages, NativeCrypto, NativeCryptoKey, NativeSubtleCrypto, OperationError, Pbkdf2Provider, PemConverter, ProviderCrypto, ProviderKeyPairUsage, ProviderKeyUsage, ProviderKeyUsages, ProviderStorage, RequiredPropertyError, RsaOaepProvider, RsaProvider, RsaPssProvider, RsaSsaParams, RsaSsaProvider, Shake128Provider, Shake256Provider, ShakeParams, ShakeProvider, SubtleCrypto$1 as SubtleCrypto, UnsupportedOperationError, index$2 as asn1, isJWK, index as json };
