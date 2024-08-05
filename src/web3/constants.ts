import { Address } from 'viem';

export const VNST_ADDRESS: Address = process.env
  .NEXT_PUBLIC_VNST_ADDRESS as Address;

export const USDT_ADDRESS: Address = process.env
  .NEXT_PUBLIC_USDT_ADDRESS as Address;

export const INSURANCE_ADDRESS: Address = process.env
  .NEXT_PUBLIC_INSURANCE_ADDRESS as Address;
export const SCILABS_ADDRESS: Address = process.env.NEXT_PUBLIC_SCI_FUND_ADDRESS as Address
export const isMainnet = process.env.NEXT_PUBLIC_IS_MAINNET === 'true';

export const RATE_DECIMAL = 6;

export const VNST_DECIMAL = 18;

export const DISABLED_AUTO_CONNECT_KEY = 'disabled_auto_connect';
