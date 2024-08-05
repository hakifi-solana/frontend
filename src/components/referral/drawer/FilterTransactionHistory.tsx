import FilterIcon from "@/components/common/Icons/FilterIcon";
import { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import useToggle from "@/hooks/useToggle";
import Button from "@/components/common/Button";
import CalendarDrawer from "@/components/BuyCover/Contract/Components/CalendarDrawer";
import ArrowIcons from "@/components/common/Icons/ArrowIcon";
import CheckIcon from "@/components/common/Icons/CheckIcon";
import { cn } from "@/utils";
import DrawerWrapper from "@/components/common/Drawer";
import { Calendar } from "@/components/common/Calendar/Base";
import CalendarIcon from "@/components/common/Icons/CalendarIcon";
export enum STEP_FILTER {
	BEGIN = "BEGIN",
	STATUS = "STATUS",
	SYMBOl = "START",
}
type FilterTransactionHistoryProps = {
	optionsStatus: { label: string; value: string }[];
	status: { label: string; value: string };
	handleChangeStatus: (item: { label: string; value: string }) => void;
	optionSymbol: { label: string; value: string }[];
	symbol: { label: string; value: string };
	handleChangeSymbol: (item: { label: string; value: string }) => void;
	handleChangeDate: (range: DateRange | undefined) => void;
	date: DateRange | undefined;
};

const FilterTransactionHistory = ({
	optionsStatus,
	status,
	handleChangeStatus,
	optionSymbol,
	symbol,
	handleChangeSymbol,
	handleChangeDate,
	date,
}: FilterTransactionHistoryProps) => {
	const [openTime, setOpenTime] = useState<DateRange | undefined>(undefined);
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(STEP_FILTER.BEGIN);
	const [statusBelow, setStatusBelow] = useState(status);
	const [symbolBelow, setSymbolBelow] = useState(symbol);
	const handleChangeStep = (step: STEP_FILTER) => {
		setStep(step);
	};

	const { toggle, handleToggle } = useToggle();
	const handleConfirm = () => {
		handleChangeStatus(statusBelow);
		handleChangeSymbol(symbolBelow);
		handleChangeDate(openTime);
		handleToggle();
	};
	const handleResetFilter = () => {
		setStatusBelow(status);
		setSymbolBelow(symbol);
	};
	return (
		<>
			<div className="w-full flex items-center gap-3">
				<DrawerWrapper
					isOpen={open}
					handleOpenChange={() => setOpen((prev) => !prev)}
					content={
						<CalendarDrawer
							range={date}
							onChange={(range) => {
								handleChangeDate(range);
								setOpen(false);
							}}
							title="Select time"
						/>
					}
				>
					<button className="flex items-center text-sm justify-between w-full border py-2 rounded-md text-typo-secondary px-2 border-divider-secondary">
						<p>Select status</p> <CalendarIcon />
					</button>
				</DrawerWrapper>
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

			<DrawerWrapper
				isOpen={toggle}
				handleOpenChange={handleToggle}
				prefix={
					step !== STEP_FILTER.BEGIN && (
						<Button
							size="md"
							onClick={() => handleChangeStep(STEP_FILTER.BEGIN)}
						>
							<ArrowIcons className="rotate-180" />
						</Button>
					)
				}
				content={
					<>
						{step === STEP_FILTER.BEGIN && (
							<div className="flex flex-col gap-y-5">
								<p className="text-xl text-typo-primary">Filter</p>
								<div className="flex flex-col gap-y-2">
									<p className="text-sm text-typo-primary">Status</p>
									<button
										onClick={() => handleChangeStep(STEP_FILTER.STATUS)}
										className="px-2 py-2 text-xs text-typo-secondary w-full bg-support-black border rounded-md border-divider-secondary flex items-center justify-between"
									>
										<p>{statusBelow.label || "Select status"}</p>
										<ArrowIcons />
									</button>
								</div>
								<div className="flex flex-col gap-y-2">
									<p className="text-sm text-typo-primary">Token</p>
									<button
										onClick={() => handleChangeStep(STEP_FILTER.SYMBOl)}
										className="px-2 py-2 text-xs text-typo-secondary w-full flex bg-support-black border rounded-md border-divider-secondary items-center justify-between"
									>
										<p>{symbolBelow.label || "Select token"}</p>
										<ArrowIcons />
									</button>
								</div>
								<Button
									size="lg"
									variant="primary"
									className={cn("w-full mt-8 justify-center")}
									onClick={handleConfirm}
								>
									Confirm
								</Button>
								<Button
									size="lg"
									variant="outline"
									className={cn("w-full mt-3 justify-center")}
									onClick={handleResetFilter}
								>
									Reset filter
								</Button>
							</div>
						)}
						{step === STEP_FILTER.STATUS && (
							<div className="mt-5 h-[420px] overflow-y-auto no-scrollbar">
								{optionsStatus.map((item) => {
									const isCheck = item.value === statusBelow.value;
									return (
										<p
											key={item.value}
											className=" text-start flex items-center justify-between py-3"
											onClick={() => {
												handleChangeStep(STEP_FILTER.BEGIN);
												setStatusBelow(item);
											}}
										>
											<span
												className={cn("text-sm font-normal font-saira", {
													"text-typo-secondary": isCheck === false,
													"text-typo-accent": isCheck === true,
												})}
											>
												{item.label}
											</span>
											{isCheck && <CheckIcon width={14} height={14} />}
										</p>
									);
								})}
							</div>
						)}
						{step === STEP_FILTER.SYMBOl && (
							<div className="mt-5 h-[420px] overflow-y-auto no-scrollbar">
								{optionSymbol.map((item) => {
									const isCheck = item.value === symbolBelow.value;
									return (
										<p
											key={item.value}
											className=" text-start flex items-center justify-between py-3"
											onClick={() => {
												setSymbolBelow(item);
												handleChangeStep(STEP_FILTER.BEGIN);
											}}
										>
											<span
												className={cn("text-sm font-normal font-saira", {
													"text-typo-secondary": isCheck === false,
													"text-typo-accent": isCheck === true,
												})}
											>
												{item.label}
											</span>
											{isCheck && <CheckIcon width={14} height={14} />}
										</p>
									);
								})}
							</div>
						)}
					</>
				}
			/>
		</>
	);
};

export default FilterTransactionHistory;
