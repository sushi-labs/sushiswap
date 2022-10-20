export = CID;
/**
 * @typedef {Object} SerializedCID
 * @property {string} codec
 * @property {number} version
 * @property {Uint8Array} hash
 */
/**
 * @typedef {0|1} CIDVersion
 * @typedef {import('multibase').BaseNameOrCode} BaseNameOrCode
 * @typedef {import('multicodec').CodecName} CodecName
 * @typedef {import('multicodec').CodecCode} CodecCode
 */
/**
 * Class representing a CID `<mbase><version><mcodec><mhash>`
 * , as defined in [ipld/cid](https://github.com/multiformats/cid).
 *
 * @class CID
 */
declare class CID {
    /**
     * Test if the given input is a valid CID object.
     * Throws if it is not.
     *
     * @param {any} other - The other CID.
     * @returns {void}
     */
    static validateCID(other: any): void;
    /**
     * Check if object is a CID instance
     *
     * @param {any} value
     * @returns {value is CID}
     */
    static isCID(value: any): value is import(".");
    /**
     * Create a new CID.
     *
     * The algorithm for argument input is roughly:
     * ```
     * if (cid)
     *   -> create a copy
     * else if (str)
     *   if (1st char is on multibase table) -> CID String
     *   else -> bs58 encoded multihash
     * else if (Uint8Array)
     *   if (1st byte is 0 or 1) -> CID
     *   else -> multihash
     * else if (Number)
     *   -> construct CID by parts
     * ```
     *
     * @param {CIDVersion | string | Uint8Array | CID} version
     * @param {string|number} [codec]
     * @param {Uint8Array} [multihash]
     * @param {string} [multibaseName]
     *
     * @example
     * new CID(<version>, <codec>, <multihash>, <multibaseName>)
     * new CID(<cidStr>)
     * new CID(<cid.bytes>)
     * new CID(<multihash>)
     * new CID(<bs58 encoded multihash>)
     * new CID(<cid>)
     */
    constructor(version: CIDVersion | string | Uint8Array | CID, codec?: string | number | undefined, multihash?: Uint8Array | undefined, multibaseName?: string | undefined);
    /**
     * The version of the CID.
     *
     * @type {CIDVersion}
     */
    version: CIDVersion;
    /**
     * The codec of the CID.
     *
     * @deprecated
     * @type {CodecName}
     */
    codec: CodecName;
    /**
     * The multihash of the CID.
     *
     * @type {Uint8Array}
     */
    multihash: Uint8Array;
    multibaseName: any;
    /**
     * The CID as a `Uint8Array`
     *
     * @returns {Uint8Array}
     *
     */
    get bytes(): Uint8Array;
    /**
     * The prefix of the CID.
     *
     * @returns {Uint8Array}
     */
    get prefix(): Uint8Array;
    /**
     * The codec of the CID in its number form.
     *
     * @returns {CodecCode}
     */
    get code(): import("multicodec/src/generated-types").CodecCode;
    /**
     * Convert to a CID of version `0`.
     *
     * @returns {CID}
     */
    toV0(): CID;
    /**
     * Convert to a CID of version `1`.
     *
     * @returns {CID}
     */
    toV1(): CID;
    /**
     * Encode the CID into a string.
     *
     * @param {BaseNameOrCode} [base=this.multibaseName] - Base encoding to use.
     * @returns {string}
     */
    toBaseEncodedString(base?: "base58btc" | "identity" | "\0" | "0" | "7" | "9" | "f" | "F" | "v" | "V" | "t" | "T" | "b" | "B" | "c" | "C" | "h" | "k" | "K" | "z" | "Z" | "m" | "M" | "u" | "U" | "base2" | "base8" | "base10" | "base16" | "base16upper" | "base32hex" | "base32hexupper" | "base32hexpad" | "base32hexpadupper" | "base32" | "base32upper" | "base32pad" | "base32padupper" | "base32z" | "base36" | "base36upper" | "base58flickr" | "base64" | "base64pad" | "base64url" | "base64urlpad" | undefined): string;
    /**
     * Encode the CID into a string.
     *
     * @param {BaseNameOrCode} [base=this.multibaseName] - Base encoding to use.
     * @returns {string}
     */
    toString(base?: "base58btc" | "identity" | "\0" | "0" | "7" | "9" | "f" | "F" | "v" | "V" | "t" | "T" | "b" | "B" | "c" | "C" | "h" | "k" | "K" | "z" | "Z" | "m" | "M" | "u" | "U" | "base2" | "base8" | "base10" | "base16" | "base16upper" | "base32hex" | "base32hexupper" | "base32hexpad" | "base32hexpadupper" | "base32" | "base32upper" | "base32pad" | "base32padupper" | "base32z" | "base36" | "base36upper" | "base58flickr" | "base64" | "base64pad" | "base64url" | "base64urlpad" | undefined): string;
    /**
     * Serialize to a plain object.
     *
     * @returns {SerializedCID}
     */
    toJSON(): SerializedCID;
    /**
     * Compare equality with another CID.
     *
     * @param {CID} other
     * @returns {boolean}
     */
    equals(other: CID): boolean;
}
declare namespace CID {
    export { codecs, SerializedCID, CIDVersion, BaseNameOrCode, CodecName, CodecCode };
}
type CIDVersion = 0 | 1;
type CodecName = "dag-pb" | "identity" | "cidv1" | "cidv2" | "cidv3" | "ip4" | "tcp" | "sha1" | "sha2-256" | "sha2-512" | "sha3-512" | "sha3-384" | "sha3-256" | "sha3-224" | "shake-128" | "shake-256" | "keccak-224" | "keccak-256" | "keccak-384" | "keccak-512" | "blake3" | "dccp" | "murmur3-128" | "murmur3-32" | "ip6" | "ip6zone" | "path" | "multicodec" | "multihash" | "multiaddr" | "multibase" | "dns" | "dns4" | "dns6" | "dnsaddr" | "protobuf" | "cbor" | "raw" | "dbl-sha2-256" | "rlp" | "bencode" | "dag-cbor" | "libp2p-key" | "git-raw" | "torrent-info" | "torrent-file" | "leofcoin-block" | "leofcoin-tx" | "leofcoin-pr" | "sctp" | "dag-jose" | "dag-cose" | "eth-block" | "eth-block-list" | "eth-tx-trie" | "eth-tx" | "eth-tx-receipt-trie" | "eth-tx-receipt" | "eth-state-trie" | "eth-account-snapshot" | "eth-storage-trie" | "bitcoin-block" | "bitcoin-tx" | "bitcoin-witness-commitment" | "zcash-block" | "zcash-tx" | "docid" | "stellar-block" | "stellar-tx" | "md4" | "md5" | "bmt" | "decred-block" | "decred-tx" | "ipld-ns" | "ipfs-ns" | "swarm-ns" | "ipns-ns" | "zeronet" | "secp256k1-pub" | "bls12_381-g1-pub" | "bls12_381-g2-pub" | "x25519-pub" | "ed25519-pub" | "bls12_381-g1g2-pub" | "dash-block" | "dash-tx" | "swarm-manifest" | "swarm-feed" | "udp" | "p2p-webrtc-star" | "p2p-webrtc-direct" | "p2p-stardust" | "p2p-circuit" | "dag-json" | "udt" | "utp" | "unix" | "thread" | "p2p" | "ipfs" | "https" | "onion" | "onion3" | "garlic64" | "garlic32" | "tls" | "quic" | "ws" | "wss" | "p2p-websocket-star" | "http" | "json" | "messagepack" | "libp2p-peer-record" | "sha2-256-trunc254-padded" | "ripemd-128" | "ripemd-160" | "ripemd-256" | "ripemd-320" | "x11" | "p256-pub" | "p384-pub" | "p521-pub" | "ed448-pub" | "x448-pub" | "ed25519-priv" | "kangarootwelve" | "sm3-256" | "blake2b-8" | "blake2b-16" | "blake2b-24" | "blake2b-32" | "blake2b-40" | "blake2b-48" | "blake2b-56" | "blake2b-64" | "blake2b-72" | "blake2b-80" | "blake2b-88" | "blake2b-96" | "blake2b-104" | "blake2b-112" | "blake2b-120" | "blake2b-128" | "blake2b-136" | "blake2b-144" | "blake2b-152" | "blake2b-160" | "blake2b-168" | "blake2b-176" | "blake2b-184" | "blake2b-192" | "blake2b-200" | "blake2b-208" | "blake2b-216" | "blake2b-224" | "blake2b-232" | "blake2b-240" | "blake2b-248" | "blake2b-256" | "blake2b-264" | "blake2b-272" | "blake2b-280" | "blake2b-288" | "blake2b-296" | "blake2b-304" | "blake2b-312" | "blake2b-320" | "blake2b-328" | "blake2b-336" | "blake2b-344" | "blake2b-352" | "blake2b-360" | "blake2b-368" | "blake2b-376" | "blake2b-384" | "blake2b-392" | "blake2b-400" | "blake2b-408" | "blake2b-416" | "blake2b-424" | "blake2b-432" | "blake2b-440" | "blake2b-448" | "blake2b-456" | "blake2b-464" | "blake2b-472" | "blake2b-480" | "blake2b-488" | "blake2b-496" | "blake2b-504" | "blake2b-512" | "blake2s-8" | "blake2s-16" | "blake2s-24" | "blake2s-32" | "blake2s-40" | "blake2s-48" | "blake2s-56" | "blake2s-64" | "blake2s-72" | "blake2s-80" | "blake2s-88" | "blake2s-96" | "blake2s-104" | "blake2s-112" | "blake2s-120" | "blake2s-128" | "blake2s-136" | "blake2s-144" | "blake2s-152" | "blake2s-160" | "blake2s-168" | "blake2s-176" | "blake2s-184" | "blake2s-192" | "blake2s-200" | "blake2s-208" | "blake2s-216" | "blake2s-224" | "blake2s-232" | "blake2s-240" | "blake2s-248" | "blake2s-256" | "skein256-8" | "skein256-16" | "skein256-24" | "skein256-32" | "skein256-40" | "skein256-48" | "skein256-56" | "skein256-64" | "skein256-72" | "skein256-80" | "skein256-88" | "skein256-96" | "skein256-104" | "skein256-112" | "skein256-120" | "skein256-128" | "skein256-136" | "skein256-144" | "skein256-152" | "skein256-160" | "skein256-168" | "skein256-176" | "skein256-184" | "skein256-192" | "skein256-200" | "skein256-208" | "skein256-216" | "skein256-224" | "skein256-232" | "skein256-240" | "skein256-248" | "skein256-256" | "skein512-8" | "skein512-16" | "skein512-24" | "skein512-32" | "skein512-40" | "skein512-48" | "skein512-56" | "skein512-64" | "skein512-72" | "skein512-80" | "skein512-88" | "skein512-96" | "skein512-104" | "skein512-112" | "skein512-120" | "skein512-128" | "skein512-136" | "skein512-144" | "skein512-152" | "skein512-160" | "skein512-168" | "skein512-176" | "skein512-184" | "skein512-192" | "skein512-200" | "skein512-208" | "skein512-216" | "skein512-224" | "skein512-232" | "skein512-240" | "skein512-248" | "skein512-256" | "skein512-264" | "skein512-272" | "skein512-280" | "skein512-288" | "skein512-296" | "skein512-304" | "skein512-312" | "skein512-320" | "skein512-328" | "skein512-336" | "skein512-344" | "skein512-352" | "skein512-360" | "skein512-368" | "skein512-376" | "skein512-384" | "skein512-392" | "skein512-400" | "skein512-408" | "skein512-416" | "skein512-424" | "skein512-432" | "skein512-440" | "skein512-448" | "skein512-456" | "skein512-464" | "skein512-472" | "skein512-480" | "skein512-488" | "skein512-496" | "skein512-504" | "skein512-512" | "skein1024-8" | "skein1024-16" | "skein1024-24" | "skein1024-32" | "skein1024-40" | "skein1024-48" | "skein1024-56" | "skein1024-64" | "skein1024-72" | "skein1024-80" | "skein1024-88" | "skein1024-96" | "skein1024-104" | "skein1024-112" | "skein1024-120" | "skein1024-128" | "skein1024-136" | "skein1024-144" | "skein1024-152" | "skein1024-160" | "skein1024-168" | "skein1024-176" | "skein1024-184" | "skein1024-192" | "skein1024-200" | "skein1024-208" | "skein1024-216" | "skein1024-224" | "skein1024-232" | "skein1024-240" | "skein1024-248" | "skein1024-256" | "skein1024-264" | "skein1024-272" | "skein1024-280" | "skein1024-288" | "skein1024-296" | "skein1024-304" | "skein1024-312" | "skein1024-320" | "skein1024-328" | "skein1024-336" | "skein1024-344" | "skein1024-352" | "skein1024-360" | "skein1024-368" | "skein1024-376" | "skein1024-384" | "skein1024-392" | "skein1024-400" | "skein1024-408" | "skein1024-416" | "skein1024-424" | "skein1024-432" | "skein1024-440" | "skein1024-448" | "skein1024-456" | "skein1024-464" | "skein1024-472" | "skein1024-480" | "skein1024-488" | "skein1024-496" | "skein1024-504" | "skein1024-512" | "skein1024-520" | "skein1024-528" | "skein1024-536" | "skein1024-544" | "skein1024-552" | "skein1024-560" | "skein1024-568" | "skein1024-576" | "skein1024-584" | "skein1024-592" | "skein1024-600" | "skein1024-608" | "skein1024-616" | "skein1024-624" | "skein1024-632" | "skein1024-640" | "skein1024-648" | "skein1024-656" | "skein1024-664" | "skein1024-672" | "skein1024-680" | "skein1024-688" | "skein1024-696" | "skein1024-704" | "skein1024-712" | "skein1024-720" | "skein1024-728" | "skein1024-736" | "skein1024-744" | "skein1024-752" | "skein1024-760" | "skein1024-768" | "skein1024-776" | "skein1024-784" | "skein1024-792" | "skein1024-800" | "skein1024-808" | "skein1024-816" | "skein1024-824" | "skein1024-832" | "skein1024-840" | "skein1024-848" | "skein1024-856" | "skein1024-864" | "skein1024-872" | "skein1024-880" | "skein1024-888" | "skein1024-896" | "skein1024-904" | "skein1024-912" | "skein1024-920" | "skein1024-928" | "skein1024-936" | "skein1024-944" | "skein1024-952" | "skein1024-960" | "skein1024-968" | "skein1024-976" | "skein1024-984" | "skein1024-992" | "skein1024-1000" | "skein1024-1008" | "skein1024-1016" | "skein1024-1024" | "poseidon-bls12_381-a2-fc1" | "poseidon-bls12_381-a2-fc1-sc" | "zeroxcert-imprint-256" | "fil-commitment-unsealed" | "fil-commitment-sealed" | "holochain-adr-v0" | "holochain-adr-v1" | "holochain-key-v0" | "holochain-key-v1" | "holochain-sig-v0" | "holochain-sig-v1" | "skynet-ns";
type SerializedCID = {
    codec: string;
    version: number;
    hash: Uint8Array;
};
declare const codecs: Readonly<Record<import("multicodec/src/generated-types").CodecName, import("multicodec/src/generated-types").CodecCode>>;
type BaseNameOrCode = "base58btc" | "identity" | "\0" | "0" | "7" | "9" | "f" | "F" | "v" | "V" | "t" | "T" | "b" | "B" | "c" | "C" | "h" | "k" | "K" | "z" | "Z" | "m" | "M" | "u" | "U" | "base2" | "base8" | "base10" | "base16" | "base16upper" | "base32hex" | "base32hexupper" | "base32hexpad" | "base32hexpadupper" | "base32" | "base32upper" | "base32pad" | "base32padupper" | "base32z" | "base36" | "base36upper" | "base58flickr" | "base64" | "base64pad" | "base64url" | "base64urlpad";
type CodecCode = 0 | 1 | 2 | 3 | 4 | 6 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 33 | 34 | 35 | 41 | 42 | 47 | 48 | 49 | 50 | 51 | 53 | 54 | 55 | 56 | 80 | 81 | 85 | 86 | 96 | 99 | 112 | 113 | 114 | 120 | 123 | 124 | 129 | 130 | 131 | 132 | 133 | 134 | 144 | 145 | 146 | 147 | 148 | 149 | 150 | 151 | 152 | 176 | 177 | 178 | 192 | 193 | 206 | 208 | 209 | 212 | 213 | 214 | 224 | 225 | 226 | 227 | 228 | 229 | 230 | 231 | 234 | 235 | 236 | 237 | 238 | 240 | 241 | 250 | 251 | 273 | 275 | 276 | 277 | 290 | 297 | 301 | 302 | 400 | 406 | 421 | 443 | 444 | 445 | 446 | 447 | 448 | 460 | 477 | 478 | 479 | 480 | 512 | 513 | 769 | 4114 | 4178 | 4179 | 4180 | 4181 | 4352 | 4608 | 4609 | 4610 | 4611 | 4612 | 4864 | 7425 | 21325 | 45569 | 45570 | 45571 | 45572 | 45573 | 45574 | 45575 | 45576 | 45577 | 45578 | 45579 | 45580 | 45581 | 45582 | 45583 | 45584 | 45585 | 45586 | 45587 | 45588 | 45589 | 45590 | 45591 | 45592 | 45593 | 45594 | 45595 | 45596 | 45597 | 45598 | 45599 | 45600 | 45601 | 45602 | 45603 | 45604 | 45605 | 45606 | 45607 | 45608 | 45609 | 45610 | 45611 | 45612 | 45613 | 45614 | 45615 | 45616 | 45617 | 45618 | 45619 | 45620 | 45621 | 45622 | 45623 | 45624 | 45625 | 45626 | 45627 | 45628 | 45629 | 45630 | 45631 | 45632 | 45633 | 45634 | 45635 | 45636 | 45637 | 45638 | 45639 | 45640 | 45641 | 45642 | 45643 | 45644 | 45645 | 45646 | 45647 | 45648 | 45649 | 45650 | 45651 | 45652 | 45653 | 45654 | 45655 | 45656 | 45657 | 45658 | 45659 | 45660 | 45661 | 45662 | 45663 | 45664 | 45825 | 45826 | 45827 | 45828 | 45829 | 45830 | 45831 | 45832 | 45833 | 45834 | 45835 | 45836 | 45837 | 45838 | 45839 | 45840 | 45841 | 45842 | 45843 | 45844 | 45845 | 45846 | 45847 | 45848 | 45849 | 45850 | 45851 | 45852 | 45853 | 45854 | 45855 | 45856 | 45857 | 45858 | 45859 | 45860 | 45861 | 45862 | 45863 | 45864 | 45865 | 45866 | 45867 | 45868 | 45869 | 45870 | 45871 | 45872 | 45873 | 45874 | 45875 | 45876 | 45877 | 45878 | 45879 | 45880 | 45881 | 45882 | 45883 | 45884 | 45885 | 45886 | 45887 | 45888 | 45889 | 45890 | 45891 | 45892 | 45893 | 45894 | 45895 | 45896 | 45897 | 45898 | 45899 | 45900 | 45901 | 45902 | 45903 | 45904 | 45905 | 45906 | 45907 | 45908 | 45909 | 45910 | 45911 | 45912 | 45913 | 45914 | 45915 | 45916 | 45917 | 45918 | 45919 | 45920 | 45921 | 45922 | 45923 | 45924 | 45925 | 45926 | 45927 | 45928 | 45929 | 45930 | 45931 | 45932 | 45933 | 45934 | 45935 | 45936 | 45937 | 45938 | 45939 | 45940 | 45941 | 45942 | 45943 | 45944 | 45945 | 45946 | 45947 | 45948 | 45949 | 45950 | 45951 | 45952 | 45953 | 45954 | 45955 | 45956 | 45957 | 45958 | 45959 | 45960 | 45961 | 45962 | 45963 | 45964 | 45965 | 45966 | 45967 | 45968 | 45969 | 45970 | 45971 | 45972 | 45973 | 45974 | 45975 | 45976 | 45977 | 45978 | 45979 | 45980 | 45981 | 45982 | 45983 | 45984 | 45985 | 45986 | 45987 | 45988 | 45989 | 45990 | 45991 | 45992 | 45993 | 45994 | 45995 | 45996 | 45997 | 45998 | 45999 | 46000 | 46001 | 46002 | 46003 | 46004 | 46005 | 46006 | 46007 | 46008 | 46009 | 46010 | 46011 | 46012 | 46013 | 46014 | 46015 | 46016 | 46017 | 46018 | 46019 | 46020 | 46021 | 46022 | 46023 | 46024 | 46025 | 46026 | 46027 | 46028 | 46029 | 46030 | 46031 | 46032 | 46033 | 46034 | 46035 | 46036 | 46037 | 46038 | 46039 | 46040 | 46041 | 46042 | 46043 | 46044 | 46045 | 46046 | 46047 | 46048 | 46081 | 46082 | 52753 | 61697 | 61698 | 8417572 | 8483108 | 9728292 | 9793828 | 10645796 | 10711332 | 11639056;
//# sourceMappingURL=index.d.ts.map