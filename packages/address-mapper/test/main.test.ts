
import { describe, expect, test } from "vitest";
import { AddressMapper } from "../src/index.js";

const usdcList = {
    1: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    4: "0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4",
    3: "0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c"
}
const sushiList = {
    1: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    4: '0x0769fd68dfb93167989c6f7254cd0d766fb2841f',
    3: '0x0769fd68dfb93167989c6f7254cd0d766fb2841f',
}

const addressMapper: AddressMapper = new AddressMapper(usdcList, sushiList);

describe("AddressMapper", () => {
    test("when sushi kovan address is given, return eth and ropsten addresses", async () => {
        const expected = new Map([
            [1, "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2"],
            [4, "0x0769fd68dfb93167989c6f7254cd0d766fb2841f"],
        ])
        expect(addressMapper.getAddresses(3, "0x0769fd68dfb93167989c6f7254cd0d766fb2841f")).toEqual(expected)
    });

    test.each(
        [
            {
                chainId: 1, address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", filter: [3], expected: new Map([
                    [3, "0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c"],
                ])
            },
            {
                chainId: 3, address: "0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c", filter: [1, 4], expected: new Map([
                    [1, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
                    [4, "0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4"],
                ])
            },
            {
                chainId: 3, address: "0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c", filter: [1337], expected: new Map()
            },
        ])('only return addresses from networks: $filter', ({ chainId, address, filter, expected }) => {
            expect(addressMapper.getAddresses(chainId, address, filter)).toEqual(expected)
        })


    describe("Ignore lower case", () => {
        const testList = {
            1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            4: "0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4",
        }
        const mapper: AddressMapper = new AddressMapper(testList);

        test.each(
            [{
                address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
            }, {
                address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            }]
        )("when getAddresses() is called with $address, case sensitivity is ignored and result is returned", async ({ address }) => {
            expect(mapper.getAddresses(1, address)).toEqual(new Map([
                [4, "0x1717a0d5c8705ee89a8ad6e808268d6a826c97a4"],
            ]))
        })
    })
});