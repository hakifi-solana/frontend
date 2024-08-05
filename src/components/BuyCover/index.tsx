"use client";

import { Insurance } from '@/@type/insurance.type';
import { MarketPair, PairDetail } from '@/@type/pair.type';
import useEventSocket from '@/hooks/useEventSocket';
import { useIsMobile } from '@/hooks/useMediaQuery';
import useInsuranceStore from '@/stores/insurance.store';
import useMarketStore from '@/stores/market.store';
import { cn } from '@/utils';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import Contract from './Contract';
import FavoritesLoader from './Loader/FavoritesLoader';
import InformationLoader from './Loader/InformationLoader';
import ChartLoader from './Loader/ChartLoader';

type BuyCoverProps = {
    symbol: string;
    pair: PairDetail;
    marketPairs: MarketPair[];
};

const Chart = dynamic(() => import('@/components/BuyCover/Chart'), {
    loading: () => <ChartLoader />,
    ssr: false,
});

const PlaceOrder = dynamic(() => import('@/components/BuyCover/PlaceOrder'), {
    // loading: () => <LoaderPlaceOrder className="mt-4" />,
    ssr: false,
});

const Favorites = dynamic(() => import('@/components/BuyCover/Favorites'), {
    loading: () => <FavoritesLoader />,
    ssr: false,
});

const Information = dynamic(() => import('@/components/BuyCover/Information'), {
    loading: () => <InformationLoader />,
    ssr: false,
});

const BuyCover = ({ symbol, pair, marketPairs }: BuyCoverProps) => {
    const setMarketPairs = useMarketStore(state => state.setMarketPairs);
    const { isConnected } = useAccount();
    const isMobile = useIsMobile();
    const [getInsuranceOpening, getInsuranceHistory] = useInsuranceStore(state => [
        state.getInsuranceOpening,
        state.getInsuranceHistory,
    ]);
    const getDataInsurances = useCallback(() => {
        getInsuranceOpening({ page: 1 });
        getInsuranceHistory({ page: 1 });
    }, []);
    useEffect(() => {
        setMarketPairs(marketPairs);
    }, [isConnected]);

    const [fullScreen, setFullScreen] = useState<boolean>(false);

    const handleFullScreenAction = (expand: boolean) => {
        setFullScreen(expand);
    };

    const [setInsuranceSelected] = useInsuranceStore(state => [
        state.setInsuranceSelected,
    ]);

    const cb = useCallback((data: Insurance) => {
        console.log("Insurance is modified", data);
        setInsuranceSelected(data);
        getDataInsurances();
    }, []);

    useEventSocket("insurance.created", cb);
    useEventSocket("insurance.updated", cb);

    return (
        <>
            {/* Hot pair */}
            <section className="bg-background-tertiary">
                <Favorites />
            </section>

            <section className="bg-background-tertiary flex flex-col sm:flex-row border-t border-divider-secondary">
                {/* Token information */}
                <section className={cn(!fullScreen ? "sm:w-9/12" : "w-full")}>
                    <section className="px-4">
                        <Information marketPairs={marketPairs} symbol={symbol} />
                    </section>
                    <Chart
                        symbol={symbol}
                        marketPairs={marketPairs}
                        fullScreen={fullScreen}
                        setFullScreen={handleFullScreenAction}
                    />
                    {!fullScreen && <Contract />}
                </section>
                {
                    !isMobile && !fullScreen &&
                    <section className="sm:w-3/12 min-w-[420px] px-4 sm:px-5 pt-4 pb-6 border-l border-divider-secondary">
                        <PlaceOrder symbol={symbol} pair={pair} />
                    </section>
                }
            </section>
            {
                isMobile && <PlaceOrder symbol={symbol} pair={pair} />
            }
        </>
    );
};

export default BuyCover;
