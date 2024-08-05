"use client";
import { formatNumber } from "@/utils/format";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useMemo, useState, useEffect, useRef, MouseEvent } from "react";
import { useAccount } from "wagmi";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/common/Popup/Popover";
import SearchIcon from "../../common/Icons/SearchIcon";
import { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FilterIcon } from "lucide-react";
import Button from "@/components/common/Button";
import { Insurance } from "@/@type/insurance.type";
import Image from "next/image";
import { MODE, STATUS_DEFINITIONS } from "@/utils/constant";
import AssetDropdown from "../../BuyCover/Contract/Components/AssetsDropdown";
import useInsuranceStore from "@/stores/insurance.store";
import DataTable from "@/components/common/DataTable";
import clsx from "clsx";
import dayjs from "dayjs";
import {
	DateExpiredWrapper,
	TooltipHeaderWrapper,
	PnlWrapper,
	QClaimWrapper,
	PriceExpiredWrapper,
} from "@/components/BuyCover/Contract/utils";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import ArrowUpDownIcon from "@/components/common/Icons/ArrowUpDownIcon";
import { shortenHexString } from "@/utils/helper";
import ExternalLinkIcon from "@/components/common/Icons/ExternalLinkIcon";
import Tag from "@/components/common/Tag";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import useWalletStore from "@/stores/wallet.store";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import Input from "../../common/Input";
import FilterContractList from "../drawer/FilterContractList";
import MobileRecord from "@/components/BuyCover/Contract/TabHistory/MobileRecord";
import CoinListWrapper from "@/components/common/Accordion/CoinItem";
import { ENUM_INSURANCE_SIDE } from "hakifi-formula";
import TooltipCustom from "@/components/common/Tooltip";
import Copy from "@/components/common/Copy";
import TickerWrapper from "@/components/BuyCover/Favorites/TickerWrapper";
import { cn } from "@/utils";

