import { erc20Abi as defaulterc20Abi } from "viem";

export const erc20Abi = [
  ...defaulterc20Abi,
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [],
  },
] as const;
