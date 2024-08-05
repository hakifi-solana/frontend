import useWalletStore from '@/stores/wallet.store';
import { disableAutoConnect } from '@/web3/utils';
import { useDisconnect } from 'wagmi';

const useDisconnectWallet = () => {
    const [reset] = useWalletStore((state) => [state.reset]);

    const config = useDisconnect({
        onSuccess: () => {
            disableAutoConnect();
            config.reset();
            reset();
        },
    });
    return config;
};

export default useDisconnectWallet;
