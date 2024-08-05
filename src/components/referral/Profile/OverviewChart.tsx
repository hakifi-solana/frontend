import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Select from "@/components/common/Select";
import dayjs from "dayjs";
import clsx from "clsx";
import { formatNumber } from "@/utils/format";
import colors from "@/colors";

type TProps = {
	data: any;
	filter: { label: string; value: string };
	setFilter: React.Dispatch<
		React.SetStateAction<{ label: string; value: string }>
	>;
};

const OverviewChart: React.FC<TProps> = ({ data, filter, setFilter }) => {
	const options: ApexOptions = React.useMemo(() => {
		const categories = data.map((item: any) => item.time);
		return {
			chart: {
				type: "area",
				height: "100%",
				width: "100%",
				toolbar: {
					show: false,
				},
				background: "transparent",
				zoom: {
					enabled: false,
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: "straight",
				width: 2,
			},
			tooltip: {
				custom: function ({ series, seriesIndex, dataPointIndex, w }) {
					const value = series[seriesIndex][dataPointIndex];
					return `<div class="p-1 bg-background-secondary border border-background-scrim/60">
                  <p class="text-typo-primary text-sm">${formatNumber(
										value,
										2
									)} USDT</p>
            </div>`;
				},
				theme: "dark",
				marker: {
					show: true,
				},
			},
			xaxis: {
				type: "category",
				axisBorder: {
					show: true,
					color: colors.divider.secondary,
				},
				axisTicks: {
					show: false,
				},
				labels: {
					show: true,
					formatter: (value: string) => {
						if (value !== undefined) {
							if (value === categories[categories.length - 1]) {
								return dayjs(value, "DD/MM/YYYY").format("DD/MM");
							} else return dayjs(value).format("DD/MM");
						}
						return dayjs(value).format("DD/MM");
					},
					style: {
						colors: "#a1a1a1",
						fontSize: "12px",
						fontFamily: "var(--font-saira)",
					},
				},
				categories,
			},
			yaxis: {
				tickAmount: 4,
				floating: false,
				axisBorder: {
					show: true,
					color: colors.divider.secondary,
					offsetX: 7,
				},
				opposite: false,
				axisTicks: {
					show: false,
				},
				labels: {
					formatter: (value: number) => {
						return formatNumber(value, 2);
					},
					show: false,
				},
			},
			fill: {
				type: "gradient",
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.6,
					opacityTo: 0.1,
					stops: [10, 90, 100],
				},
				colors: [colors.typo.accent],
			},
			colors: [colors.typo.accent],
			grid: {
				borderColor: colors.divider.secondary,
				xaxis: {
					lines: {
						show: false,
						offsetX: 1,
					},
				},
				yaxis: {
					lines: {
						offsetX: 0,
						show: false,
					},
				},
				padding: {
					left: 20,
				},
			},
			markers: {
				size: 6,
				color: colors.typo.accent,
				strokeColor: colors.typo.accent,
				show: true,
				radius: 1,
				hover: {
					sizeOffset: 3,
				},
				shape: "square",
			},
			theme: {
				mode: "dark",
				monochrome: {
					enabled: true,
					color: colors.typo.accent,
					shadeTo: "dark",
					shadeIntensity: 0.65,
				},
			},
			noData: {
				text: "No data available",
				align: "center",
				verticalAlign: "middle",
				offsetX: 0,
				offsetY: 0,
				style: {
					color: colors.typo.secondary,
					fontSize: "16px",
					fontFamily: "var(--font-saira)",
					fontWeight: "bold",
					background: "transparent",
				},
			},
			plotOptions: {
				area: {
					fillTo: "origin",
				},
			},
		};
	}, [data, filter]);
	const series: ApexOptions["series"] = React.useMemo(() => {
		const parseDate = data.map((item: any) => item.totalPnl);
		return [
			{
				name: "PNL User",
				data: parseDate,
			},
		];
	}, [data, filter]);
	const optionsSelect = [
		{
			label: "All",
			value: "all",
		},
		{
			label: "7D",
			value: "week",
		},
		{
			label: "1M",
			value: "month",
		},
		{
			label: "1Y",
			value: "year",
		},
	];
	return (
		<div className="w-full">
			<div className="p-4">
				<div className="w-full flex items-center justify-between">
					<p className="text-base text-support-white">Personal overview</p>
					<Select
						onChange={(value) => {
							setFilter(value);
						}}
						value={filter}
						options={optionsSelect}
					/>
				</div>
				<div className="flex w-full items-start justify-between">
					<div>
						<p className="text-typo-secondary text-sm">Personal Pnl</p>
						<div
							className={clsx("text-base", {
								"text-positive":
									data[data.length - 1]?.totalPnl >= 0 ||
									data[data.length - 1]?.totalPnl === undefined,
								"text-negative-label": data[data.length - 1]?.totalPnl < 0,
							})}
						>
							{data[data.length - 1]?.totalPnl >= 0 ||
							data[data.length - 1]?.totalPnl === undefined
								? "+"
								: "-"}{" "}
							{formatNumber(data[data.length - 1]?.totalPnl, 2)} USDT
						</div>
					</div>
				</div>
			</div>
			<ReactApexChart
				options={options}
				series={series}
				type="area"
				height={152}
				style={{
					background: "transparent",
				}}
				width={"100%"}
			/>
		</div>
	);
};

export default OverviewChart;
