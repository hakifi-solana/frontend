"use client";

import useAppStore from '@/stores/app.store';
import Modal from '../common/Modal';
import Wallets from './Wallets';
import { useIsMobile } from '@/hooks/useMediaQuery';

const ConnectWalletModal = () => {
  const { isOpenConnectWallet, toggleConnectWalletModal } = useAppStore();
  const handleCoseModal = () => toggleConnectWalletModal(false);
  const isMobile = useIsMobile();

  if (!isMobile) return (
    <Modal
      isOpen={isOpenConnectWallet}
      isMobileFullHeight
      modal={true}
      onRequestClose={handleCoseModal}
      className="text-title-24 text-typo-primary"
      title="Connect Wallet"
    >
      <Wallets closeModal={handleCoseModal} />
    </Modal>
  );
  return null;
};

export default ConnectWalletModal;
