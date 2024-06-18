import { createConfig, readContract } from '@wagmi/core';
import { isPromiseFulfilled } from 'sushi/validate';
import { publicWagmiConfig } from '@sushiswap/wagmi-config';
const config = createConfig(publicWagmiConfig);
export async function fetchBalances(args) {
    // const _balances = await readContracts({
    //   allowFailure: true,
    //   contracts: args.map(
    //     ({ token, user, chainId }) =>
    //       ({
    //         address: token as Address,
    //         functionName: 'balanceOf',
    //         args: [user as Address],
    //         chainId,
    //         abi: erc20ABI,
    //       } as const)
    //   ),
    // })
    const balances = await Promise.allSettled(args.map(({ token, user, chainId }) => readContract(config, {
        address: token,
        functionName: 'balanceOf',
        args: [user],
        chainId: chainId,
        abi: [
            {
                inputs: [
                    {
                        name: '_owner',
                        type: 'address',
                    },
                ],
                name: 'balanceOf',
                outputs: [
                    {
                        name: 'balance',
                        type: 'uint256',
                    },
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function',
            },
        ],
    }))).then((promiseSettledResults) => {
        if (!Array.isArray(promiseSettledResults)) {
            console.error('balance readContract failed');
            return [];
        }
        return promiseSettledResults.map((promiseSettledResult, i) => {
            return {
                ...args[i],
                value: isPromiseFulfilled(promiseSettledResult)
                    ? promiseSettledResult.value
                    : 0n,
            };
        });
    });
    return Object.fromEntries(balances.map((balance) => [
        `${balance.chainId}:${balance.token}`,
        balance.value.toString(),
    ]));
}
//# sourceMappingURL=wagmi.js.map