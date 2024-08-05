"use client";

import { IPairConfig } from "@/@type/insurance.type";
import { InsuranceChartParams } from "@/components/BuyCover/Chart/drawing";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { cn } from "@/utils";
import { useMemo, useRef } from "react";
import Glosbe from "./Glosbe";

type ChartProps = {
	symbol: string;
	decimals?: { symbol: number; price: number };
	isMobile?: boolean;
	pairConfig?: IPairConfig;
	isHistory?: boolean;
	onFullScreen?: (e: boolean) => void;
	className?: string;
	classContainer?: string;
	toolbar?: boolean;
	fullScreen: boolean;
	setFullScreen: (expand: boolean) => void;
	data: InsuranceChartParams;
};

const Chart = ({
	symbol,
	onFullScreen,
	classContainer,
	fullScreen,
	setFullScreen,
	data,
}: ChartProps) => {
	const isMobile = useIsMobile();
	const container = useRef<HTMLDivElement>(null);

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
	//     const zindex = "z-50";
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
	// }, [fullScreen]);

	const pair = useMemo(
		() => `${symbol.toString().split("USDT")[0]}/USDT`,
		[symbol]
	);
	return (
		<div
			ref={container}
			data-tour="chart"
			className={cn(
				!isMobile && "min-h-[650px]",
				// !fullScreen && "z-1 relative",
				fullScreen && isMobile && "w-[100vh] h-[100vw] fixed"
				// fullScreen && !isMobile && "w-full h-full",
			)}
		>
			<div
				className={cn(
					"bg-white transition-all",
					// isMobile ? "pb-6" : "box-radius",
					// !showChart && "h-0 opacity-0",
					// fullScreen && !isMobile && "mt-[210px]",
					fullScreen &&
						isMobile &&
						"w-[100vh] h-[100vw] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90",
					classContainer
				)}
			>
				{/* {!fullScreen && <PairInformationBar />} */}

				<Glosbe
					data={data}
					symbol={symbol}
					fullScreen={fullScreen}
					onFullScreen={(fullScreen: boolean) => setFullScreen(fullScreen)}
				/>
			</div>
		</div>
	);
};

export default Chart;
