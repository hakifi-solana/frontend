import { useIsMobile } from "@/hooks/useMediaQuery";
import CoinListFavoriteHot from "./CoinListFavoriteHot";
import TableFavoriteHot from "./TableFavoriteHot";
import { useAccount } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import { MarketPair } from "@/@type/pair.type";
import {
	addPairFavorites,
	deletePairFavorites,
	getAllFavoritesSymbol,
	getAllMarketPair,
} from "@/apis/pair.api";

type TProps = {
	filter: {
		categories: string[];
		sort: string;
		sortType: string;
		search: string;
	};
};

export default function TabHot({ filter }: TProps) {
	const isMobile = useIsMobile();
	const { isConnected } = useAccount();
	const [data, setData] = useState<MarketPair[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [symbolFavorites, setSymbolFavorites] = useState<{
		[x: string]: boolean;
	}>({});

	const fetchData = async () => {
		const params = {
			limit: 10,
			page: 1,
			includePrice: true,
			//   q: search.like,
		};
		try {
			await getListFavorites();
			await getAllMarketPair().then((res) => {
				if (res) {
					setData(res);
					setIsLoading(false);
				}
			});
		} catch (error) {}
	};

	const getListFavorites = async () => {
		try {
			const res = await getAllFavoritesSymbol();
			if (res) {
				const parseData = res.reduce((obj: { [x: string]: boolean }, item) => {
					obj[item] = true;
					return obj;
				}, {});
				setSymbolFavorites(parseData);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	const handleFavorite = async (symbol: string, isFavorite?: boolean) => {
		if (isConnected === false) return;
		else {
			if (isFavorite) {
				delete symbolFavorites[symbol];
			} else {
				symbolFavorites[symbol] = true;
			}
			setSymbolFavorites({ ...symbolFavorites });
			try {
				isFavorite === true
					? await deletePairFavorites(symbol)
					: await addPairFavorites(symbol);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}
	};
	useEffect(() => {
		if (isConnected) {
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isConnected]);
	const listToken = useMemo(() => {
		const isFilter =
			Object.values(filter).filter((item) => item !== undefined).length > 0;

		let dataFilter = data;

		if (isFilter) {
			if (filter.categories.length > 0) {
				dataFilter = data?.filter((item) =>
					filter.categories.includes(item.category)
				);
			}
			if (filter?.search.length > 0) {
				dataFilter = data?.filter((item) =>
					item.asset.toLowerCase().includes(filter.search.toLowerCase())
				);
			}
			if (filter.sortType) {
				if (filter?.sort === "totalBullBear") {
					dataFilter?.sort((a, b) => {
						const aBullBear = a.totalBull + a.totalBear;
						const bBullBear = b.totalBull + b.totalBear;
						if (filter.sortType === "asc") {
							return Number(aBullBear) - Number(bBullBear);
						} else if (filter.sortType === "desc") {
							return Number(bBullBear) - Number(aBullBear);
						}
						return 0;
					});
				}
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
		if (data?.length > 0) {
			if (filter?.search) {
				const arr =
					data?.filter((item) =>
						item.asset.toLowerCase().includes(filter.search.toLowerCase())
					) || [];
				return {
					rows: arr,
					total: arr.length || 0,
				};
			}
			return { rows: data || [], total: data?.length || 0 };
		}
		return { rows: [], total: 0 };
	}, [filter.search, data]);
	return (
		<>
			{isMobile ? (
				<CoinListFavoriteHot
					listToken={{ rows: listToken || [], total: listToken?.length || 0 }}
					symbolFavorites={symbolFavorites}
					type="hot"
					handleFavorite={handleFavorite}
					isLoading={isLoading}
				/>
			) : (
				<TableFavoriteHot
					dataTable={dataSearch}
					isLoading={isLoading}
					type="hot"
					handleFavorite={handleFavorite}
					symbolFavorites={symbolFavorites}
				/>
			)}
		</>
	);
}
