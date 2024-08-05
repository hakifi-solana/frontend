import Button from "@/components/common/Button";
import {
	FavoriteOutlineIcon,
	FavoriteFillIcon,
} from "@/components/common/Icons/FavoriteIcon";
import { cn } from "@/utils";
import { formatNumber } from "@/utils/format";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import TableCustom from "./TableCustom";
import { MarketPair } from "@/@type/pair.type";
import Link from "next/link";

type Props = {
	dataTable: { rows: MarketPair[]; total: number };
	isLoading: boolean;
	type: "hot" | "favorite";
	handleFavorite?: (symbol: string, isFavorite?: boolean) => void;
	symbolFavorites?: { [x: string]: boolean };
};

export default function TableFavoriteHot({
	dataTable,
	isLoading,
	type,
	handleFavorite,
	symbolFavorites,
}: Props) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const showData = useMemo(() => {
		if (sorting.length > 0) {
			let dataSort: any[] = [...dataTable.rows];
			const sort = sorting[0];
			const sortKey = sort.id;
			const sortValue = sort.desc;
			dataSort = dataSort.sort((a, b) => {
				const valueA = a[sortKey];
				const valueB = b[sortKey];

				if (typeof valueA === "number" && typeof valueB === "number") {
					return sortValue ? valueB - valueA : valueA - valueB;
				} else {
					const stringA = String(valueA).toLowerCase();
					const stringB = String(valueB).toLowerCase();
					return sortValue
						? stringB.localeCompare(stringA)
						: stringA.localeCompare(stringB);
				}
			});
			return dataSort;
		}
		return [...dataTable.rows];
	}, [sorting, dataTable]);

	const columns: ColumnDef<MarketPair>[] = useMemo(
		() => [
			{
				accessorKey: "asset",
				header: () => (<span className="text-xs">Symbol Pair</span>),
				cell: (props) => {
					return (
						<div className="flex items-center gap-x-2">
							<img
								src={props.row.original.token?.attachment}
								alt="Token Icon"
								className="w-5 h-5 rounded-full"
							/>
							<span>{props.row.original.asset}</span>
							{props.row.original.isHot && (
								<div className="font-saira text-typo-primary text-xs font-medium bg-negative-label py-0.5 px-1 rounded-sm">
									Hot
								</div>
							)}
						</div>
					);
				},
				meta: {
					width: 200,
					showArrow: true,
				},
			},
			{
				accessorKey: "category",
				header: () => (<span className="text-xs">Category</span>),
				cell: (props) => {
					return (
						<div className="text-typo-accent">
							{props.row.original.category}
						</div>
					);
				},
			},
			{
				accessorKey: "lastPrice",
				header: () => (<span className="text-xs">Market Price</span>),
				cell: (props) => {
					return `$${formatNumber(props.row.getValue("lastPrice"))}`;
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "priceChangePercent",
				header: () => (<span className="text-xs">24h Change</span>),
				cell: (props) => {
					const gap = props.row.original.priceChangePercent;
					return (
						<div
							className={cn({
								" text-negative-label": gap < 0,
								" text-positive": gap >= 0,
							})}
						>
							{gap >= 0 ? "+" : "-"}
							{formatNumber(Math.abs(gap), 2)}%
						</div>
					);
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "high",
				header: () => (<span className="text-xs">24h High</span>),
				cell: (props) => {
					return `$${formatNumber(props.row.original.high)}`;
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "low",
				header: () => (<span className="text-xs">24h Low</span>),
				cell: (props) => {
					return `$${formatNumber(props.row.original.low)}`;
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "q_covered",
				header: () => (<span className="text-xs">Total Q-Cover</span>),
				cell: (props) => {
					return `${formatNumber(props.row.original.q_covered)}`;
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "margin",
				header: () => (<span className="text-xs">Total Margin</span>),
				cell: (props) => {
					return `$${formatNumber(props.row.original.margin)}`;
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "action",
				header: "",
				cell: (props) => (
					<Button variant="primary" size="md">
						<Link href={`/buy-cover/${props.row.original.symbol}`}>
							Buy cover
						</Link>
					</Button>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[symbolFavorites, dataTable]
	);

	if (type === "favorite") {
		columns.unshift({
			accessorKey: "id",
			header: () => <FavoriteOutlineIcon />,
			cell: (props) => (
				<div
					// className="text-body-12B"
					onClick={() => {
						handleFavorite && handleFavorite(props.row.original.symbol, true);
					}}
				>
					<FavoriteFillIcon />
				</div>
			),
		});
	} else {
		columns.unshift({
			accessorKey: "id",
			header: () => <FavoriteOutlineIcon />,
			cell: (props) => {
				const isFavorite =
					symbolFavorites &&
					symbolFavorites[props.row.original.symbol] === true;
				return (
					<div
						// className="text-body-12B"
						onClick={() => {
							handleFavorite &&
								handleFavorite(props.row.original.symbol, isFavorite);
						}}
					>
						{isFavorite ? <FavoriteFillIcon /> : <FavoriteOutlineIcon />}
					</div>
				);
			},
		});
	}
	return (
		<TableCustom
			columns={columns}
			data={showData}
			sorting={sorting}
			setSorting={setSorting}
			showPagination={true}
			total={dataTable.total}
			isLoading={isLoading}
		/>
	);
}
