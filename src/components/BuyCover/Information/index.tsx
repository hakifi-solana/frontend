"use client";

import { MarketPair } from "@/@type/pair.type";
import Button from "@/components/common/Button";
import InformationIcon from "@/components/common/Icons/InformationIcon";
import Popup from "@/components/common/Popup";
import { Skeleton } from "@/components/common/Skeleton";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { Ticker, useTickerSocket } from "@/hooks/useTickerSocket";
import useToggle from "@/hooks/useToggle";
import useAppStore from "@/stores/app.store";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useCallback, useMemo, useState } from "react";
import ButtonPairsWrapper from "./ButtonPairsWrapper";

type InformationProps = {
    marketPairs: MarketPair[];
    symbol: string;
};

const Terminology = dynamic(() => import('@/components/BuyCover/Information/Terminology'), { ssr: false });

const Information = ({ marketPairs, symbol }: InformationProps) => {
    const isMobile = useIsMobile();
    const [ticker, setTicker] = useState<Ticker | null>(null);
    useTickerSocket(symbol, setTicker);
    const value: number = Number(ticker?.lastPrice) ?? 0;

    const priceChangePercent = useMemo(
        () => ticker?.priceChangePercent,
        [ticker],
    );
    const negative = useMemo(
        () => (priceChangePercent || 0) < 0,
        [priceChangePercent],
    );

    const highPrice = useMemo(
        () => ticker?.highPrice,
        [ticker],
    );
    const lowPrice = useMemo(
        () => ticker?.lowPrice,
        [ticker],
    );
    const [setStartOnboard] = useAppStore(state => [state.setStartOnboard]);
    const handleOnboard = () => {
        handleToggle()
        if (setStartOnboard) setStartOnboard(true);
    };
    const { toggle, handleToggle } = useToggle();

    const [openTerminologyModal, setOpenTerminologyModal] = useState(false);
    const handleToggleTerminologyModal = useCallback(() => {
        handleToggle()
        setOpenTerminologyModal(pre => !pre);
    }, []);

    return <>
        <section className="py-3 flex items-center justify-between w-full">
            {!isMobile ?
                <section className="flex items-center gap-10">

                    <ButtonPairsWrapper symbol={symbol as string} marketPairs={marketPairs} />

                    <section className="hidden sm:flex h-full items-center gap-10">
                        {
                            value ? <div className="text-title-24 text-typo-primary min-w-[100px] max-w-[160px]">{value}</div> : <Skeleton className="h-6 w-40" />
                        }

                        <div className="flex flex-col">
                            <div className="text-body-12 text-typo-secondary whitespace-nowrap">24h Change</div>
                            {priceChangePercent ?
                                <div className={cn("flex-1 !text-body-14 text-left", !negative ? "text-positive" : "text-negative",)}>
                                    {negative ? "-" : "+"}
                                    {priceChangePercent
                                        ? formatNumber(Math.abs(priceChangePercent), 2)
                                        : "-"}
                                    %
                                </div> :
                                <Skeleton className="h-5 w-[65px]" />
                            }
                        </div>
                        <div className="flex flex-col">
                            <div className="text-body-12 text-typo-secondary whitespace-nowrap">24h High</div>
                            {highPrice ?
                                <div className={cn("flex-1 !text-body-14 text-left text-typo-primary",)}>
                                    {
                                        formatNumber(highPrice, 2)
                                    }
                                </div> :
                                <Skeleton className="h-5 w-[65px]" />
                            }
                        </div>
                        <div className="flex flex-col">
                            <div className="text-body-12 text-typo-secondary whitespace-nowrap">24h Low</div>
                            {lowPrice ?
                                <div className={cn("flex-1 !text-body-14 text-left text-typo-primary",)}>
                                    {
                                        formatNumber(lowPrice, 2)
                                    }
                                </div> :
                                <Skeleton className="h-5 w-[65px]" />
                            }
                        </div>

                    </section>
                </section>
                :
                <section className="flex items-start justify-between w-full">
                    <ButtonPairsWrapper symbol={symbol as string} marketPairs={marketPairs} />

                    <section className="flex flex-col gap-3">
                        <div className="flex items-center gap-8">
                            <div className="text-body-12 text-typo-secondary w-14">24h High</div>
                            {highPrice ?
                                <div className="flex-1 text-body-12 text-left text-typo-primary">
                                    {
                                        formatNumber(highPrice, 2)
                                    }
                                </div> :
                                <Skeleton className="h-4 w-[65px]" />
                            }
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-body-12 text-typo-secondary w-14">24h Low</div>
                            {lowPrice ?
                                <div className="flex-1 text-body-12 text-left text-typo-primary">
                                    {
                                        formatNumber(lowPrice, 2)
                                    }
                                </div> :
                                <Skeleton className="h-4 w-[65px]" />
                            }
                        </div>
                    </section>

                </section>
            }

            {
                !isMobile && <Popup
                    classContent="max-w-[180px]"
                    isOpen={toggle}
                    handleOnChangeStatus={handleToggle}
                    content={
                        <section className="flex flex-col items-start text-typo-secondary">
                            <Button size="md" onClick={handleOnboard} className="flex items-center hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full ">
                                Onboard now
                            </Button>
                            <Link href={`https://docs.namiinsurance.io/tutorial/how-to-buy-nami-insurance`} target="_blank" className="hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full  text-body-14">
                                How to buy cover
                            </Link>
                            <Button size="md" onClick={handleToggleTerminologyModal} className="flex items-center hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full ">
                                Detail terminology
                            </Button>
                        </section>
                    }
                >

                    <Button size="md" className="flex items-center gap-1">
                        Guidelines
                        <InformationIcon />
                    </Button>
                </Popup>
            }
        </section>

        {
            isMobile ? <section className="flex items-end justify-between py-2 border-b border-divider-secondary">
                <section className="flex items-end">
                    {
                        value ? <div className="text-title-24 text-typo-primary min-w-[100px] max-w-[160px]">{value}</div> : <Skeleton className="h-6 w-40" />
                    }
                    {priceChangePercent ?
                        <div className={cn("flex-1 !text-body-14 text-left", !negative ? "text-positive" : "text-negative",)}>
                            {negative ? "-" : "+"}
                            {priceChangePercent
                                ? formatNumber(Math.abs(priceChangePercent), 2)
                                : "-"}
                            %
                        </div> :
                        <Skeleton className="h-5 w-[65px]" />
                    }
                </section>
                <Popup
                    classContent="max-w-[180px]"
                    isOpen={toggle}
                    handleOnChangeStatus={handleToggle}
                    content={
                        <section className="flex flex-col items-start text-typo-secondary">
                            <Button size="md" onClick={handleOnboard} className="flex items-center hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full ">
                                Onboard now
                            </Button>
                            <Link href={`https://docs.namiinsurance.io/tutorial/how-to-buy-nami-insurance`} target="_blank" className="hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full  text-body-14">
                                How to buy cover
                            </Link>
                            <Button size="md" onClick={handleToggleTerminologyModal} className="flex items-center hover:text-typo-accent hover:bg-background-secondary py-2 px-3 w-full ">
                                Detail terminology
                            </Button>
                        </section>
                    }
                >

                    <Button size="sm" className="flex items-center gap-1">
                        Guidelines
                        <InformationIcon className="size-3" />
                    </Button>
                </Popup>
            </section> : null
        }

        <Terminology isOpen={openTerminologyModal} handleToggle={handleToggleTerminologyModal} />
    </>;
};

export default Information;