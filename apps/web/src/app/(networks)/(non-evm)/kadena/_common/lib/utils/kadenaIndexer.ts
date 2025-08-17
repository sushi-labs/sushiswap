// import { createClient } from 'graphql-ws';
// import WebSocket from 'ws';

// // Kadena indexer GraphQL API endpoint
// const KADENA_INDEXER_URL = 'https://api.mainnet.kadindexer.io/v0/graphql';
// const KADENA_INDEXER_WS_URL = 'wss://api.mainnet.kadindexer.io/v0/graphql';

// // Create a GraphQL client for queries
// export const createKadenaIndexerClient = () => {
//   return {
//     query: async (query: string, variables = {}) => {
//       const response = await fetch(KADENA_INDEXER_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           query,
//           variables,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       return response.json();
//     },
//   };
// };

// // Create a WebSocket client for subscriptions
// export const createKadenaIndexerSubscriptionClient = () => {
//   // Create a WebSocket client
//   const client = createClient({
//     url: KADENA_INDEXER_WS_URL,
//     webSocketImpl: WebSocket,
//     connectionParams: {},
//     retryAttempts: 5,
//   });

//   return client;
// };

// // Example subscription function
// export const subscribeToSwapEvents = (onData: (data: any) => void) => {
//   const client = createKadenaIndexerSubscriptionClient();

//   // GraphQL subscription query
//   const subscriptionQuery = `
//     subscription {
//       kadena {
//         smartContractEvents(
//           filter: {
//             module: { name: "swap" }
//             name: "SWAP"
//           }
//         ) {
//           arguments {
//             argument
//             value
//           }
//           block {
//             height
//           }
//           smartContract {
//             address {
//               address
//             }
//           }
//         }
//       }
//     }
//   `;

//   // Subscribe to the events
//   const unsubscribe = client.subscribe(
//     {
//       query: subscriptionQuery,
//     },
//     {
//       next: (data) => onData(data),
//       error: (error) => console.error('Subscription error:', error),
//       complete: () => console.log('Subscription completed'),
//     }
//   );

//   return unsubscribe;
// };

// // Example usage:
// // const unsubscribe = subscribeToSwapEvents((data) => {
// //   console.log('Received swap event:', data);
// // });
// //
// // // To stop the subscription:
// // unsubscribe();
