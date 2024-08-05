"use client";

import { IPairConfig } from "@/@type/insurance.type";
import { MarketPair } from "@/@type/pair.type";
import CandleIcon from "@/components/common/Icons/CandleIcon";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";
import { useCallback, useMemo, useRef, useState } from "react";
import Glosbe from "./Glosbe";

type ChartProps = {
  symbol: string;
  decimals?: { symbol: number; price: number; };
  isMobile?: boolean;
  pairConfig?: IPairConfig;
  isHistory?: boolean;
  onFullScreen?: (e: boolean) => void;
  className?: string;
  classContainer?: string;
  toolbar?: boolean;
  marketPairs: MarketPair[];
  fullScreen: boolean;
  setFullScreen: (expand: boolean) => void;
};

const Chart = ({
  symbol,
  onFullScreen,
  classContainer,
  fullScreen,
  setFullScreen
}: ChartProps) => {
  const isMobile = useIsMobile();
  const container = useRef<HTMLDivElement>(null);
  const [showChart, setShowChart] = useState(true);
  const toggleShowChart = useCallback(() => setShowChart(pre => !pre), []);

  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape" && fullScreen) {
      e.preventDefault();
      setFullScreen(false);
    }
  };

  // useEffect(() => {
  //   if (onFullScreen) onFullScreen(fullScreen);
  //   const el = container.current;
  //   document.addEventListener("keydown", keyDownHandler);
  //   if (el) {
  //     const zindex = isMobile ? "z-50" : "z-[29]";
  //     el.classList[fullScreen ? "add" : "remove"](
  //       "fixed",
  //       "bg-light-2",
  //       zindex,
  //       "w-screen",
  //       "h-screen",
  //       "top-1/2",
  //       "left-1/2",
  //       "-translate-x-1/2",
  //       "-translate-y-1/2",
  //     );
  //     document.body.classList[fullScreen ? "add" : "remove"]("overflow-hidden");
  //   }
  //   return () => {
  //     document.body.classList["remove"]("overflow-hidden");
  //     document.removeEventListener("keydown", keyDownHandler);
  //   };
  // }, [fullScreen, isMobile]);

  const pair = useMemo(() => `${symbol.toString().split("USDT")[0]}/USDT`, [symbol]);
  return (
    <div
      ref={container}
      data-tour="chart"
      className={cn(
        !isMobile && "min-h-[650px]",
        fullScreen && isMobile && "w-[100vh] h-[100vw] fixed z-[60]",
      )}>
      <div
        className={cn(
          fullScreen && isMobile && "w-[100vh] h-[100vw] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90",
          classContainer,
        )}>
        {/* {!fullScreen && <PairInformationBar />} */}
        {
          showChart ? <Glosbe
            symbol={symbol}
            fullScreen={fullScreen}
            onFullScreen={(fullScreen: boolean) => setFullScreen(fullScreen)}
          /> : null
        }

      </div>
    </div>
  );
};

export default Chart;
