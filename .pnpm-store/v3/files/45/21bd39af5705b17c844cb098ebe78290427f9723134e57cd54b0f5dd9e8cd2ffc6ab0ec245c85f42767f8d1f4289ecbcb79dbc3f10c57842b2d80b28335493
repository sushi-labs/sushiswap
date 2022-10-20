# WalletConnect Utils

Utility Library for WalletConnect

## API

```typescript
function convertArrayBufferToBuffer (arrayBuffer: ArrayBuffer): Buffer
function convertArrayBufferToUtf8 (arrayBuffer: ArrayBuffer): string
function convertArrayBufferToHex (arrayBuffer: ArrayBuffer, noPrefix?: boolean): string
function convertArrayBufferToNumber (arrayBuffer: ArrayBuffer): number
function concatArrayBuffers (...args: ArrayBuffer[]): ArrayBuffer

function convertBufferToArrayBuffer (buffer: Buffer): ArrayBuffer
function convertBufferToUtf8 (buffer: Buffer): string
function convertBufferToHex (buffer: Buffer, noPrefix?: boolean): string
function convertBufferToNumber (buffer: Buffer): number
function concatBuffers (...args: Buffer[]): Buffer

function convertUtf8ToArrayBuffer (utf8: string): ArrayBuffer
function convertUtf8ToBuffer (utf8: string): Buffer
function convertUtf8ToHex (utf8: string, noPrefix?: boolean): string
function convertUtf8ToNumber (utf8: string): number

function convertNumberToBuffer (num: number): Buffer
function convertNumberToArrayBuffer (num: number): ArrayBuffer
function convertNumberToUtf8 (num: number): string
function convertNumberToHex (num: number, noPrefix?: boolean): string

function convertHexToBuffer (hex: string): Buffer
function convertHexToArrayBuffer (hex: string): ArrayBuffer
function convertHexToUtf8 (hex: string): string
function convertHexToNumber (hex: string): number

function sanitizeHex (hex: string): string
function addHexPrefix (hex: string): string
function removeHexPrefix (hex: string): string

function isHexString (value: any): boolean
function isEmptyString (value: string): boolean
function isEmptyArray (array: any[]): boolean

function payloadId (): number
function uuid (): string

function keccak256 (data?: string): string

function getMeta (): IClientMeta | null

function parseWalletConnectUri (str: string): IParseURIResult

function promisify (originalFn: (...args: any[]) => void, thisArg?: any): (...callArgs: any[])

function parsePersonalSign (params: string[]): string[]
function parseTransactionData (txData: Partial<ITxData>): Partial<ITxData>

function formatRpcError (error: Partial<IJsonRpcErrorMessage>): { code: number; message: string }

function isJsonRpcSubscription (object: any): boolean
function isJsonRpcRequest (object: any): boolean
function isJsonRpcResponseSuccess (object: any): boolean
function isJsonRpcResponseError (object: any): boolean
function isInternalEvent (object: any): boolean
function isWalletConnectSession (object: any): boolean
function isReservedEvent (event: string): boolean
```
