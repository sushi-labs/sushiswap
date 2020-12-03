# Overview

This page explains everything you need to know about the SushiSwap Subgraph. The SushiSwap Subgraph listens for events from one or more data sources \(Smart Contracts\) on the Ethereum Blockchain. It handles indexing and caching of data which can later be queried using an exposed GraphQL API, providing an excellent developer experience.

### The Graph

The SushiSwap Subgraph is powered by [The Graph](https://thegraph.com).

> The Graph is a protocol for building decentralized applications \(dApps\) quickly on Ethereum and IPFS using GraphQL.

### Data Sources

MasterChef - 0xc2edad668740f1aa35e4d8f227fb8e17dca888cd

Factory - 0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac

### Resources

[SushiSwap Subgraph Explorer](https://thegraph.com/explorer/subgraph/zippoxer/sushiswap-subgraph-fork)

[SushiSwap Subgraph Source](https://github.com/sushiswap/sushiswap-subgraph)

[The Graph](https://thegraph.com/docs/introduction)

[GraphQL](https://graphql.org)

### Caveats

{% hint style="danger" %}
The SushiSwap Subgraph is not intended to be used as a data source for structuring transactions \(contracts should be referenced directly for the most reliable live data\).
{% endhint %}