const ContractList = () => {
	const { isConnected, address } = useAccount();
	const [
		setPagination,
		allInsurances,
		totalInsurances,
		toggleDetailModal,
		setInsuranceSelected,
		toggleCloseModal,
	] = useInsuranceStore((state) => [
		state.setPagination,
		state.allInsurances,
		state.totalInsurances,
		state.toggleDetailModal,
		state.setInsuranceSelected,
		state.toggleCloseModal,
	]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const handleCloseAction = (
		e: MouseEvent<HTMLButtonElement>,
		data: Insurance
	) => {
		e.stopPropagation();
		e.preventDefault();
		setInsuranceSelected(data);
		toggleCloseModal();
	};
	const isLogging = useWalletStore((state) => state.isLogging);
	const [search, setSearch] = useState<string>("");
	const [asset, setAsset] = useState<string>("all");
	const inputRef = useRef(null);

	const [openTime, setOpenTime] = useState<DateRange | undefined>(undefined);
	const [expireTime, setExpireTime] = useState<DateRange | undefined>(
		undefined
	);
	const isMobile = useIsMobile();
	const [searchTX, setSetsearchTX] = useState("");
	const onChangeSearchTX = (e: React.FormEvent<HTMLInputElement>) => {
		setSetsearchTX(e.currentTarget.value);
	};

	const [currentPage, getAllInsurance] = useInsuranceStore((state) => [
		state.currentPage,
		state.getAllInsurance,
	]);

	const { closedFrom, closedTo } = useMemo(() => {
		if (expireTime) {
			return {
				closedFrom: dayjs(expireTime.from).startOf("day").toISOString(),
				closedTo: dayjs(expireTime.to).endOf("day").toISOString(),
			};
		}
		return {
			closedFrom: undefined,
			closedTo: undefined,
		};
	}, [expireTime]);

	const { createdFrom, createdTo } = useMemo(() => {
		if (openTime) {
			return {
				createdFrom: dayjs(openTime.from).startOf("day").toISOString(),
				createdTo: dayjs(openTime.to).endOf("day").toISOString(),
			};
		}
		return {
			createdFrom: undefined,
			createdTo: undefined,
		};
	}, [openTime]);

	useEffect(() => {
		if (address && isConnected) {
			getAllInsurance({
				page: Number(currentPage || 1),
				sort:
					sorting
						.map((item: any) => `${item.desc ? "-" : ""}${item.id}`)
						.join("") || undefined,
				q: searchTX || undefined,
				closedFrom: closedFrom as unknown as Date,
				closedTo: closedTo as unknown as Date,
				createdFrom: createdFrom as unknown as Date,
				createdTo: createdTo as unknown as Date,
				asset: asset !== "all" ? asset : undefined,
			});
		}
	}, [
		address,
		currentPage,
		isConnected,
		sorting,
		searchTX,
		openTime,
		expireTime,
		asset,
		getAllInsurance,
		closedFrom,
		closedTo,
		createdFrom,
		createdTo,
	]);

	const columns: ColumnDef<Insurance>[] = useMemo(
		() => [
			{
				accessorKey: "asset",
				header: ({ column }) => {
					const isSort =
						typeof column.getIsSorted() === "boolean"
							? ""
							: column.getIsSorted() === "asc"
							? false
							: true;
					return (
						<Button
							size="sm"
							className="flex items-center gap-2"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc");
							}}
						>
							Pair
							<ArrowUpDownIcon sort={isSort} height={14} width={14} />
						</Button>
					);
				},
				cell: ({ row }) => {
					const token = row.getValue("token") as {
						attachment: string;
						name: string;
					};
					return (
						<div className="text-body-12 flex items-center gap-2">
							<Image
								src={token.attachment}
								width={24}
								height={24}
								alt="token"
							/>
							<div className="flex items-center gap-1">
								<span className="text-typo-primary">
									{row.getValue("asset")}
								</span>
								/<span>USDT</span>
							</div>
						</div>
					);
				},
				meta: {
					width: 120,
				},
			},
			{
				accessorKey: "side",
				header: "Side",
				meta: {
					width: 100,
				},
				cell: ({ row }) => {
					const side = row.getValue("side") as string;
					return (
						<div
							className={clsx(
								"text-body-12 text-typo-primary p-1 text-center rounded-sm",
								side === MODE.BULL ? "bg-positive-label" : "text-negative-label"
							)}
						>
							{side}
						</div>
					);
				},
			},
			{
				accessorKey: "expiredAt",
				header: ({ column }) => {
					const isSort =
						typeof column.getIsSorted() === "boolean"
							? ""
							: column.getIsSorted() === "asc"
							? false
							: true;
					return (
						<Button
							size="sm"
							className="flex items-center gap-2"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc");
							}}
						>
							T-Expire
							<ArrowUpDownIcon sort={isSort} height={14} width={14} />
						</Button>
					);
				},
				meta: {
					width: 185,
				},
				cell: ({ row }) => (
					<DateExpiredWrapper
						expired={row.getValue("expiredAt")}
						isCooldown={false}
					/>
				),
			},
			{
				accessorKey: "pnl",
				header: "PnL",
				meta: {
					width: 180,
				},
				cell: ({ row }) => (
					<PnlWrapper
						margin={row.getValue("margin")}
						q_claim={row.getValue("q_claim")}
						state={row.getValue("state")}
					/>
				),
			},
			{
				accessorKey: "margin",
				header: ({ column }) => {
					const isSort =
						typeof column.getIsSorted() === "boolean"
							? ""
							: column.getIsSorted() === "asc"
							? false
							: true;
					return (
						<TooltipHeaderWrapper
							title="Margin"
							tooltip="Margin"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc");
							}}
							suffix={<ArrowUpDownIcon className="ml-2" sort={isSort} />}
						/>
					);
				},
				meta: {
					width: 90,
				},
				cell: ({ row }) => (
					<div className="text-typo-primary">
						{formatNumber(row.getValue("margin"))}
					</div>
				),
			},
			{
				accessorKey: "q_covered",
				header: ({ column }) => {
					const isSort =
						typeof column.getIsSorted() === "boolean"
							? ""
							: column.getIsSorted() === "asc"
							? false
							: true;
					return (
						<TooltipHeaderWrapper
							title="Cover amount"
							tooltip="Cover amount"
							onClick={() => {
								column.toggleSorting(column.getIsSorted() === "asc");
							}}
							suffix={<ArrowUpDownIcon height={14} width={14} sort={isSort} />}
							className="flex items-center"
						/>
					);
				},
				meta: {
					width: 150,
				},
				cell: ({ row }) => (
					<div className="text-typo-primary">
						{formatNumber(row.getValue("q_covered"))}
					</div>
				),
			},
			{
				accessorKey: "state",
				header: "Status",
				cell: ({ row }) => {
					const { variant, title } =
						STATUS_DEFINITIONS[row.getValue("state") as string];
					return <Tag variant={variant} text={title} />;
				},
				meta: {
					width: 160,
				},
			},
			{
				accessorKey: "txhash",
				header: "TxH",
				meta: {
					width: 150,
				},
				cell: ({ row }) => {
					return (
						<a className="text-support-white flex items-center gap-2" href="#">
							{row.getValue("txhash")
								? shortenHexString(row.getValue("txhash") as string, 5, 4)
								: null}
							<ExternalLinkIcon />
						</a>
					);
				},
			},
			{
				accessorKey: "q_claim",
				header: "",
				meta: {
					show: false,
				},
			},
			{
				accessorKey: "token",
				header: "",
				meta: {
					show: false,
				},
			},
		],
		[isLogging, address]
	);
	return (
		<div className="flex flex-col gap-y-4">
			<div className="lg:flex w-full lg:items-center lg:justify-between">
				{isMobile === true ? (
					<FilterContractList sorting={sorting} />
				) : (
					<div className="flex items-center justify-start gap-x-5">
						<AssetDropdown
							handleSetAsset={(pair: string) => {
								if (pair === asset) {
									setAsset("");
								} else setAsset(pair);
							}}
							asset={asset}
						/>
						<div className="flex items-center gap-1 rounded-md border border-divider-secondary px-2 py-2 text-xs">
							<DateRangePicker
								onChange={(range: any) => {
									if (range) {
										setOpenTime(range);
									}
								}}
								className="flex text-sm w-full "
							>
								<div className="flex items-center justify-between rounded-md gap-x-2 text-typo-secondary">
									{!!openTime ? (
										<Button
											onClick={() =>
												setOpenTime({ from: undefined, to: undefined })
											}
											className="flex items-center justify-center gap-x-1 "
											size="md"
										>
											<p>
												{dayjs(openTime.from).format("DD/MM/YYYY")} -
												{dayjs(openTime.to).format("DD/MM/YYYY")}
											</p>
											{openTime?.from ? (
												<CloseIcon width={16} height={16} />
											) : null}
										</Button>
									) : (
										<p>Select open time</p>
									)}
									<CalendarIcon />
								</div>
							</DateRangePicker>
						</div>

						<div className="flex items-center gap-1 rounded-md border border-divider-secondary px-2 py-2 text-xs">
							<DateRangePicker
								onChange={(range: any) => {
									if (range) {
										setExpireTime(range);
									}
								}}
								className="flex text-sm w-full rounded-md"
							>
								<div className="flex items-center justify-between rounded-md gap-x-2 text-typo-secondary">
									{!!expireTime ? (
										<Button
											onClick={() =>
												setExpireTime({ from: undefined, to: undefined })
											}
											className="flex items-center justify-center gap-x-1 text-sm"
											size="md"
										>
											<p>
												{dayjs(expireTime.from).format("DD/MM/YYYY")} -
												{dayjs(expireTime.to).format("DD/MM/YYYY")}
											</p>

											{expireTime?.from ? (
												<CloseIcon width={16} height={16} />
											) : null}
										</Button>
									) : (
										<p>Select open expire</p>
									)}
									<CalendarIcon />
								</div>
							</DateRangePicker>
						</div>

						<Input
							suffix={<SearchIcon />}
							onChange={onChangeSearchTX}
							ref={inputRef}
							value={searchTX}
							suffixClassName="!border-l-0"
							size="md"
							wrapperClassInput="rounded-md border border-divider-secondary"
							placeholder="Search wallet"
							className="text-sm"
						/>
					</div>
				)}
			</div>
			{!isMobile ? (
				<DataTable
					columns={columns}
					data={allInsurances || []}
					total={totalInsurances}
					setSorting={setSorting}
					sorting={sorting}
					onChangePagination={(value) => setPagination(value)}
					classNameWrapper="w-full overflow-x-auto"
				/>
			) : (
				<section className="mt-5 flex flex-col gap-4 w-full">
					{allInsurances.map((insurance) => {
						return (
							<CoinListWrapper
								key={insurance.id}
								content={
									<section className="flex flex-col gap-3">
										<div className="flex items-center justify-between text-body-12">
											<TooltipCustom
												content={<p>Expire time</p>}
												title={
													<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
														Expire time
													</p>
												}
												showArrow={true}
											/>
											<DateExpiredWrapper
												expired={new Date(insurance.expiredAt)}
												isCooldown={true}
											/>
										</div>
										<div className="flex items-center justify-between text-body-12">
											<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
												HashID
											</p>
											<div className="flex items-center gap-1">
												<Copy
													text={insurance.id}
													prefix={insurance.id}
													styleContent="text-typo-primary"
												/>
											</div>
										</div>
										<div className="flex items-center justify-between text-body-12">
											<TooltipCustom
												content={<p>Open price</p>}
												title={
													<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
														P-Open
													</p>
												}
												showArrow={true}
											/>
											<p className="text-primary-3">
												{formatNumber(insurance.p_open)}
											</p>
										</div>
										<div className="flex items-center justify-between text-body-12">
											<TooltipCustom
												content={<p>Claim price</p>}
												title={
													<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
														P-Claim
													</p>
												}
												showArrow={true}
											/>
											<p className="text-primary-3">
												{formatNumber(insurance.p_claim)}
											</p>
										</div>
										<div className="flex items-center justify-between text-body-12">
											<TooltipCustom
												content={<p>Market price</p>}
												title={
													<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
														P-Market
													</p>
												}
												showArrow={true}
											/>
											<TickerWrapper jump symbol={`${asset}USDT`} decimal={8} />
										</div>
										<div className="flex items-center justify-between text-body-12">
											<TooltipCustom
												content={<p>Expire price</p>}
												title={
													<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
														P-Expire
													</p>
												}
												showArrow={true}
											/>
											<PriceExpiredWrapper
												pExpired={insurance.p_liquidation}
												symbol={`${asset}USDT`}
											/>
										</div>
										<div className="flex items-center justify-between text-body-12">
											<TooltipCustom
												content={<p>Claim amount</p>}
												title={
													<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
														Claim amount
													</p>
												}
												showArrow={true}
											/>
											<QClaimWrapper
												qClaim={insurance.q_claim}
												margin={insurance.margin}
											/>
										</div>
										<div className="flex items-center justify-between text-body-12">
											<TooltipCustom
												content={<p>Margin</p>}
												title={
													<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
														Margin
													</p>
												}
												showArrow={true}
											/>
											<p>{formatNumber(insurance.margin)}</p>
										</div>
										<div className="flex items-center justify-between text-body-12">
											<TooltipCustom
												content={<p>Cover amount</p>}
												title={
													<p className="text-typo-secondary border-b border-dashed border-divider-secondary">
														Cover amount
													</p>
												}
												showArrow={true}
											/>
											<p>{formatNumber(insurance.q_covered)}</p>
										</div>
									</section>
								}
							>
								<section className="flex items-center justify-between w-full">
									<div className="text-body-12 flex items-center gap-2">
										<Image
											src={insurance.token.attachment}
											width={24}
											height={24}
											alt="token"
										/>
										<div className="flex items-center gap-1">
											<span className="text-typo-primary">
												{insurance.asset}
											</span>
											<span className="text-typo-secondary">/ USDT</span>
										</div>
									</div>
									<div
										className={cn(
											"!text-body-12 text-typo-primary py-2 px-3 text-center rounded-sm",
											insurance.side === ENUM_INSURANCE_SIDE.BULL
												? "bg-positive-label"
												: "text-negative-label"
										)}
									>
										{insurance.side}
									</div>
								</section>
							</CoinListWrapper>
						);
					})}
				</section>
			)}
		</div>
	);
};
export default ContractList;
