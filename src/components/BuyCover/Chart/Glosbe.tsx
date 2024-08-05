import { IPairConfig } from "@/@type/insurance.type";
import { useChart } from "@/components/TVChartContainer";
import IndicatorBars from "@/components/TVChartContainer/IndicatorBars";
import { useIsMobile } from "@/hooks/useMediaQuery";
import useBuyCoverStore from "@/stores/buy-cover.store";
import { cn } from "@/utils";
import debounce from "lodash.debounce";
import React, { useMemo, useState } from "react";
import ChartOptions from "./ChartOptions";
import { InsuranceChartParams, useDrawing } from "./drawing";

type GlosbeProps = {
    symbol: string;
    decimals?: { symbol: number; price: number; };
    isMobile?: boolean;
    pairConfig?: IPairConfig;
    isDetail?: boolean;
    isHistory?: boolean;
    onFullScreen: (e: boolean) => void;
    showTimeframe?: boolean;
    className?: string;
    customClassName?: string;
    classContainer?: string;
    toolbar?: boolean;
    fullScreen: boolean;
};

const Glosbe = ({
    symbol,
    isDetail = false,
    onFullScreen,
    showTimeframe = true,
    className = "",
    classContainer,
    customClassName,
    fullScreen
}: GlosbeProps) => {
    const isMobile = useIsMobile();
    const [mode, setMode] = useState("trading");
    const {
        containerRef,
        container_id,
        chartReady,
        chart,
        widget,
        setIntervalChart,
        handleChangeIndicator,
        indicator
    } = useChart(symbol);
    const insuranceChartParams: InsuranceChartParams = useBuyCoverStore(
        (state) => ({
            p_claim: state.p_claim,
            p_cancel: state.p_cancel,
            p_liquidation: state.p_liquidation,
            p_refund: state.p_refund,
            p_open: state.p_open,
            expiredAt: state.expiredAt,
            // p_close: state.p_close,
        }),
    );

    const { drawing, clearLine } = useDrawing(chart, chartReady, insuranceChartParams);

    const [resolution, setResolution] = useState("1D");

    const handleChangeResolution = (value: string) => {
        setIntervalChart(value);
        setResolution(value);
    };

    const onRefreshChart = () => {
        clearLine();
        debounce(() => {
            drawing();
        }, 500);
    };

    const onShowIndicator = () => {
        widget?.activeChart().executeActionById("insertIndicator");
    };

    // useEffect(() => {
    //     document.body
    //         .querySelector("main")
    //         ?.classList[fullScreen ? "add" : "remove"]("!z-50");

    //     return () => {
    //         document.body.querySelector("main")?.classList.remove("!z-50");
    //     };
    // }, [fullScreen]);

    const offsetH = useMemo(() => {
        // if (fullScreen && isMobile) return `calc(100vw - 104px)`;
        if (fullScreen) return `calc(100vh - 550px)`;
        if (isMobile) return 420;

        return 650;
    }, [fullScreen]);

    return (
        <>
            <section className={cn("py-3 border-b border-divider-secondary bg-background-tertiary", !fullScreen && "mx-4")}>
                <ChartOptions
                    mode={mode}
                    resolution={resolution}
                    setResolution={handleChangeResolution}
                    setMode={setMode}
                    fullScreen={fullScreen}
                    setFullScreen={onFullScreen}
                    onShowIndicator={onShowIndicator}
                    onRefreshChart={onRefreshChart}
                />
            </section>
            <div
                style={{
                    height: offsetH,
                }}
                className={cn(
                    "bg-background-tertiary duration-300 transition-all ease-linear",
                    isMobile && !fullScreen && "px-4 mb-10",
                    className
                )}>
                <div className="h-full border-b border-divider-secondary">
                    <div
                        ref={containerRef as React.RefObject<HTMLDivElement>}
                        id={container_id as string}
                        className={cn(customClassName, "h-full")}
                    />
                    {
                        isMobile && <IndicatorBars
                            onChangeIndicator={handleChangeIndicator}
                            mainIndicator={indicator.mainIndicator?.name}
                            subIndicator={indicator.subIndicator?.name}
                            fullScreen={fullScreen}
                            setFullScreen={onFullScreen}
                            onShowIndicator={onShowIndicator}
                            isDetail={isDetail}
                            isMobile={isMobile}
                            onRefreshChart={onRefreshChart}
                        />
                    }
                </div>


            </div>
        </>
    );
}
    ;

export default Glosbe;