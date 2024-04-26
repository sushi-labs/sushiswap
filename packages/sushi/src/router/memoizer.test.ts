import { describe, expect, it } from 'vitest'
import { memoizer } from './memoizer.js'
import fs from 'fs';

describe('Memoizer', async () => {
  it('should serialize, memoize, read from cache, deserialize', async () => {

    let didHitCacheOnce = false
    const testFn = (value1: any) => {
      didHitCacheOnce = !didHitCacheOnce
      return {
        ...value1,
        someOtherValue: 'some data'
      }
    }
    const testMemoizer = await memoizer.fn(testFn)

    const testValue = {
      bigint: 12345n,
      string: 'some text',
      number: 123,
      bool: true,
      obj: {
        prop: 'some prop'
      }
    }
    const noCacheHitReturnedValue = await testMemoizer(testValue)
    const cacheHitReturnedValue = await testMemoizer(testValue)
    const expectedReturnedValue = {
      bigint: 12345n,
      string: 'some text',
      number: 123,
      bool: true,
      obj: {
        prop: 'some prop'
      },
      someOtherValue: 'some data'
    }

    expect(didHitCacheOnce).toEqual(true);
    expect(noCacheHitReturnedValue).toStrictEqual(expectedReturnedValue)
    expect(cacheHitReturnedValue).toStrictEqual(expectedReturnedValue)

    // read cached file content
    const cacheFileContent = fs.readFileSync('./mem-cache/' + fs.readdirSync("./mem-cache")[0], { encoding: "utf-8" });
    const expectedCachedContent = 
      '{"data":{"bigint":"12345n","string":"some text","number":123,"bool":true,"obj":{"prop":"some prop"},"someOtherValue":"some data"}}'

    expect(cacheFileContent).toEqual(expectedCachedContent);
  })
})