import React, { useState, useRef } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
import { capitalize, substring } from "@/utils/helper";

import { formatNumber } from "@/utils/format";
import { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/useMediaQuery";
import DataTable from "@/components/common/DataTable";
import { getFriendHistoryList } from "@/apis/referral.api";
import { VICTION_SCAN } from "@/utils/constant";
import Input from "@/components/common/Input";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import Button from "@/components/common/Button";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import FilterCommissionHistory from "../drawer/FilterCommissionHistory";
import Tag from "@/components/common/Tag";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import CommissionHistoryItem from "./CommissionHistoryItem";
import { TCommission } from "../type";
import dayjs from "dayjs";
const CommissionHistory: React.FC = () => {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [date, setDate] = React.useState<DateRange>({
		from: undefined,
		to: undefined,
	});
	const [search, setSearch] = React.useState<string>("");
	const [data, setData] = React.useState<{
		rows: TCommission[];
		total: number;
	}>({ rows: [], total: 0 });
	const [page, setPage] = React.useState<number>(1);
	const paramsGetListFriend: any = React.useMemo(() => {
		let params: any = {
			page,
			limit: 10,
		};
		if (sorting.length > 0) {
			params = {
				...params,
				sort: sorting[0].desc === true ? "-" + sorting[0].id : sorting[0].id,
			};
		}
		if (date.from && date.to) {
			params = {
				...params,
				createdFrom: date.from.toISOString(),
				createdTo: date.to.toISOString(),
			};
		}
		if (search) {
			params = {
				...params,
				q: search,
			};
		}
		return params;
	}, [date, sorting, search, page]);
	const handleGetListContractFriend = async () => {
		try {
			const res = await getFriendHistoryList(paramsGetListFriend);
			if (res) {
				setData(res);
			}
		} catch (err) {
			console.log(err);
		}
	};
	React.useEffect(() => {
		handleGetListContractFriend();
	}, [date, sorting, search, page]);
	const handleChangePage = (page: number) => {
		setPage(page);
	};
	const columns: ColumnDef<TCommission>[] = useMemo(
		() => [
			{
				accessorKey: "walletAddress",
				header: "Address",
				cell: ({ row }) => {
					return (
						<div
							onClick={() =>
								window.open(
									`${VICTION_SCAN}/address/${row.original?.fromUser?.walletAddress}`,
									"_blank"
								)
							}
						>
							<Link
								href={
									`${VICTION_SCAN}/address/${row.original?.fromUser?.walletAddress}` ||
									""
								}
								className="flex items-center gap-x-1 text-sm text-typo-primary"
								target="_blank"
							>
								{substring(row.original?.fromUser?.walletAddress || "")}
								{/* <ExternalIcon /> */}
							</Link>
						</div>
					);
				},
				aggregate: "link",
			},
			{
				accessorKey: "symbol",
				header: "Pair",
				cell: ({ row }) => {
					return (
						<p>
							<span className="text-typo-primary">{row.original.insurance.asset}</span>
							<span>/{row.original.insurance.unit}</span>
						</p>
					);
				},
			},
			{
				accessorKey: "side",
				header: "Side",
				cell: ({ row }) => {
					const { side } = row.original.insurance;
					return (
						<Tag variant={side === "BULL" ? "success" : "error"} text={side} />
					);
				},
			},
			{
				accessorKey: "friendKind",
				header: "Type",
				cell: ({ row }) => {
					return (
						<div className="text-sm text-typo-primary">
							F{row.original?.type || ""}
						</div>
					);
				},
			},
			{
				accessorKey: "referralType",
				header: "Commission type",
				cell: ({ row }) => {
					return (
						<div className="text-sm text-typo-primary">
							{capitalize(row.original?.commissionType)}
						</div>
					);
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "totalMargin",
				header: "Margin ",
				cell: ({ row }) => {
					return (
						<div className="flex items-center gap-x-1 text-sm text-typo-primary">
							<img
								src="/assets/images/cryptos/usdt.png"
								className="h-6 w-6"
								alt="usdt"
							/>
							{formatNumber(row.original.insurance.margin, 2)}
						</div>
					);
				},
			},
			{
				accessorKey: "commissionRefund",
				header: "Commission",
				cell: ({ row }) => {
					return (
						<div className="flex items-center gap-x-1 text-sm text-typo-primary">
							<img
								src="/assets/images/cryptos/usdt.png"
								className="h-6 w-6"
								alt="usdt"
							/>
							{formatNumber(row.original.amount || 0, 2)}
						</div>
					);
				},
			},
			{
				accessorKey: "createdAt",
				header: "Close time",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary">
							{dayjs(row.original.insurance.closedAt).format("DD/MM/YYYY - HH:mm:ss")}
						</div>
					);
				},
				meta: {
					showArrow: true,
				},
				aggregate: "link",
			},
		],
		[]
	);
	const handleSelect = (range: DateRange | undefined) => {
		if (range) {
			setDate(range);
		} else {
		}
	};
	const handleSearch = (e: any) => {
		setSearch(e.target.value);
	};
	const inputRef = useRef(null);
	const isMobile = useIsMobile();
	return (
		<div className="my-5 lg:px-4">
			<div className="mb-5 flex items-center justify-between border-b border-divider-secondary pb-4">
				{isMobile ? (
					<FilterCommissionHistory
						searchTX={search}
						date={date}
						handleChangeDate={handleSelect}
						onChangeSearchTX={handleSearch}
					/>
				) : (
					<div className="flex items-center gap-x-5">
						<div className="flex items-center gap-1 justify-between rounded-md text-typo-secondary border border-divider-secondary bg-transparent px-2 text-sm min-w-[220px] py-1.5">
							<DateRangePicker
								range={date}
								onChange={handleSelect}
								labelClassName=""
								className="w-full"
							>
								<div className="w-full flex items-center justify-between">
									{!!date?.from ? (
										<Button
											onClick={() =>
												setDate({ from: undefined, to: undefined })
											}
											className="flex items-center justify-center gap-x-1 text-xs"
											size="md"
										>
											<p>
												{dayjs(date.from).format("DD/MM/YYYY")} -
												{dayjs(date.to).format("DD/MM/YYYY")}
											</p>
											{date?.from ? <CloseIcon width={16} height={16} /> : null}
										</Button>
									) : (
										<p>Select time</p>
									)}
									<CalendarIcon />
								</div>
							</DateRangePicker>
						</div>
						<Input
							suffix={<SearchIcon />}
							onChange={handleSearch}
							ref={inputRef}
							placeholder="Search wallet address"
							value={search}
							wrapperClassInput="bg-transparent outline-none text-typo-secondary border border-divider-secondary rounded-md text-sm !px-2 !py-0.5"
							suffixClassName="!border-l-0"
							size="md"
							className="text-sm"
						/>
					</div>
				)}
			</div>
			{isMobile ? (
				<div>
					{data?.rows?.length > 0 ? (
						data.rows?.map((item: TCommission) => (
							<CommissionHistoryItem data={item} key={item.id} />
						))
					) : (
						<div className="w-full">
							<p className="text-typo-secondary text-center">
								No data available
							</p>
						</div>
					)}
				</div>
			) : (
				<DataTable
					columns={columns}
					data={data?.rows}
					showPagination={false}
					total={data?.total}
					setSorting={setSorting}
					sorting={sorting}
					onChangePagination={handleChangePage}
				/>
			)}
		</div>
	);
};

export default CommissionHistory;
