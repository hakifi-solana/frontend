import { cn } from "@/utils";
import React from "react";
import { TYPE_CARD_MARKET } from "../constants";
import Label from "@/components/common/Label";
import { formatNumber } from "@/utils/format";
import { shortenHexString } from "@/utils/helper";
import Spinner from "@/components/common/Spinner";
import Tag from "@/components/common/Tag";

type Props = {
	className: string;
	title: string;
	headerCell: string[];
	dataCell: any[];
	type: string;
	isLoading: boolean;
};

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			" text-xs font-medium font-saira text-typo-secondary pb-3",
			className
		)}
		{...props}
	/>
));

const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td
		ref={ref}
		className={cn(
			" font-saira text-xs lg:text-sm font-medium text-typo-primary pb-4",
			className
		)}
		{...props}
	/>
));

const CellMarketPrice = ({ gap }: { gap: number }) => {
	return (
		<div
			className={cn("flex items-center", {
				"text-negative-label": gap < 0,
				"text-positive": gap >= 0,
			})}
		>
			<p>
				{gap < 0 ? "-" : "+"}
				<span className="text-xs">{formatNumber(Math.abs(gap) || 0, 2)}%</span>
			</p>
		</div>
	);
};

export default function CardMarket({
	className,
	title,
	headerCell,
	dataCell,
	type,
	isLoading,
}: Props) {
	return (
		<div
			className={cn(
				"border border-solid border-divider-secondary rounded-md bg-background-tertiary p-4",
				className
			)}
		>
			<h1 className=" border-b border-solid border-divider-secondary text-sm lg:text-base font-medium text-typo-primary font-saira pb-3 lg:pb-4 lg:pt-1">
				{title}
			</h1>
			<div className="pt-3 lg:pt-4">
				{isLoading ? (
					<div className="w-full h-40 relative">
						<Spinner
							className=" absolute transform left-1/2 top-1/2 !-translate-x-1/2 !-translate-y-1/2"
							size={"xs"}
						/>
					</div>
				) : (
					<table className="w-full">
						<thead>
							<tr>
								{headerCell.map((header, index) => (
									<TableHead
										className={cn("text-xs", {
											"text-start max-w-[82px]": index === 0 || index === 1,
											"text-end": index === 2,
											"w-max": index >= 2,
										})}
										key={header}
									>
										{header}
									</TableHead>
								))}
							</tr>
						</thead>
						<tbody>
							{dataCell.map((data, index) => {
								if (type === TYPE_CARD_MARKET.USER) {
									return (
										<tr key={index}>
											<TableCell>
												<div className="text-start text-typo-accent underline lg:min-h-11">
													{shortenHexString(data.walletAddress, 4, 4)}
												</div>
											</TableCell>
											<TableCell className="align-top">
												<div className="text-start">
													{formatNumber(data.totalContracts)}
												</div>
											</TableCell>
											<TableCell className="align-top">
												<div className="text-end">
													${formatNumber(data.totalPayback)}
												</div>
											</TableCell>
										</tr>
									);
								}
								return (
									<tr key={index}>
										<TableCell>
											<div className="text-start">
												<span className="text-typo-primary">{data.asset} </span>
												<span className="text-typo-secondary">
													/ {data.unit}
												</span>
												<Label value={data?.side} />
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-col items-center">
												<p>${formatNumber(data.lastPrice)}</p>
												<CellMarketPrice gap={data.priceChangePercent} />
											</div>
										</TableCell>
										<TableCell className="align-top">
											<div className="text-end">
												{type === TYPE_CARD_MARKET.CONTRACT && (
													<>
														<p>{data.contracts}</p>
														<p className="text-xs text-typo-secondary">
															{data.status}
														</p>
													</>
												)}
												{type === TYPE_CARD_MARKET.AMOUNT && (
													<div className="flex item-center justify-end gap-x-1">
														<span>{`${formatNumber(
															data.q_covered || data.q_claim,
															2
														)} / ${formatNumber(data.margin, 2)}`}</span>
														<img
															src="/assets/images/cryptos/usdt.png"
															className="w-4 h-4"
														/>
													</div>
												)}
											</div>
										</TableCell>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
