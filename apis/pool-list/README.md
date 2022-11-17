# Pool API

## v0

### api/pool-list/v0/<CHAIN_ID>

?tokens=0x00,0x001,0x002

```json
{
  "0x00DAI00": {
    "QuickSwap": {
      "V2": {
        "CONSTANT_PRODUCT_POOL": ["0x00pool0", "0x00pool1"]
      }
    },
    "SushiSwap": {
      "legacy": {
        "CONSTANT_PRODUCT_POOL": ["0x00pool2", "0x00pool3"]
      },
      "trident": {
        "CONSTANT_PRODUCT_POOL": ["0x00pool4", "0x00pool5"],
        "STABLE_POOL": ["0x00pool6", "0x00pool7"]
      }
    }
  },

  "0x00WETH00": {
    // ..
  },

  "0x00SUSHI00": {
    // ..
  }
}
```
