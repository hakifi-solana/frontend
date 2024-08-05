"use client";

import { useMemo, useState } from "react";
import Button from "../Button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
} from "../Dropdown/Base";
import Input from "../Input";
import debounce from "lodash/debounce";
import SearchIcon from "../Icons/SearchIcon";

type TOption = { label: any; value: string; [x: string]: any };

type TProps = {
	size: "md" | "lg";
	placeholder: string | JSX.Element;
	value: string | string[];
	options: TOption[];
	onChange: (value: any) => void;
};

const SelectSearch = ({
	size,
	value,
	placeholder,
	options,
	onChange,
}: TProps) => {
	const [search, setSearch] = useState("");
	const [filteredOptions, setFilteredOptions] = useState<TOption[]>(options);

	const debouncedSearch = useMemo(
		() =>
			debounce((value) => {
				const filtered = options.filter((item) =>
					item.label.toLowerCase().includes(value.toLowerCase())
				);
				setFilteredOptions(filtered);
			}, 300),
		[options]
	);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearch(value);
		debouncedSearch(value);
	};
	return (
		<Select onValueChange={onChange}>
			<SelectTrigger size={size}>{value || placeholder}</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>
						<Input
							size={size}
							onChange={handleSearchChange}
							wrapperClassInput="rounded-md border border-divider-secondary w-full py-2"
							prefix={<SearchIcon className="w-4 h-4" />}
							placeholder="Search"
							value={search}
						/>
					</SelectLabel>
				</SelectGroup>
				<SelectGroup>
					{filteredOptions?.map((item) => (
						<SelectItem
							key={item.value}
							size={size}
							value={item.value}
							onChange={onChange}
						>
							{item.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
};

export default SelectSearch;
