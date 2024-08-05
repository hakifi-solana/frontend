import Checkbox from '@/components/common/Checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/common/Tabs';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useInsuranceStore from '@/stores/insurance.store';
import { cn } from '@/utils';
import { ORDER_LIST_MODE } from '@/utils/constant';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import ContractLoader from '../Loader/ContractLoader';
import Image from 'next/image';
import useAppStore from '@/stores/app.store';

const DetailInsuranceModal = dynamic(() => import('@/components/BuyCover/Contract/Detail'),
    { ssr: false }
);

const CloseContract = dynamic(() => import('@/components/BuyCover/Contract/CloseContract'),
    { ssr: false }
);

const TabHistory = dynamic(() => import('@/components/BuyCover/Contract/TabHistory'), {
    loading: () => <ContractLoader />,
    ssr: false
});
const TabOpening = dynamic(() => import('@/components/BuyCover/Contract/TabOpening'), {
    loading: () => <ContractLoader />,
    ssr: false
});

const Contract = () => {
    const { isConnected, address } = useAccount();
    const isMobile = useIsMobile();
    const [currentTab, setCurrentTab] = useState(ORDER_LIST_MODE.OPENING);
    const handleChangeTab = (tab: string) => {
        setCurrentTab(tab);
    };
    const [hide, setHide] = useState(false);
    const handleHideOtherPair = (checked: boolean) => {
        setHideOtherSymbol();
        setHide(checked);
    };
    const [getInsuranceOpening, getInsuranceHistory, setHideOtherSymbol, totalOpening, totalHistory] = useInsuranceStore(state => [
        state.getInsuranceOpening,
        state.getInsuranceHistory,
        state.setHideOtherSymbol,
        state.totalOpening,
        state.totalHistory
    ]);
    const getDataInsurances = useCallback(() => {
        getInsuranceOpening({ page: 1 });
        getInsuranceHistory({ page: 1 });
    }, []);

    useEffect(() => {
        if (isConnected && address) getDataInsurances();
    }, [currentTab, isConnected, address]);

    const toggleConnectWalletModal = useAppStore(
        (state) => state.toggleConnectWalletModal,
    );

    return (
        <>
            <section
                data-tour="tab-covered"
                className={cn(
                    "flex items-center justify-between flex-wrap border-b border-divider-secondary px-5",
                    isMobile && "mx-4 px-0"
                )}>
                <Tabs
                    defaultValue={ORDER_LIST_MODE.OPENING}
                    className="pt-4"
                    onValueChange={handleChangeTab}
                    activationMode="automatic">
                    <TabsList className="flex items-center gap-5">
                        <TabsTrigger
                            value={ORDER_LIST_MODE.OPENING}
                            className={cn(
                                "text-tab-14 data-[state=inactive]:text-typo-secondary data-[state=active]:text-typo-accent pb-4 data-[state=active]:border-b data-[state=active]:border-typo-accent w-fit",
                            )}>
                            CONTRACT LIST
                        </TabsTrigger>
                        <TabsTrigger
                            value={ORDER_LIST_MODE.HISTORY}
                            className={cn(
                                "text-tab-14 data-[state=inactive]:text-typo-secondary data-[state=active]:text-typo-accent pb-4 data-[state=active]:border-b data-[state=active]:border-typo-accent w-fit",
                            )}>
                            CONTRACT HISTORY
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {
                    !isMobile && <div className="flex items-center space-x-2 mt-4 md:mt-0 py-1">
                        <Checkbox size="md" label="Hide other pairs" checked={hide} onChange={(event) => handleHideOtherPair(event.target.checked)} />
                    </div>
                }
            </section>
            {
                isMobile && <div className="flex items-center px-4 mt-5">
                    <Checkbox size="md" label="Hide other pairs" checked={hide} onChange={(event) => handleHideOtherPair(event.target.checked)} />
                </div>
            }

            {
                !address ?
                    <section className="flex flex-col items-center justify-center min-h-[300px] gap-2">
                        <Image
                            width={124}
                            height={124}
                            quality={100}
                            src="/assets/images/icons/connect_wallet_icon.png"
                            alt="No data"
                        />
                        <section className="text-center text-typo-secondary">
                            Please <span className="text-typo-accent cursor-pointer" onClick={() => toggleConnectWalletModal(true)}>Connect wallet</span> to be able to use the feature
                        </section>
                    </section>
                    :
                    currentTab === ORDER_LIST_MODE.OPENING ? (
                        totalOpening > 0 ? <TabOpening key={ORDER_LIST_MODE.OPENING} /> :
                            <EmptyContract />
                    ) : (
                        totalHistory > 0 ? <TabHistory key={ORDER_LIST_MODE.HISTORY} /> :
                            <EmptyContract />
                    )
            }

            <DetailInsuranceModal />
            <CloseContract />
        </>
    );
};


const EmptyContract = () => {
    return <section className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Image
            width={124}
            height={124}
            quality={100}
            src="/assets/images/icons/noData_icon.png"
            alt="No data"
        />
        <section className="text-center text-typo-secondary">
            <p>
                You haven't added any contract yet.
            </p>
            <p>
                Start now by create a new Buy cover contract.
            </p>
        </section>
    </section>;
};

export default Contract;