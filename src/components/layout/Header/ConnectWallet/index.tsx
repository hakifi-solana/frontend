"use client";

import { useIsMobile } from '@/hooks/useMediaQuery';
import useAppStore from '@/stores/app.store';
import { useAccount } from 'wagmi';
// import Profile from './Profile';
import Wallets from '@/components/ConnectWalletModal/Wallets';
import Button from '@/components/common/Button';
import DrawerWrapper from '@/components/common/Drawer';
import { cn } from '@/utils';
import { forwardRef } from 'react';
import Profile from './Profile';

type ConnectWalletProps = {
    className?: string;
    onClick?: () => void;
};

const ConnectWallet = forwardRef<HTMLButtonElement, ConnectWalletProps>(({
    className,
    onClick,
}, forwardRef) => {
    const isMobile = useIsMobile();
    const { isOpenConnectWallet, toggleConnectWalletModal } = useAppStore();
    const handleCloseModal = () => toggleConnectWalletModal(!isOpenConnectWallet);
    const { isConnected } = useAccount();

    if (isConnected) {
        // if (isTablet) return null;
        return <Profile />;
    }

    const onClickButton = () => {
        toggleConnectWalletModal(true);
        onClick?.();
    };

    if (isMobile) {
        return <DrawerWrapper
            isOpen={isOpenConnectWallet}
            handleOpenChange={handleCloseModal}
            classNameTitle="!text-title-24 text-typo-primary"
            title="Connect Wallet"
            content={
                <section className="pt-5">
                    <Wallets closeModal={handleCloseModal} />
                </section>
            }
        >
            <Button
                ref={forwardRef}
                size="lg"
                variant="primary"
                className={cn('px-6 py-2', className)}
            >
                Connect Wallet
            </Button>
        </DrawerWrapper>;
    }

    return (
        <>
            <Button
                size="lg"
                onClick={onClickButton}
                variant="primary"
                className={cn('px-6 py-2', className)}
            >
                Connect Wallet
            </Button>
        </>
    );
});

export default ConnectWallet;
