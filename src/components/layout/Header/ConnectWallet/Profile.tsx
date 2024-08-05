import Button from '@/components/common/Button';
import ShutdownIcon from '@/components/common/Icons/ShutdownIcon';
import UserIcon from '@/components/common/Icons/UserIcon';
import Popup from '@/components/common/Popup';
import useDisconnectWallet from '@/hooks/useDisconnectWallet';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useToggle from '@/hooks/useToggle';
import { walletLogos } from '@/web3/wallets';
import { useAccount } from 'wagmi';
import ShortAddress from './ShortAddress';
import DrawerWrapper from '@/components/common/Drawer';
import Link from 'next/link';

const Profile = () => {
  const isMobile = useIsMobile();
  const { connector } = useAccount();
  const { disconnect } = useDisconnectWallet();
  const handleDisconnect = () => {
    disconnect();
  };

  const { toggle, handleToggle } = useToggle();

  if (isMobile) {
    return <DrawerWrapper
      isOpen={toggle}
      handleOpenChange={handleToggle}
      title="Account"
      content={
        <>
          {/* <Button size="lg" className="flex gap-2 py-1 items-center mt-5">
            <UserIcon />
            <p className="text-typo-secondary text-body-14">User Information</p>
          </Button> */}
          <Button size="lg" className="flex gap-2 py-1 items-center w-full mt-4" onClick={handleDisconnect}>
            <ShutdownIcon />
            <p className="text-typo-secondary text-body-14">Disconnect</p>
          </Button>
        </>
      }
    >
      <div
        className="flex items-center justify-center rounded"
      >
        {connector ? (
          <img
            className="size-6"
            src={walletLogos[connector.name]}
            alt={connector.name}
          />
        ) : null}
      </div>
    </DrawerWrapper>;
  }

  return (
    <Popup
      isOpen={toggle}
      handleOnChangeStatus={handleToggle}
      align="center"
      content={
        <>
          {/* <Link href="/referral"><Button size="lg" variant="ghost" className="flex gap-2 px-3 py-1 items-center">
            <UserIcon />
            <p className="text-typo-secondary text-body-14">User Information</p>
          </Button></Link> */}
          <Button size="lg" variant="ghost" className="flex gap-2 px-3 py-1 items-center w-full" onClick={handleDisconnect}>
            <ShutdownIcon />
            <p className="text-typo-secondary text-body-14">Disconnect</p>
          </Button>
        </>
      }
      classContent="left-4"
    >
      <ShortAddress
        toggle={toggle}
      />
    </Popup>
  );
};

export default Profile;
