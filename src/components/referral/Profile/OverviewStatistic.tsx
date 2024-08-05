import React from "react";
// import OverviewChart from './OverviewChart';
import { formatNumber } from "@/utils/format";

const listOverStatistic = [
	{
		label: "Payback",
		value: "totalPayback",
		icon: "/assets/images/cryptos/usdt.png",
	},
	{
		label: "Margin signed",
		value: "totalMargin",
		icon: "/assets/images/cryptos/usdt.png",
	},
	{
		label: "Contract opened",
		value: "totalInsurance",
	},
	{
		label: "Contract closed",
		value: "totalInsuranceClosed",
	},
	{
		label: "Contract claimed",
		value: "totalInsuranceClaimed",
	},
	{
		label: "Contract refunded",
		value: "totalInsuranceRefunded",
	},
	{
		label: "Contract liquidated",
		value: "totalInsuranceLiquidated",
	},
];

type ListOverStatisticType = {
	[key: string]: number;
};
type TProps = {
	data: ListOverStatisticType;
};

const OverviewStatistic = ({ data }: TProps) => {
	return (
		<div className="w-full py-5 px-4">
			<div className="grid grid-cols-1 gap-y-3">
				{listOverStatistic.map((item) => {
					const title = item.label;
					const value = formatNumber(data?.[item.value], 2) || 0;
					return (
						<div className="w-full" key={item.value}>
							<div className="flex flex-row justify-between">
								<p className="text-sm text-typo-secondary">{title}</p>
								<p className="text-sm text-typo-primary flex items-center justify-start gap-x-1">
									{value}
									{item.icon ? (
										<img src={item.icon} alt="icon" className="w-6 h-6" />
									) : null}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default OverviewStatistic;
