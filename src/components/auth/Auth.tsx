"use client";

import { getNonce, login } from '@/apis/auth.api';
import useDisconnectWallet from '@/hooks/useDisconnectWallet';
import useUserSocket from '@/hooks/useUserSocket';
import useWatchChain from '@/hooks/useWatchChain';
import useWalletStore from '@/stores/wallet.store';
import { signMessage } from '@wagmi/core';
import { useEffect } from 'react';
import { UserRejectedRequestError } from 'viem';
import { useAccount } from 'wagmi';
import { useNotification } from '../common/Notification';
import { getAuthUser } from '@/apis/users.api';

const getSignMessage = (nonce: string) => {
  return `Please sign this message to verify your address. Nonce: ${nonce}`;
};

const Auth = () => {
  const notification = useNotification()
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnectWallet();
  const [wallet, setWallet, isLogging, setAccessToken, setIsLogging, reset] =
    useWalletStore((state) => [
      state.wallet,
      state.setWallet,
      state.isLogging,
      state.setAccessToken,
      state.setIsLogging,
      state.reset
    ]);

  useWatchChain();
  useUserSocket();
  const loginWallet = async () => {
    if (!address) return;
    setIsLogging(true);
    try {
      const nonce = await getNonce(address);
      const signature = await signMessage({
        message: getSignMessage(nonce),
      });
      const data = await login({
        walletAddress: address,
        signature,
      });
      setWallet(data.wallet);
      setAccessToken(data.accessToken);
    } catch (error) {
      disconnect();
      let message = 'common:connect_error.default';
      if (error instanceof UserRejectedRequestError) {
        if (error.code === 4001) {
          message = 'common:connect_error.user_rejected';
        }
      }
      notification.error(message);
      console.error('Connect error: ', error);
    }
    setIsLogging(false);
  };

  useEffect(() => {
    console.log('wallet', wallet);
    const addressLowercase = address?.toLowerCase();

    const fetchWallet = async () => {
      try {
        const wallet = await getAuthUser();
        if (wallet.user.walletAddress === addressLowercase) {
          setAccessToken(wallet.accessToken);
          setWallet(wallet.user);
        } else {
          throw new Error('wallet is not same address');
        }
      } catch (error) {
        console.error('getAuthWallet Failed', error);
        loginWallet();
      }
    };

    if (isConnected && !wallet && !isLogging) {
      fetchWallet();
    } else if (
      !!wallet &&
      !!addressLowercase &&
      !isLogging &&
      wallet.walletAddress !== addressLowercase
    ) {
      // reset();
      loginWallet();
    }
  }, [isConnected, wallet, isLogging, address]);

  return null;
};

export default Auth;
