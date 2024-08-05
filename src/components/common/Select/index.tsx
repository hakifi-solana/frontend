import React from "react";

import Select, {
	StylesConfig,
	OptionProps,
	components,
	DropdownIndicatorProps,
} from "react-select";
import TickIcon from "../Icons/TickIcon";
import clsx from "clsx";
import ChevronIcon from "../Icons/ChevronIcon";

const DropdownIndicator = (props: DropdownIndicatorProps<any, true>) => {
	return (
		<components.DropdownIndicator {...props}>
			<ChevronIcon />
		</components.DropdownIndicator>
	);
};
const Option = (props: OptionProps<any>) => {
	const {
		children,
		className,
		cx,
		isDisabled,
		isFocused,
		isSelected,
		innerRef,
		innerProps,
	} = props;
	return (
		<div
			ref={innerRef}
			className={cx(
				{
					option: true,
					"option--is-disabled": isDisabled,
					"option--is-focused !bg-background-secondary": isFocused,
					"option--is-selected !text-typo-accent": isSelected,
				},
				className,
				"bg-background-tertiary text-typo-secondary"
			)}
			{...innerProps}
		>
			<div
				className={clsx(
					{
						"!text-typo-accent": isSelected,
						"bg-background-secondary": isFocused,
					},
					"flex items-center gap-x-2 p-2 text-typo-primary"
				)}
			>
				{children} {isSelected ? <TickIcon /> : null}
			</div>
		</div>
	);
};
type TProps = {
	options: any[];
	defaultValue?: any[];
	isMultiple?: boolean;
	isClearable?: boolean;
	isSearchable?: boolean;
	onChange?: (value: any) => void;
	className?: string;
	value: any | any[];
	size?: "md" | "lg";
	placeholder?: string;
};

const SelectCustom = ({
	options,
	defaultValue,
	isMultiple = false,
	isClearable = false,
	isSearchable = false,
	onChange,
	className,
	value,
	size = "md",
	placeholder,
}: TProps) => {
	const styles: StylesConfig = {
		option: (base) => {
			return {
				...base,
				height: "100%",
			};
		},
		singleValue: (base) => ({
			...base,
			background: "#111314",
			color: "#a1a1a1",
			display: "flex",
		}),
		valueContainer: (base) => ({
			...base,
			background: "#111314",
			color: "#a1a1a1",
			width: "100%",
			borderTopLeftRadius: "4px",
			borderBottomLeftRadius: "4px",
			padding: "4px",
			height: size === "md" ? "24px" : "36px",
			display: "flex",
			alignItems: "center",
		}),
		control: (state) => {
			return {
				border: "1px solid #3F3F3F",
				display: "flex",
				borderRadius: "4px",
			};
		},
		container: (base) => ({
			...base,
			backgroundColor: "#3F3F3F",
			borderRadius: "4px",
		}),
		dropdownIndicator: (base) => ({
			...base,
			color: "#3f3f3f",
		}),
		indicatorSeparator: (base) => ({
			...base,
			color: "#3f3f3f",
			backgroundColor: "transparent",
		}),
		placeholder: (base) => ({}),
		menu: (base) => ({
			...base,
			padding: 4,
			backgroundColor: "#111314",
			color: "#a1a1a1",
		}),
	};

	return (
		<Select
			closeMenuOnSelect={true}
			components={{ Option, DropdownIndicator }}
			defaultValue={defaultValue}
			isMulti={isMultiple}
			options={options}
			isClearable={isClearable}
			styles={styles}
			className={clsx("!border-0 !bg-background-tertiary", className)}
			isSearchable={isSearchable}
			onChange={onChange}
			value={value}
			placeholder={placeholder}
		/>
	);
};

export default SelectCustom;
