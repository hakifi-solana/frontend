import FormInput from "@/components/common/FormInput";
import CheckIcon from "@/components/common/Icons/CheckIcon";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import { cn } from "@/utils";

type Props = {
	listOption: any[];
	handleChoose: any;
	title: string;
	listChoose: any[];
};

export default function ListOptionFilterMarket({
	listOption,
	handleChoose,
	title,
	listChoose,
}: Props) {
	const handleChange = (value: any) => {
		handleChoose(value);
	};
	return (
		<div>
			<h3 className=" text-xl font-medium text-typo-primary font-saira py-5">
				{title}
			</h3>
			<FormInput
				size="md"
				placeholder="Search"
				prefix={<SearchIcon className="h-4 w-4" />}
				wrapperClassName="text-sm flex-1 lg:flex-none w-full"
			/>
			<div className="mt-5 h-[420px] overflow-y-auto no-scrollbar">
				{listOption.map((item) => {
					const isCheck =
						listChoose?.length > 0
							? listChoose.filter((list) => list.value === item.value).length >
							  0
							: false;
					return (
						<p
							key={item.value}
							className=" text-start flex items-center justify-between py-3"
							onClick={() => {
								handleChange(item);
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
		</div>
	);
}
