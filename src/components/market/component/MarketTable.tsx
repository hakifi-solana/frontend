"use client";

import FormInput from "@/components/common/FormInput";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import TableTabs from "@/components/common/TableTabs";
import DrawerFilterMarket from "./Drawer/DrawerFilterMarket";
import HotIcon from "@/components/common/Icons/HotIcon";
import ConnectWalletMarket from "./ConnectWalletMarket";
import CoinListPolicy from "./CoinListPolicy";
import TablePolicy from "./TablePolicy";
import useWalletStore from "@/stores/wallet.store";
import { useIsMobile } from "@/hooks/useMediaQuery";
import TabFavorite from "./TabFavorite";
import TabHot from "./TabHot";
import { useState } from "react";
import { useNotification } from "@/components/common/Notification";
import { MarketPair } from "@/@type/pair.type";
import useMarketStore from "@/stores/market.store";
import debounce from "lodash.debounce";
import { useAccount } from "wagmi";
import { cn } from "@/utils";

type TKeys = "favorite" | "hot" | "policy";
type TFilter = Record<
	TKeys,
	{ categories: any[]; sort: string; sortType: string; search: string }
>;
type TSort = Record<
	TKeys,
	{ label: string; value: keyof MarketPair } | undefined
>;
type TCategories = Record<TKeys, any[] | undefined>;

