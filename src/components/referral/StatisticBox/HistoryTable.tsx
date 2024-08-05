import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import dayjs from "dayjs";
import ExternalIcon from "../../common/Icons/ExternalIcon";
// import Link from 'next/link';
import { Transaction } from "../type";
import DataTable from "@/components/common/DataTable";
// import TableCustom from '@/components/market/TableCustom';
// import { LIMIT_PAGE } from '../constant';
import { formatNumber } from "@/utils/format";

type TransactionType = Transaction["type"];

const typeStatus: { [K in TransactionType]: string } = {
	MARGIN: "Margin",
	CLAIM: "Claim",
	REFUND: "Refund",
	CANCEL: "Cancel",
};

type TProps = {
	data: {
		rows: Transaction[];
		total: number;
	};
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
};

const HistoryTable = ({ data, setPage, page }: TProps) => {
	const columns: ColumnDef<Transaction>[] = useMemo(
		() => [
			{
				accessorKey: "type",
				header: ({ column }) => {
					return <div className="text-sm">Transaction type</div>;
				},
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary">
							{typeStatus[row.original.type]}
						</div>
					);
				},
			},
			{
				accessorKey: "time",
				header: () => <div className="text-sm">Time</div>,
				cell: ({ row }) => {
					return (
						<div
							onClick={() =>
								window.open(
									`${process.env.NEXT_PUBLIC_VICTION_SCAN}/tx/${row.original.txhash}`,
									"_blank"
								)
							}
						>
							<a
								className="flex items-center gap-x-1 text-typo-primary"
								href={`${process.env.NEXT_PUBLIC_VICTION_SCAN}/tx/${row.original.txhash}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								{dayjs(row.original.time).format("DD/MM/YYYY - HH:mm:ss")}
								<ExternalIcon />
							</a>
						</div>
					);
				},
			},
			{
				accessorKey: "token",
				header: () => <div className="text-sm">Trading volume</div>,
				cell: ({ row }) => {
					const unitName = row.original.unit.toLowerCase();
					return (
						<div className="flex items-center justify-start gap-x-1 text-typo-primary">
							<img
								src={`/assets/images/cryptos/${unitName}.png`}
								className="h-6 w-6"
								alt="token"
							/>
							{formatNumber(row.original.amount, 2)}
						</div>
					);
				},
			},
		],
		[]
	);
	return (
		<DataTable
			columns={columns}
			data={data.rows}
			total={data.total}
			onChangePagination={(value) => setPage(value)}
		/>
	);
};

export default HistoryTable;
