import { listTimeFrame } from "@/components/TVChartContainer/constantsTrading";
import Button from "@/components/common/Button";
import FullScreenIcon from "@/components/common/Icons/FullScreenIcon";
import IndicatorIcon from "@/components/common/Icons/IndicatorIcon";
import MinimizeIcon from "@/components/common/Icons/MinimizeIcon";
import RefreshIcon from "@/components/common/Icons/RefreshIcon";
import { Tabs, TabsList, TabsTrigger } from "@/components/common/Tabs";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";

type ChartOptionsProps = {
    mode: string;
    resolution: string;
    setResolution: (value: string) => void;
    setMode: (e: string) => void;
    fullScreen: boolean;
    setFullScreen: (e: boolean) => void;
    onShowIndicator: VoidFunction;
    onRefreshChart: VoidFunction;
};

interface Resolution {
    label: string;
    resolution: string,
}

const ChartOptions = ({ onRefreshChart, resolution, setResolution, mode, setMode, fullScreen, setFullScreen, onShowIndicator }: ChartOptionsProps) => {
    const isMobile = useIsMobile();

    return (
        <div
            className="w-full flex items-center justify-between gap-3 sm:gap-0 bg-background-tertiary"
        >
            <div className="flex items-center md:min-w-[250px]">
                <Tabs className="w-full">
                    <TabsList className="grid w-full grid-cols-7 gap-2">
                        {listTimeFrame.map((t: Resolution) => <TabsTrigger
                            key={t.resolution}
                            value={t.resolution}
                            onClick={() => setResolution(t.resolution)}
                            className={cn("h-fit !text-body-12  hover:bg-background-secondary hover:text-typo-accent hover:border-typo-accent px-2.5 py-1 text-typo-secondary border border-divider-secondary rounded-sm",
                             t.resolution === resolution && "text-body-14 bg-background-secondary text-typo-accent")}>
                            {t.label}
                        </TabsTrigger>
                        )}
                    </TabsList>
                </Tabs>
            </div>
            <div className="flex items-center space-x-3">

                {/* {charts.map((chart: any) => (
                    <div
                        key={chart.id}
                        onClick={() => setMode(chart.id)}
                        className={clsx("rounded-full sm:text-body-14  text-xsmall-10B cursor-pointer whitespace-nowrap text-primary-1", {
                            "!p-0": isMobile,
                        })}
                    >
                        {chart[language]}
                    </div>
                ))} */}
                {!isMobile && (
                    <>
                        <div className="cursor-pointer" onClick={() => setFullScreen(!fullScreen)}>
                            {
                                !fullScreen ? <FullScreenIcon /> : <MinimizeIcon />
                            }
                        </div>
                        <div className="cursor-pointer" onClick={onShowIndicator}>
                            <IndicatorIcon />
                        </div>
                    </>
                )}
                {
                    !isMobile && <Button size="md" className="" onClick={onRefreshChart}>
                        <RefreshIcon />
                    </Button>
                }
            </div>
        </div>
    );
};

export default ChartOptions;
