import Button from "@/components/common/Button";
import { DateRangePicker } from "@/components/common/Calendar/DateRangPicker";
import FormInput from "@/components/common/FormInput";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import FilterIcon from "@/components/common/Icons/FilterIcon";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import useDebounce from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useMediaQuery";
import useInsuranceStore from "@/stores/insurance.store";
import { SortingState } from "@tanstack/react-table";
import { endOfDay, format } from "date-fns";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { useAccount } from "wagmi";
import useToggle from "@/hooks/useToggle";
import Mobile from "@/components/BuyCover/Contract/TabOpening/Filter/Mobile";

type FilterContractListProps = {
	sorting: SortingState;
};

const FilterContractList = ({ sorting }: FilterContractListProps) => {
	const isMobile = useIsMobile();
	const [asset, setAsset] = useState<string | undefined>(undefined);
	const [openTime, setOpenTime] = useState<DateRange | undefined>(undefined);
	const [expireTime, setExpireTime] = useState<DateRange | undefined>(
		undefined
	);

	const [searchTX, setSetsearchTX] = useState("");
	const debouncedValue = useDebounce(searchTX, 500);
	const onChangeSearchTX = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			setSetsearchTX(e.currentTarget.value);
		},
		[]
	);
	const { symbol } = useParams();

	const { isConnected, address } = useAccount();
	const [currentPage, getAllInsurance, hideOtherSymbol] = useInsuranceStore(
		(state) => [state.currentPage, state.getAllInsurance, state.hideOtherSymbol]
	);

	const { closedFrom, closedTo } = useMemo(() => {
		if (expireTime) {
			const closedFrom = expireTime.from;
			const closedTo =
				expireTime.to && expireTime.from?.getTime() !== expireTime.to?.getTime()
					? expireTime.to
					: endOfDay(expireTime?.from || new Date());
			return {
				closedFrom,
				closedTo,
			};
		}
		return {
			closedFrom: undefined,
			closedTo: undefined,
		};
	}, [expireTime]);

	const { createdFrom, createdTo } = useMemo(() => {
		if (openTime) {
			const createdFrom = openTime.from;
			const createdTo =
				openTime.to && openTime.from?.getTime() !== openTime.to?.getTime()
					? openTime.to
					: endOfDay(openTime.from || new Date());

			return {
				createdFrom,
				createdTo,
			};
		}
		return {
			createdFrom: undefined,
			createdTo: undefined,
		};
	}, [openTime]);

	useEffect(() => {
		if (address && isConnected) {
			const assetFilter = hideOtherSymbol
				? (symbol as string).split("USDT")[0]
				: asset || "";
			getAllInsurance({
				page: Number(currentPage || 1),
				sort:
					sorting.map((item) => `${item.desc ? "-" : ""}${item.id}`).join("") ||
					undefined,
				q: debouncedValue || undefined,
				closedFrom,
				closedTo,
				createdFrom,
				createdTo,
				asset: assetFilter,
			});
		}
	}, [
		address,
		currentPage,
		isConnected,
		sorting,
		debouncedValue,
		openTime,
		expireTime,
		hideOtherSymbol,
		asset,
	]);

	const { toggle, handleToggle } = useToggle();

	return (
		<>
			<div className="flex items-center gap-3">
				<FormInput
					size="lg"
					value={searchTX}
					onChange={onChangeSearchTX}
					wrapperClassInput="w-full"
					suffixClassName="!border-none !py-0"
					placeholder="Search by Hash ID"
					prefix={<SearchIcon className="size-4" />}
				/>
				<Button
					size="md"
					onClick={handleToggle}
					variant="outline"
					point={false}
					className="h-10 flex items-center justify-center"
				>
					<FilterIcon />
				</Button>
			</div>

			<Mobile
				isOpen={toggle}
				handleOpenStatusChange={handleToggle}
				handleChangeAsset={(asset: string) => setAsset(asset)}
				handleChangeOpenTime={setOpenTime}
				handleChangeExpireTime={setExpireTime}
			/>
		</>
	);
};

export default FilterContractList;
