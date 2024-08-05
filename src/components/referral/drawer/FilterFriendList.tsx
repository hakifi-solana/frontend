import { DateRange } from "react-day-picker";
import useToggle from "@/hooks/useToggle";
import CalendarDrawer from "@/components/BuyCover/Contract/Components/CalendarDrawer";
import DrawerWrapper from "@/components/common/Drawer";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
import FormInput from "@/components/common/FormInput";
import SearchIcon from "@/components/common/Icons/SearchIcon";

type FilterFriendListProps = {
	searchTX: string;
	onChangeSearchTX: (e: React.FormEvent<HTMLInputElement>) => void;
	handleChangeDate: (range: DateRange | undefined) => void;
	date: DateRange | undefined;
};

const FilterFriendList = ({
	handleChangeDate,
	date,
	searchTX,
	onChangeSearchTX,
}: FilterFriendListProps) => {
	const { toggle, handleToggle } = useToggle();

	return (
		<div className="w-full flex items-center gap-x-3">
			<FormInput
				size="lg"
				value={searchTX}
				onChange={onChangeSearchTX}
				wrapperClassInput="w-full"
				suffixClassName="!border-none !py-0"
				placeholder="Search by wallet address"
				prefix={<SearchIcon className="size-4" />}
			/>
			<DrawerWrapper
				isOpen={toggle}
				handleOpenChange={handleToggle}
				content={
					<CalendarDrawer
						range={date}
						onChange={(range) => {
							handleChangeDate(range);
							handleToggle();
						}}
						title="Select time"
					/>
				}
			>
				<button className="flex items-center text-sm justify-between w-max border py-1.5 rounded-md text-typo-secondary px-2 border-divider-secondary">
					<CalendarIcon />
				</button>
			</DrawerWrapper>
		</div>
	);
};

export default FilterFriendList;