export default function MarketTable() {
	const [wallet] = useWalletStore((state) => [state.wallet]);
	const isMobile = useIsMobile();
	const { isConnected } = useAccount();
	const [tabs] = useMarketStore((state) => [state.tabs]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalCategory, setOpenModalCategory] = useState(false);
	const [openModalSort, setOpenModalSort] = useState(false);
	const [categories, setCategories] = useState<TCategories>({
		favorite: undefined,
		hot: undefined,
		policy: undefined,
	});
	const [openSortType, setOpenSortType] = useState(false);
	const [search, setSearch] = useState<string>("");
	const [sort, setSort] = useState<TSort>({
		favorite: undefined,
		hot: undefined,
		policy: undefined,
	});
	const [sortType, setSortType] = useState<TSort>({
		favorite: undefined,
		hot: undefined,
		policy: undefined,
	});
	const [filter, setFilter] = useState<TFilter>({
		favorite: {
			categories: [],
			sort: "",
			sortType: "",
			search: "",
		},
		hot: {
			categories: [],
			sort: "",
			sortType: "",
			search: "",
		},
		policy: {
			categories: [],
			sort: "",
			sortType: "",
			search: "",
		},
	});
	const toast = useNotification();
	const handleChooseCategories = (category: any) => {
		setOpenModalCategory(false);
		const isCategoryExist = categories[tabs]?.some(
			(item) => item.value === category.value
		);

		if (isCategoryExist) {
			const updatedList = categories[tabs]?.filter(
				(item) => item.value !== category.value
			);
			setCategories({ ...categories, [tabs]: updatedList });
		} else {
			const newList = [...(categories[tabs] || []), category];
			setCategories({ ...categories, [tabs]: newList });
		}
	};
	const handleChooseSort = (sortItem: any) => {
		setOpenModalSort(false);
		if (sort[tabs] && sort[tabs]?.value === sortItem.value) {
			setSort({ ...sort, [tabs]: undefined });
		} else {
			setSort({ ...sort, [tabs]: sortItem });
		}
	};
	const handleChooseSortType = (sortTypeItem: any) => {
		setOpenSortType(false);
		if (sortType[tabs] && sortType[tabs]?.value === sortTypeItem.value) {
			setSortType({ ...sortType, [tabs]: undefined });
		} else {
			setSortType({ ...sortType, [tabs]: sortTypeItem });
		}
	};
	const handleResetFilter = () => {
		setSort({ favorite: undefined, hot: undefined, policy: undefined });
		setCategories({ favorite: undefined, hot: undefined, policy: undefined });
		setSortType({
			favorite: undefined,
			hot: undefined,
			policy: undefined,
		});
	};
	const handleConfirm = () => {
		if (sortType !== undefined) {
			setFilter({
				...filter,
				[tabs]: {
					categories: categories[tabs]?.map((item) => item.value) ?? [],
					sort: sort[tabs]?.value || "",
					sortType: sortType[tabs]?.value,
					search,
				},
			});
			setOpenModal(false);
		} else {
			toast.error("Please choose sort type");
		}
	};
	const debouncedHandleSearch = debounce((value) => {
		setFilter((prevFilter: TFilter) => {
			const updatedFilter: TFilter = {
				favorite: { ...prevFilter.favorite, search: value },
				hot: { ...prevFilter.hot, search: value },
				policy: { ...prevFilter.policy, search: value },
			};
			return updatedFilter;
		});
	}, 300);
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
		debouncedHandleSearch(e.target.value);
	};
	return (
		<section className="mt-6 mb-[60px] lg:my-10">
			<h3 className="text-xl lg:text-[28px] font-normal font-determination text-typo-accent mb-4">
				MARKET
			</h3>
			<div
				className={cn(
					"border border-solid border-divider-secondary p-4 rounded-md space-y-2",
					{ "bg-background-tertiary": isConnected === false }
				)}
			>
				<TableTabs
					filterTable={
						<div className="h-full flex gap-x-3 w-full lg:justify-start items-center">
							<FormInput
								size={"md"}
								placeholder="Search token"
								prefix={<SearchIcon className="h-4 w-4" />}
								wrapperClassName="text-sm flex-1 lg:flex-none !py-2 lg:w-max w-full"
								onChange={handleSearch}
								value={search}
								wrapperClassInput="!py-1 w-full"
							/>
							{isMobile && (
								<div className="h-8 w-8 flex items-center justify-center border border-solid border-divider-secondary rounded-sm">
									<DrawerFilterMarket
										isOpen={openModal}
										handleClose={() => setOpenModal(false)}
										handleOpenCategory={() => setOpenModalCategory(true)}
										handleOpenSort={() => setOpenModalSort(true)}
										sort={sort[tabs]}
										categories={categories[tabs] ?? []}
										openCategory={openModalCategory}
										handleCloseCategories={() => setOpenModalCategory(false)}
										handleChooseCategories={handleChooseCategories}
										openSort={openModalSort}
										handleCloseSort={() => setOpenModalSort(false)}
										handleChooseSort={handleChooseSort}
										openSortType={openSortType}
										sortType={sortType[tabs]}
										handleOpenSortType={() => setOpenSortType(true)}
										handleCloseSortType={() => setOpenSortType(false)}
										handleChooseSortType={handleChooseSortType}
										handleOpen={() => setOpenModal(true)}
										handleResetFilter={handleResetFilter}
										handleConfirm={handleConfirm}
									/>
								</div>
							)}
						</div>
					}
					listTab={[
						{ value: "favorite", title: "FAVORITE" },
						{ value: "hot", title: "HOT", prefix: <HotIcon /> },
						{ value: "policy", title: "POLICY" },
					]}
					listContent={[
						{
							value: "favorite",
							children:
								wallet && wallet.walletAddress ? (
									//   isMobile ? (
									//     <CoinListFavoriteHot listCoin={dataSample} />
									//   ) : (
									//     <TableFavoriteHot />
									//   )
									<TabFavorite filter={filter[tabs]} />
								) : (
									<ConnectWalletMarket />
								),
						},
						{
							value: "hot",
							children:
								wallet && wallet.walletAddress ? (
									//   isMobile ? (
									//     <CoinListFavoriteHot listCoin={dataSample} />
									//   ) : (
									//     <TableFavoriteHot />
									//   )
									<TabHot filter={filter[tabs]} />
								) : (
									<ConnectWalletMarket />
								),
						},
						{
							value: "policy",
							children:
								wallet && wallet.walletAddress ? (
									isMobile ? (
										<CoinListPolicy listCoin={[]} />
									) : (
										<TablePolicy />
									)
								) : (
									<ConnectWalletMarket />
								),
						},
					]}
				/>
			</div>
		</section>
	);
}
