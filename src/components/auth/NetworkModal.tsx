"use client";

import Modal from '@/components/common/Modal';
import useDisconnectWallet from '@/hooks/useDisconnectWallet';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useAppStore from '@/stores/app.store';
import { cn } from '@/utils';
import { mainChain } from '@/web3/wagmiConfig';
import { Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useSwitchNetwork } from 'wagmi';
import Button from '../common/Button';
import DrawerWrapper from '../common/Drawer';
import NotificationErrorIcon from '../common/Icons/NotificationErrorIcon';

const NetworkModal = () => {
    const { isSupportChain, toggleIsSupportChainModal } = useAppStore();
    const closeModal = () => toggleIsSupportChainModal(false);
    const { disconnect } = useDisconnectWallet();
    const { switchNetworkAsync } = useSwitchNetwork();
    const [loading, setLoading] = useState(false);
    const changeChain = useCallback(async () => {
        try {
            setLoading(true);
            await switchNetworkAsync?.(mainChain.id);
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setLoading(false);
        }

    }, [loading]);

    const isMobile = useIsMobile();

    if (isMobile) {
        return <DrawerWrapper
            isOpen={isSupportChain}
            handleOpenChange={closeModal}
            classNameTitle="!text-title-24 text-typo-primary"
            content={
                <section className="flex flex-col justify-center items-center p-4 pt-0">
                    <NotificationErrorIcon />
                    <div className="text-title-24 text-typo-primary mt-5">
                        Connect Failed
                    </div>

                    <div className="text-body-14 text-typo-secondary mt-3 text-center">
                        Hakifi is only supported on BNB Smart Chain.
                        Please switch Networks in your Wallet to continue
                        using the product.
                    </div>

                    {
                        !loading ? <section className="mt-8 flex items-center gap-4 flex-wrap flex-col w-full">
                            <Button size="lg" onClick={() => disconnect()} variant="primary" className="w-full flex justify-center">
                                Disconnect
                            </Button>
                            <Button size="lg" onClick={changeChain} variant="outline" className=" w-full flex justify-center">
                                Switch network
                            </Button>
                        </section> :
                            <Loader2 className="mt-8 animate-spin text-typo-primary h-24" />
                    }
                </section>
            }
        >
        </DrawerWrapper>;
    }

    return (
        <Modal
            isOpen={isSupportChain}
            onRequestClose={closeModal}
            isMobileFullHeight={false}
            className="text-primary-3"
            onInteractOutside={(e) => {
                e.preventDefault();
            }}
            modal={true}
            contentClassName={cn("z-[52]")}
            overlayClassName={cn("z-[51]")}
        >
            <section className="flex flex-col justify-center items-center">
                <NotificationErrorIcon />
                <div className="text-title-24 text-typo-primary mt-5">
                    Connect Failed
                </div>

                <div className="text-body-16 text-typo-secondary mt-3 text-center">
                    Hakifi is only supported on BNB Smart Chain.
                    Please switch Networks in your Wallet to continue
                    using the product.
                </div>
                {
                    !loading ? <section className="mt-8 flex items-center gap-4 flex-wrap flex-col w-full">
                        <Button size="lg" onClick={() => disconnect()} variant="primary" className="w-full flex justify-center">
                            Disconnect
                        </Button>
                        <Button size="lg" onClick={changeChain} variant="outline" className=" w-full flex justify-center">
                            Switch network
                        </Button>
                    </section> :
                        <Loader2 className="mt-8 animate-spin text-typo-primary h-24" />
                }
            </section>
        </Modal>
    );
};

export default NetworkModal;