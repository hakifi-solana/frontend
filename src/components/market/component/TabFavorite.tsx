import { useIsMobile } from "@/hooks/useMediaQuery";
import CoinListFavoriteHot from "./CoinListFavoriteHot";
import TableFavoriteHot from "./TableFavoriteHot";
import { useEffect, useMemo, useState } from "react";
import { deletePairFavorites, getPairFavorites } from "@/apis/pair.api";
import { useAccount } from "wagmi";
import { MarketPair } from "@/@type/pair.type";

type TProps = {
	filter: {
		categories: string[];
		sort: string;
		sortType: string;
		search: string;
	};
};

const TabFavorite = ({ filter }: TProps) => {
	const isMobile = useIsMobile();
	const { isConnected } = useAccount();
	const [data, setData] = useState<{ rows: MarketPair[]; total: number }>();
	const [isLoading, setLoading] = useState<boolean>(true);

	const fetchData = async () => {
		const params = {
			limit: 99,
			page: 1,
			includePrice: true,
			//   q: search.like,
		};
		try {
			await getPairFavorites(params).then((res: any) => {
				setData(res);
				setLoading(false);
			});
		} catch (error) {}
	};

	const handleDeleteFavorites = async (symbol: string) => {
		try {
			await deletePairFavorites(symbol);
			fetchData();
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		if (isConnected) {
			fetchData();
		}
	}, [isConnected]);

	const listFavorite = useMemo(() => {
		const isFilter =
			Object.values(filter).filter((item) => item !== undefined).length > 0;

		let dataFilter = data?.rows;

		if (isFilter) {
			if (filter.categories.length > 0) {
				dataFilter = data?.rows.filter((item) =>
					filter.categories.includes(item.category)
				);
			}
			if (filter?.search.length > 0) {
				dataFilter = data?.rows.filter((item) =>
					item.asset.toLowerCase().includes(filter.search.toLowerCase())
				);
			}
			if (filter.sortType) {
				if (filter.sort === "asset") {
					dataFilter?.sort((a, b) => {
						const sortValueA = String(a[filter.sort as keyof MarketPair]);
						const sortValueB = String(b[filter.sort as keyof MarketPair]);
						if (filter.sortType === "asc") {
							return sortValueA.localeCompare(sortValueB);
						} else if (filter.sortType === "desc") {
							return sortValueB.localeCompare(sortValueA);
						}

						return 0;
					});
				} else {
					dataFilter?.sort((a, b) => {
						const sortValueA = Number(a[filter.sort as keyof MarketPair]);
						const sortValueB = Number(b[filter.sort as keyof MarketPair]);
						if (filter.sortType === "asc") {
							return sortValueA - sortValueB;
						} else if (filter.sortType === "desc") {
							return sortValueB - sortValueA;
						}

						return 0;
					});
				}
			}
		}

		return dataFilter;
	}, [data, filter]);
	const dataSearch = useMemo(() => {
		if (filter?.search) {
			const arr =
				data?.rows.filter((item) =>
					item.asset.toLowerCase().includes(filter.search.toLowerCase())
				) || [];
			return {
				rows: arr,
				total: arr.length || 0,
			};
		}
		return data;
	}, [filter, data]);
	return (
		<>
			{data?.rows.length === 0 ? (
				<div className="flex flex-col items-center">
					<img
						src="/assets/images/icons/noData_icon.png"
						className="w-20 h-20 lg:w-[124px] lg:h-[124px]"
						alt="No Data"
					/>
					<p className="text-sm lg:text-base font-medium font-saira text-typo-secondary text-center">
						You haven't added any cryptocurrency pairs yet. <br />
						Start now by adding popular trading pairs to your favorites.
					</p>
				</div>
			) : isMobile ? (
				<CoinListFavoriteHot
					listToken={{
						rows: listFavorite || [],
						total: listFavorite?.length || 0,
					}}
					type="favorite"
					handleFavorite={handleDeleteFavorites}
					isLoading={isLoading}
				/>
			) : (
				<TableFavoriteHot
					dataTable={dataSearch || { rows: [], total: 0 }}
					isLoading={isLoading}
					type="favorite"
					handleFavorite={handleDeleteFavorites}
				/>
			)}
		</>
	);
};

export default TabFavorite;
