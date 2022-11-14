# Tines
Sushiswap multirouter

## Current features:

    - Supports Trident pools and Uniswap-style ConstantProduct pools
    - Supports Stargate bridging
    - Takes gas prices into account
    - Makes both Exact In and Exact Out multiroutes
    - Routes in the multiroute can be split or merged at arbitrary points

## Basics
The main idea of multirouting in Tines is:

    1. split input Tokens for several streams (up to 100 in the current implementation)
    2. make single route of each stream one by one using Dijkstra algorithm. Each stream changes pools' states on its way and this change should be taken into account during the next streams route
    3. merge all single routes back into one multiroute

Pros:

    - Single routing is much easier than multirouting
    - Almost all features can be supported:
        - Any kind of pools
        - Bridges
        - Metapools
        - Multitoken pools
        - Limit orders

Cons:

    - Routing many single routes is potentially resource consuming

How optimal is this approach

    Pretty much. Potentially, it finds the optimal multiroute, but with several caveats:

        - Transaction price = gas price. It is the most difficult part for optimization. It is difficult to predict when it starts to be profitable to use another pool in parallel with one that is already being used by multiroute. The absolute optimal decision for this task is almost impossible, as it is difficult to predict the gas consumption of a swap. Different pools with different tokens feed different quantities of gas in different conditions. So, Tines solves this task only approximately, and this is the first source of inoptimality. But rather a low one
        - Finite quantity of route streams. Tests show that using 100 streams makes multirouting about 0.01%-0.05% close to the optimal one, so it is a very good tradeoff between result optimality and time of processing
        - Pools imbalancing. Prices in pools that Tines uses for routing can be imbalanced. That means that there is an arbitrage opportunity. Real optimal multirouting MUST (by definition) use this opportunity, because it makes output higher. But Tines ignores such opportunities because:
            1. Really large imbalances are resolved by arbitrage bots, a regular user is unlikely to catch them
            2. Making full use of big imbalances necessitates the use of circular routes that are not supported by neigher on-chain routes (aka route processors).
            3. Small imbalances are edges with negative weights from the point of view of Dijkstra algorithm that is used by Tines for single routing. This algorithm doesn't find the optimal path in graphs that have edges with negative weights. So, such imbalances can be found and used in route occasionally, Tines doesn't guarantee finding and using all of them