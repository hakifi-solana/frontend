import FilterIcon from "@/components/common/Icons/FilterIcon";
import ListOptionFilterMarket from "../ListOptionFilterMarket";
import DrawerFilterWrapper from "@/components/common/Drawer";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
const dataCategory = [
	{
		label: "Layer 1",
		value: "layer1",
		isCheck: false,
	},
	{
		label: "Layer 2",
		value: "layer2",
		isCheck: true,
	},
	{
		label: "Dex",
		value: "dex",
		isCheck: false,
	},
	{
		label: "Storage",
		value: "storage",
		isCheck: true,
	},
	{
		label: "Gaming",
		value: "gaming",
		isCheck: false,
	},
	{
		label: "Wallet",
		value: "wallet",
		isCheck: false,
	},
	{
		label: "NFT",
		value: "nft",
		isCheck: false,
	},
	{
		label: "Audit",
		value: "audit",
		isCheck: false,
	},
	{
		label: "Pow",
		value: "pow",
		isCheck: false,
	},
	{
		label: "Pos",
		value: "pos",
		isCheck: false,
	},
	{
		label: "Meta Verse",
		value: "metaVerse",
		isCheck: false,
	},
	{
		label: "Lending/Borrowing",
		value: "lendingBorrowing",
		isCheck: false,
	},
	{
		label: "Defi",
		value: "defi",
		isCheck: false,
	},
	{
		label: "Payment",
		value: "payment",
		isCheck: false,
	},
	{
		label: "LSD",
		value: "lsd",
		isCheck: false,
	},
];

type TProps = {
	isOpen: boolean;
	handleOpen: () => void;
	handleClose: () => void;
	handleChooseCategories: (category: any) => void;
	categories: any[];
};

const CategoriesDrawer = ({
	isOpen,
	handleOpen,
	handleClose,
	handleChooseCategories,
	categories,
}: TProps) => {
	return (
		<DrawerFilterWrapper
			isOpen={isOpen}
			handleOpenChange={handleOpen}
			classNameTitle="!text-title-24 text-typo-primary"
			title={isOpen ? "" : "Filter by"}
			content={
				<ListOptionFilterMarket
					listOption={dataCategory}
					handleChoose={handleChooseCategories}
					title="Category"
					listChoose={categories}
				/>
			}
		>
			<div
				onClick={() => handleOpen()}
				className="text-typo-secondary text-xs font-medium font-saira flex items-center justify-between p-3 border border-solid border-divider-secondary rounded"
			>
				{categories?.length > 0 ? (
					<div className="flex w-80 overflow-x-auto no-scrollbar ">
						{categories.map((option, index, arr) => (
							<span key={index} className="mr-1 min-w-max">
								{option.label}
								{index !== arr.length - 1 && ","}
							</span>
						))}
					</div>
				) : (
					"Select categories"
				)}
				<ChevronIcon />
			</div>
		</DrawerFilterWrapper>
	);
};

export default CategoriesDrawer;
