import React from "react";
import Select from "@/components/common/Select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/common/Popup/Popover";
import dayjs from "dayjs";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { FilterIcon } from "lucide-react";
import { getTransactionsList, ParamsTransaction } from "@/apis/referral.api";
import { LIMIT_PAGE } from "../constant";
import Button from "@/components/common/Button";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import useWalletStore from "@/stores/wallet.store";
import dynamic from "next/dynamic";
import Spinner from "@/components/common/Spinner";
import FilterTransactionHistory from "../drawer/FilterTransactionHistory";
import Tag from "@/components/common/Tag";
import { capitalize } from "@/utils/helper";
import { formatNumber } from "@/utils/format";
import Pagination from "@/components/common/Pagination";

const STATUS: {
	[x: string]: "primary" | "error" | "warning" | "disabled" | "success";
} = {
	MARGIN: "primary",
	CLAIM: "success",
	REFUND: "warning",
	CANCEL: "error",
};

const HistoryTable = dynamic(() => import("./HistoryTable"), {
	ssr: false,
	loading: () => (
		<div className="w-full flex items-center justify-center mt-4">
			<Spinner size="large" />
		</div>
	),
});
const TransactionHistory: React.FC = () => {
	const [wallet] = useWalletStore((state) => [state.wallet]);
	const [filter, setFilter] = React.useState<any>({
		label: "All",
		value: "all",
	});
	const [date, setDate] = React.useState<DateRange>({
		from: undefined,
		to: undefined,
	});
	const isMobile = useIsMobile();
	const [coin, setCoin] = React.useState<any>({
		label: "All",
		value: "all",
	});
	const [data, setData] = React.useState<{ rows: any[]; total: number }>({
		rows: [],
		total: 0,
	});
	const [page, setPage] = React.useState<number>(1);
	const optionsSelect = React.useMemo(() => {
		return [
			{
				label: "All",
				value: "all",
			},
			{
				label: "USDT",
				value: "USDT",
			},
			{
				label: "VNST",
				value: "VNST",
			},
		];
	}, []);
	const handleSelect = (range: DateRange | undefined) => {
		if (range) {
			setDate(range);
		}
	};
	const optionsStatus = [
		{
			label: "All",
			value: "all",
		},
		{
			label: "Margin",
			value: "MARGIN",
		},
		{
			label: "Claim",
			value: "CLAIM",
		},
		{
			label: "Refund",
			value: "REFUND",
		},
		{
			label: "Cancel",
			value: "CANCEL",
		},
	];
	const params = React.useMemo(() => {
		let params: ParamsTransaction = {
			page: page,
			limit: LIMIT_PAGE,
		};
		if (filter.value !== "all") {
			params = {
				...params,
				type: filter.value as ParamsTransaction["type"],
			};
		}
		if (coin.value !== "all") {
			params = {
				...params,
				unit: coin.value as ParamsTransaction["unit"],
			};
		}
		if (date?.from) {
			params = {
				...params,
				from: dayjs(date.from).startOf("day").toDate(),
				to: dayjs(date.to).endOf("day").toDate(),
			};
		}
		return params;
	}, [filter, coin, date, page]);

	React.useEffect(() => {
		const handleGetTransactions = async () => {
			try {
				const res = await getTransactionsList(params);
				if (res) {
					setData(res);
				}
			} catch (err) {
				console.log(err);
			}
		};
		handleGetTransactions();
	}, [params, wallet]);
	return (
		<div>
			<div className="flex items-center w-full justify-between border-b border-divider-secondary pb-4">
				{isMobile ? (
					<FilterTransactionHistory
						optionsStatus={optionsStatus}
						optionSymbol={optionsSelect}
						status={filter}
						symbol={coin}
						handleChangeStatus={(status) => setFilter(status)}
						handleChangeSymbol={(symbol) => setCoin(symbol)}
						handleChangeDate={handleSelect}
						date={date}
					/>
				) : (
					<div className="flex w-max items-center gap-x-2">
						<Select
							onChange={(value) => setFilter(value)}
							defaultValue={[filter]}
							options={optionsStatus}
							value={filter}
							placeholder="Select status"
							className="lg:min-w-[150px]"
							size="lg"
						/>
						<Select
							onChange={(value) => setCoin(value)}
							defaultValue={[coin]}
							options={optionsSelect}
							value={coin}
							placeholder="Select token"
							className="lg:min-w-[150px]"
							size="lg"
						/>
						<div className="flex items-center justify-between gap-1 border text-typo-secondary border-divider-secondary max-h-[38px] px-2 py-2 rounded-md text-sm min-w-[220px]">
							<DateRangePicker
								range={date}
								onChange={handleSelect}
								labelClassName=""
								className="w-full"
							>
								<div className="w-full flex items-center justify-between">
									{date.from !== undefined ? (
										<Button
											onClick={() =>
												setDate({ from: undefined, to: undefined })
											}
											className="flex items-center justify-between gap-x-1 text-sm"
											size="md"
										>
											<p>
												{dayjs(date.from).format("DD/MM/YYYY")} -
												{dayjs(date.to).format("DD/MM/YYYY")}
											</p>
											{date?.from ? "x" : null}
										</Button>
									) : (
										<p className="text-sm">Select time</p>
									)}
									<CalendarIcon />
								</div>
							</DateRangePicker>
						</div>
					</div>
				)}
			</div>
			{isMobile ? (
				<div className="flex flex-col gap-y-3">
					{data.rows?.map((item) => (
						<div key={item?.id} className="p-3 border border-divider-secondary">
							<div className="flex items-center justify-between w-full pb-3 border-b border-divider-secondary">
								<p>Transaction type</p>
								<Tag
									variant={STATUS[item?.type as keyof typeof STATUS]}
									text={capitalize(item?.type)}
								/>
							</div>
							<div className="pt-3">
								<div className="flex items-center w-full justify-between">
									<p className="text-typo-secondary text-xs">Time</p>
									<p className="text-xs">
										{dayjs(item?.createdAt).format("DD/MM/YYYY HH:mm")}
									</p>
								</div>
								<div className="flex items-center w-full justify-between">
									<p className="text-typo-secondary text-xs">P-Open</p>
									<div className="flex items-center gap-x-1 text-xs">
										{formatNumber(item.amount, 2)}
										<img
											src={`/assets/images/cryptos/${item?.unit.toLowerCase()}.png`}
											className="h-6 w-6"
											alt="token"
										/>
									</div>
								</div>
							</div>
						</div>
					))}
					<Pagination
						onPreviousPage={() => {
							setPage((prev) => prev - 1);
						}}
						canPreviousPage={page === 1}
						onNextPage={() => {
							setPage((prev) => prev + 1);
						}}
						pageIndex={page}
						pageCount={Math.ceil(data.total / LIMIT_PAGE)}
						canNextPage={page >= Math.ceil(data.total / LIMIT_PAGE)}
						setPageIndex={setPage}
					/>
				</div>
			) : (
				<div className="mt-4">
					<HistoryTable data={data} page={page} setPage={setPage} />
				</div>
			)}
		</div>
	);
};

export default TransactionHistory;
