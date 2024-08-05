import { Address } from 'viem';

export type Wallet = {
  createdAt: string;
  defaultMyRefCode: string;
  email: string;
  hierarchy: null | string;
  id: string;
  nonce: null | string;
  phoneNumber: string;
  refCode: null | string;
  updatedAt: string;
  username: string;
  walletAddress: Address;
  level?: number;
  isPartner?: boolean;
};

export type User = {
  accessToken: string;
  user: Wallet;
};
