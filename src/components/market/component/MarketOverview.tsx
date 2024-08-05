"use client";

import { useEffect, useState } from "react";
import { TYPE_CARD_MARKET } from "../constants";
import CardMarket from "./CardMarket";
import { getMarketOverview } from "@/apis/general.api";
import { DataOverviewMarket } from "../type";

export default function MarketOverview() {
	const [data, setData] = useState<DataOverviewMarket>({
		topContracts: [],
		topCoverAmount: [],
		topGainers: [],
		topPaybackUsers: [],
	});

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const handleGetMarketOverview = async () => {
		return await getMarketOverview()
			.then((res) => {
				if (res as unknown as DataOverviewMarket) {
					setData(res);
					setIsLoading(false);
				}
			})
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		handleGetMarketOverview();
	}, []);

	return (
		<section className="mt-4 lg:mt-5">
			<h3 className="text-xl lg:text-[28px] font-normal font-determination text-typo-accent leading-[42px]">
				MARKET OVERVIEW
			</h3>
			<p className="mt-2 lg:mt-0 text-sm font-medium font-saira text-typo-primary lg:max-w-[750px] leading-[22px]">
				Lorem ipsum dolor sit amet consectetur. Ornare sodales ut lobortis netus
				elementum. Id eget amet id facilisis molestie ut ut commodo. Vivamus
				lorem a diam et suspendisse id. Porttitor nam tincidunt at in vitae
				blandit lorem.
			</p>
			<div className="mt-4 flex flex-col lg:grid lg:grid-cols-4 items-center gap-y-2 lg:gap-x-3">
				<CardMarket
					className="w-full lg:col-span-1 h-full"
					title={"Top Contract"}
					headerCell={["Contract", "Market Price", "Quantities"]}
					dataCell={data.topContracts}
					type={TYPE_CARD_MARKET.CONTRACT}
					isLoading={isLoading}
				/>
				<CardMarket
					className="w-full lg:col-span-1 h-full"
					title={"Top Cover Amount"}
					headerCell={["Contract", "Market Price", "Cover Amount / Margin"]}
					dataCell={data.topCoverAmount}
					type={TYPE_CARD_MARKET.AMOUNT}
					isLoading={isLoading}
				/>
				<CardMarket
					className="w-full lg:col-span-1 h-full"
					title={"Top Claim Amount"}
					headerCell={["Contract", "Market Price", "Claim Amount / Margin"]}
					dataCell={data.topGainers}
					type={TYPE_CARD_MARKET.AMOUNT}
					isLoading={isLoading}
				/>
				<CardMarket
					className="w-full lg:col-span-1 h-full"
					title={"Top Payback User"}
					headerCell={["User", "Total contracts", "Total Payback"]}
					dataCell={data.topPaybackUsers}
					type={TYPE_CARD_MARKET.USER}
					isLoading={isLoading}
				/>
			</div>
		</section>
	);
}
