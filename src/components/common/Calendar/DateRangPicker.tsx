"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";

import Button from "@/components/common/Button";
import { Calendar } from "@/components/common/Calendar/Base";
import { useIsMobile } from "@/hooks/useMediaQuery";
import useToggle from "@/hooks/useToggle";
import clsx from "clsx";
import DrawerWrapper from "../Drawer";
import CalendarIcon from "../Icons/CalendarIcon";
import Popup from "../Popup";

type DateRangePickerProps = {
	children?: React.ReactNode;
	onChange: (range: DateRange) => void;
	labelClassName?: string;
	className?: string;
	open?: boolean;
	range?: DateRange;
};

export const DateRangePicker = React.forwardRef<
	HTMLButtonElement,
	DateRangePickerProps
>(({ children, onChange, className, labelClassName, range }, forwardedRef) => {
	const isMobile = useIsMobile();
	const [selectedDate, setSelectedDate] = React.useState<DateRange | undefined>(
		range
	);
	const { toggle, handleToggle } = useToggle();
	const handleOnChangeStatus = () => {
		handleToggle();
		if (!range?.from && !range?.to) {
			setSelectedDate(undefined);
		}
	};
	const handleOnChangeDate = () => {
		onChange(selectedDate as DateRange);
		handleToggle();
	};

	return (
		<div className={clsx("gap-2", className)}>
			{!isMobile ? (
				<Popup
					isOpen={toggle}
					handleOnChangeStatus={handleOnChangeStatus}
					classContent="bg-background-tertiary border-divider-secondary rounded-md p-5"
					content={
						<Calendar
							formatters={
								{
									// formatCaption: (caption) => `W${caption}`,
								}
							}
							initialFocus
							mode="range"
							defaultMonth={selectedDate?.from}
							selected={selectedDate}
							onSelect={(date) => setSelectedDate(date as DateRange)}
							numberOfMonths={1}
							footer={
								<Button
									size="lg"
									variant="primary"
									className="justify-center w-full mt-8"
									onClick={handleOnChangeDate}
								>
									Confirm
								</Button>
							}
						/>
					}
				>
					{children ? (
						children
					) : (
						<Button size="lg" ref={forwardedRef}>
							<CalendarIcon />
						</Button>
					)}
				</Popup>
			) : (
				<DrawerWrapper
					title="Pick a range"
					classNameTitle=""
					isOpen={toggle}
					handleOpenChange={handleToggle}
					content={
						<section className="pt-0 w-full mt-5">
							<Calendar
								initialFocus
								mode="range"
								defaultMonth={selectedDate?.from}
								selected={selectedDate}
								onSelect={(date) => setSelectedDate(date as DateRange)}
								numberOfMonths={1}
								footer={
									<Button
										size="lg"
										variant="primary"
										className="justify-center w-full"
										onClick={handleOnChangeDate}
									>
										Confirm
									</Button>
								}
							/>
						</section>
					}
				>
					{children ? (
						children
					) : (
						<Button size="md" ref={forwardedRef}>
							<CalendarIcon />
						</Button>
					)}
				</DrawerWrapper>
			)}
		</div>
	);
});
