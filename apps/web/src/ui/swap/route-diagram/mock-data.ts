import { Route } from "./types";

function convertMockResponseToRoute(mockResponse: any): Route {
    const result =  {
        fills: mockResponse.route.fills.map((fill: any) => {
            return {
                from: fill.from,
                to: fill.to,
                source: fill.source,
                proportionBps: Number(fill.proportionBps),
            };
        }),
        tokens: mockResponse.route.tokens
    } satisfies Route;
    return result
}

const mockResponse1: any = {
    "route": {
        "fills": [
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "0x_RFQ",
                "proportionBps": "83"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "0x_RFQ",
                "proportionBps": "832"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "Uniswap_V3",
                "proportionBps": "249"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "Uniswap_V3",
                "proportionBps": "250"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "0x_RFQ",
                "proportionBps": "1833"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "0x_RFQ",
                "proportionBps": "249"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "0x_RFQ",
                "proportionBps": "1166"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V3",
                "proportionBps": "249"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V3",
                "proportionBps": "249"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V3",
                "proportionBps": "1666"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V2",
                "proportionBps": "250"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "0x_RFQ",
                "proportionBps": "1166"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "0x_RFQ",
                "proportionBps": "250"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "0x_RFQ",
                "proportionBps": "83"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "0x_RFQ",
                "proportionBps": "416"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V3",
                "proportionBps": "500"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V3",
                "proportionBps": "250"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V2",
                "proportionBps": "251"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "source": "0x_RFQ",
                "proportionBps": "71"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V3",
                "proportionBps": "888"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V3",
                "proportionBps": "456"
            },
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "source": "Maker_PSM",
                "proportionBps": "6554"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "source": "0x_RFQ",
                "proportionBps": "400"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "source": "Curve",
                "proportionBps": "2744"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "source": "Synapse",
                "proportionBps": "229"
            }
        ],
        "tokens": [
            {
                "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "symbol": "WETH"
            },
            {
                "address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "symbol": "WBTC"
            },
            {
                "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "symbol": "USDC"
            },
            {
                "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "symbol": "USDT"
            },
            {
                "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "symbol": "DAI"
            }
        ]
    },

};

const MockResponse2 = {
    "route": {
        "fills": [
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "0x_RFQ",
                "proportionBps": "83"
            },
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "Uniswap_V3",
                "proportionBps": "750"
            },
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "source": "Maker_PSM",
                "proportionBps": "4083"
            },
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "0x_RFQ",
                "proportionBps": "1833"
            },
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "0x_RFQ",
                "proportionBps": "500"
            },
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V3",
                "proportionBps": "250"
            },
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V3",
                "proportionBps": "250"
            },
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V3",
                "proportionBps": "2000"
            },
            {
                "from": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V2",
                "proportionBps": "251"
            },
            {
                "from": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "0x_RFQ",
                "proportionBps": "756"
            },
            {
                "from": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Curve",
                "proportionBps": "3100"
            },
            {
                "from": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Synapse",
                "proportionBps": "227"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "Uniswap_V3",
                "proportionBps": "227"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "0x_RFQ",
                "proportionBps": "85"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "0x_RFQ",
                "proportionBps": "1166"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "0x_RFQ",
                "proportionBps": "398"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V3",
                "proportionBps": "227"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V3",
                "proportionBps": "455"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V3",
                "proportionBps": "227"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V2",
                "proportionBps": "312"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "PancakeSwap_V3",
                "proportionBps": "228"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V3",
                "proportionBps": "1144"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "source": "Uniswap_V3",
                "proportionBps": "672"
            }
        ],
        "tokens": [
            {
                "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "symbol": "USDC"
            },
            {
                "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "symbol": "DAI"
            },
            {
                "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "symbol": "USDT"
            },
            {
                "address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "symbol": "WBTC"
            },
            {
                "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "symbol": "WETH"
            }
        ]
    },

}

const mockResponse3 = {
    "route": {
        "fills": [
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "0x_RFQ",
                "proportionBps": "166"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "Uniswap_V3",
                "proportionBps": "2249"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "source": "Uniswap_V3",
                "proportionBps": "250"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "0x_RFQ",
                "proportionBps": "750"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V3",
                "proportionBps": "499"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V3",
                "proportionBps": "249"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V3",
                "proportionBps": "3500"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V2",
                "proportionBps": "250"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "0x_RFQ",
                "proportionBps": "83"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V3",
                "proportionBps": "250"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V3",
                "proportionBps": "750"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V3",
                "proportionBps": "250"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V2",
                "proportionBps": "500"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "PancakeSwap_V3",
                "proportionBps": "251"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "source": "0x_RFQ",
                "proportionBps": "137"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "0x_RFQ",
                "proportionBps": "45"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "0x_RFQ",
                "proportionBps": "367"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V3",
                "proportionBps": "988"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "0x_RFQ",
                "proportionBps": "667"
            },
            {
                "from": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V3",
                "proportionBps": "460"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "source": "Curve",
                "proportionBps": "3211"
            },
            {
                "from": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Maker_PSM",
                "proportionBps": "3348"
            }
        ],
        "tokens": [
            {
                "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "symbol": "WETH"
            },
            {
                "address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
                "symbol": "WBTC"
            },
            {
                "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "symbol": "USDT"
            },
            {
                "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "symbol": "DAI"
            },
            {
                "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "symbol": "USDC"
            }
        ]
    },
}

const mockResponse4 = {
    "route": {
        "fills": [
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "0x_RFQ",
                "proportionBps": "6250"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Uniswap_V3",
                "proportionBps": "1500"
            },
            {
                "from": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "to": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "source": "Uniswap_V3",
                "proportionBps": "2250"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "source": "0x_RFQ",
                "proportionBps": "1815"
            },
            {
                "from": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "0x_RFQ",
                "proportionBps": "435"
            },
            {
                "from": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "to": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "source": "Maker_PSM",
                "proportionBps": "1815"
            }
        ],
        "tokens": [
            {
                "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "symbol": "WETH"
            },
            {
                "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "symbol": "USDT"
            },
            {
                "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
                "symbol": "DAI"
            },
            {
                "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                "symbol": "USDC"
            }
        ]
    },
}

export const mockedRoutes: Route[] = [
    convertMockResponseToRoute(mockResponse1),
    convertMockResponseToRoute(MockResponse2),
    convertMockResponseToRoute(mockResponse3),
    convertMockResponseToRoute(mockResponse4)
]