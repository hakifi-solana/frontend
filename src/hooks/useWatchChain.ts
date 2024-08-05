import useAppStore from '@/stores/app.store';
import { useEffect } from 'react';
import { ConnectorData, useAccount } from 'wagmi';

const useWatchChain = () => {
    const { connector: activeConnector } = useAccount();
    const { toggleIsSupportChainModal } = useAppStore();
    const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
        if (account) {
            console.log("new account", account);
        } else if (chain) {
            console.log("new chain", chain);

            toggleIsSupportChainModal(chain.unsupported);

        }
    };
    useEffect(() => {

        if (activeConnector) {
            activeConnector.on("change", handleConnectorUpdate);
        }

        return () => activeConnector?.off("change", handleConnectorUpdate) as any;
    }, [activeConnector]);

};

export default useWatchChain;