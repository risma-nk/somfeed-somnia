import { abi } from './abis.js';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const POST_FEE_ETH = "0.001";

export const contractConfig = {
  address: CONTRACT_ADDRESS as `0x${string}`,
  abi: abi,
};