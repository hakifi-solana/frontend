import UserIcon from "@/components/common/Icons/UserIcon";
import React, { useMemo, useRef } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
// import CommonInput from '../../common/Input';
import { useIsMobile } from "@/hooks/useMediaQuery";
import {
	TParamsGetFriendList,
	getFriendList,
	getFriendStatistic,
	updateDescriptionFriend,
} from "@/apis/referral.api";
import dynamic from "next/dynamic";
import { SortingState } from "@tanstack/react-table";
import useReferralStore from "@/stores/referral.store";
import useWalletStore from "@/stores/wallet.store";
import dayjs from "dayjs";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import Select from "@/components/common/Select";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/common/Popup/Popover";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import Input from "@/components/common/Input";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import Button from "@/components/common/Button";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import Spinner from "@/components/common/Spinner";
import FilterFriendList from "../drawer/FilterFriendList";
import FriendMobileItem from "./FriendMobileItem";
import { TFriends } from "../type";
import ModalEditDescription from "../modal/ModalEditDescription";
import { useNotification } from "@/components/common/Notification";
const FriendTable = dynamic(() => import("./FriendTable"), {
	ssr: false,
	loading: () => (
		<div className="w-full mt-5 flex items-center justify-center">
			<Spinner size="large" />
		</div>
	),
});

const FriendListTab: React.FC = () => {
	const [filter, setFilter] = React.useState<{ label: string; value: string }>({
		label: "All",
		value: "all",
	});
	const [date, setDate] = React.useState<DateRange>({
		from: undefined,
		to: undefined,
	});
	const [page, setPage] = React.useState(1);
	const isMobile = useIsMobile();
	const [search, setSearch] = React.useState<string>("");
	const [friendList, setFriendList] = React.useState<{
		rows: TFriends[];
		total: number;
	}>({ rows: [], total: 0 });
	const inputRef = useRef(null);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const toast = useNotification();
	const [isOpenModalEdit, setOpenModalEditDescription, friendInfo] =
		useReferralStore((state) => [
			state.openModalEditInfo,
			state.setOpenModalEditInfo,
			state.infoFriend,
		]);
	const [desc, setDescFriend] = React.useState(friendInfo?.note || "");
	const wallet = useWalletStore((state) => state.wallet);
	const optionsFriendKind = React.useMemo(() => {
		if (wallet?.isPartner && wallet?.isPartner === true) {
			return [
				{
					label: "All",
					value: "all",
				},
				{
					label: "F1",
					value: "F1",
				},
				{
					label: "F2",
					value: "F2",
				},
				{
					label: "F3",
					value: "F3",
				},
				{
					label: "F4",
					value: "F4",
				},
			];
		} else return [];
	}, [wallet]);
	const handleSelect = (range: DateRange | undefined) => {
		if (range) {
			setDate(range);
		} else {
		}
	};
	const handleSearch = (e: any) => {
		setSearch(e.target.value);
	};
	React.useEffect(() => {
		let params: TParamsGetFriendList = {
			page: 1,
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
				invitedAtFrom: date.from.toISOString(),
				invitedAtTo: date.to.toISOString(),
			};
		}
		if (filter.value !== "all") {
			params = {
				...params,
				type: filter.value,
			};
		}
		if (search) {
			params = {
				...params,
				q: search,
			};
		}
		const fetchData = async () => {
			const res = await getFriendList(params);
			if (res) {
				setFriendList(res);
			}
		};
		fetchData();
	}, [date, sorting, search, filter, wallet, isOpenModalEdit]);
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescFriend(e.target.value);
	};
	const handleUpdateDescription = async () => {
		const params = {
			childId: friendInfo.id,
			note: desc,
		};
		try {
			const res = await updateDescriptionFriend(params);
			if (res) {
				toast.success("Update description successfully");
				setOpenModalEditDescription(false, {});
			}
		} catch (err) {
			toast.error("Update description failed");
		}
	};
	return (
		<div className="lg:px-4">
			<div className="my-4 flex items-center justify-between border-b border-divider-secondary pb-4">
				{isMobile ? (
					<FilterFriendList
						searchTX={search}
						onChangeSearchTX={handleSearch}
						date={date}
						handleChangeDate={handleSelect}
					/>
				) : (
					<div className="flex items-center gap-x-5">
						{wallet?.isPartner && wallet?.isPartner === true ? (
							<Select
								onChange={(value) => setFilter(value)}
								value={filter}
								options={optionsFriendKind}
								className="text-sm w-32"
								size="lg"
							/>
						) : null}
						<div className="flex items-center justify-between gap-1 border text-typo-secondary border-divider-secondary bg-light-2 px-2 py-1.5 rounded-md text-sm min-w-[220px]">
							<DateRangePicker
								onChange={handleSelect}
								labelClassName=""
								range={date}
								className="w-full"
							>
								<div className="flex items-center justify-between w-full">
									{date?.from ? (
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
							suffix={<SearchIcon className="w-5 h-5" />}
							onChange={handleSearch}
							ref={inputRef}
							value={search}
							wrapperClassInput="bg-transparent !border rounded-md !text-sm !border-divider-secondary"
							suffixClassName="!border-l-0"
							size="md"
							placeholder="Search"
						/>
					</div>
				)}
			</div>

			{isMobile ? (
				<div className="flex flex-col gap-y-5">
					{friendList?.rows?.map((item) => (
						<FriendMobileItem data={item as TFriends} key={item.id} />
					))}
				</div>
			) : (
				<FriendTable
					page={page}
					setPage={setPage}
					sorting={sorting}
					setSorting={setSorting}
					data={friendList}
				/>
			)}
		</div>
	);
};

export default FriendListTab;
