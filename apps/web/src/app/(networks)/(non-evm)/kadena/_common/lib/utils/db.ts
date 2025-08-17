// import { PrismaClient } from '@prisma/client';

// // Initialize Prisma client
// const prisma = new PrismaClient();

// // Interface for swap event data
// export interface SwapEventData {
//   blockHeight: number;
//   contractAddress: string;
//   token0: string;
//   token1: string;
//   amount0: string;
//   amount1: string;
//   sender: string;
//   recipient: string;
//   transactionHash?: string;
//   moduleName: string;
//   eventName: string;
// }

// // Save a swap event to the database
// export async function saveSwapEvent(eventData: SwapEventData) {
//   try {
//     const savedEvent = await prisma.kadenaSwapEvent.create({
//       data: eventData,
//     });

//     console.log(`Saved swap event to database: ${savedEvent.id}`);
//     return savedEvent;
//   } catch (error) {
//     console.error('Error saving swap event to database:', error);
//     throw error;
//   }
// }

// // Get all swap events
// export async function getAllSwapEvents() {
//   try {
//     return await prisma.kadenaSwapEvent.findMany({
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching swap events from database:', error);
//     throw error;
//   }
// }

// // Get swap events by contract address
// export async function getSwapEventsByContract(contractAddress: string) {
//   try {
//     return await prisma.kadenaSwapEvent.findMany({
//       where: {
//         contractAddress,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });
//   } catch (error) {
//     console.error(`Error fetching swap events for contract ${contractAddress}:`, error);
//     throw error;
//   }
// }

// // Get swap events by block height range
// export async function getSwapEventsByBlockRange(minBlock: number, maxBlock: number) {
//   try {
//     return await prisma.kadenaSwapEvent.findMany({
//       where: {
//         blockHeight: {
//           gte: minBlock,
//           lte: maxBlock,
//         },
//       },
//       orderBy: {
//         blockHeight: 'asc',
//       },
//     });
//   } catch (error) {
//     console.error(`Error fetching swap events for block range ${minBlock}-${maxBlock}:`, error);
//     throw error;
//   }
// }

// // Close the Prisma client when the application shuts down
// export async function closeDatabase() {
//   await prisma.$disconnect();
// }
