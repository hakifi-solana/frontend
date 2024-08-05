import React, { useState } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import Link from "next/link";
// import ExternalIcon from "@/components/common/Icons/ExternalIcon";
import dayjs from "dayjs";
import { formatNumber } from "@/utils/format";
// import EditIcon from '@/components/common/Icons/EditIcon';
import useReferralStore from "@/stores/referral.store";
import ModalEditDescription from "../modal/ModalEditDescription";
import { updateDescriptionFriend } from "@/apis/referral.api";
import useWalletStore from "@/stores/wallet.store";
import { Wallet } from "@/@type/wallet.type";
import DataTable from "@/components/common/DataTable";
import { VICTION_SCAN } from "@/utils/constant";
import { substring } from "@/utils/helper";
import PencilIcon from "@/components/common/Icons/PencilIcon";
import { useNotification } from "@/components/common/Notification";
import ModalInfoFriend from "../modal/ModalInfoFriend";
import { TFriends } from "../type";

type TProps = {
	sorting: SortingState;
	setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	data: any;
};

const FriendTable: React.FC<TProps> = ({
	page,
	setPage,
	sorting,
	setSorting,
	data,
}) => {
	const [
		setOpenModalEditInfo,
		openModalEditInfo,
		friendInfo,
		setOpenWalletFriend,
		openModalFriend,
	] = useReferralStore((store) => [
		store.setOpenModalEditInfo,
		store.openModalEditInfo,
		store.infoFriend,
		store.setOpenWalletFriend,
		store.openWalletFriend,
	]);

	const wallet: Wallet = useWalletStore(
		(store) => store.wallet
	) as unknown as Wallet;
	const toast = useNotification();
	const [note, setNote] = useState("");
	const columns: ColumnDef<TFriends>[] = useMemo(
		() => [
			{
				accessorKey: "walletAddress",
				header: "Address",
				cell: ({ row }) => {
					return (
						<p className="flex items-center gap-x-1 text-sm text-typo-primary !py-0.5">
							{substring(row.original.walletAddress)}
						</p>
					);
				},
				aggregate: "link",
				meta: {
					onCellClick: (data: any) => {
						setOpenWalletFriend(true, data);
					},
				},
			},
			{
				accessorKey: "createdAt",
				header: "Add time",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary !py-0.5">
							{dayjs(row.original.createdAt).format("DD/MM/YYYY - HH:mm:ss")}
						</div>
					);
				},
				meta: {
					showArrow: true,
				},
				aggregate: "link",
			},
			{
				accessorKey: "type",
				header: "Type",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary !py-0.5">
							F{row.original.hierarchy.split(",").length}
						</div>
					);
				},
			},
			{
				accessorKey: "level",
				header: "Level",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary !py-0.5">
							{row.original.level || 1}
						</div>
					);
				},
			},
			{
				accessorKey: "totalFriends",
				header: "Friends",
				cell: ({ row }) => {
					return (
						<div className="text-typo-primary !py-0.5">
							{`${row.original.totalFriends} people`}
						</div>
					);
				},
				meta: {
					showArrow: true,
				},
			},
			{
				accessorKey: "totalCommission",
				header: "Commission",
				cell: ({ row }) => {
					return (
						<div className="flex items-center gap-x-1 text-sm text-typo-primary !py-0.5">
							<img
								src="/assets/images/cryptos/usdt.png"
								className="h-6 w-6"
								alt="usdt"
							/>
							{formatNumber(row.original.totalCommission, 2)}
						</div>
					);
				},
			},
			{
				accessorKey: "description",
				header: "Description",
				cell: ({ row }) => {
					return (
						<div className="flex max-w-[120px] items-center gap-x-1 text-sm text-typo-primary !py-0.5">
							<p className="w-4/5 truncate">{row.original.note || "----"}</p>{" "}
							<button>
								<PencilIcon />
							</button>
						</div>
					);
				},
				meta: {
					width: 120,
					onCellClick: (data: any) => {
						setOpenModalEditInfo(true, data);
					},
				},
			},
		],
		[]
	);
	const handleUpdateDescription = async () => {
		const params = {
			parentId: wallet.id,
			childId: friendInfo?.id,
			note,
		};
		try {
			await updateDescriptionFriend(params);
			toast.success("Edit description friend successfully!");
			setOpenModalEditInfo(false, friendInfo);
		} catch (err) {
			toast.error("Edit description friend error");
			return err;
		}
	};
	return (
		<>
			<DataTable
				columns={columns}
				data={data.rows || []}
				total={data.total || 0}
				setSorting={setSorting}
				sorting={sorting}
				onChangePagination={(page) => setPage(page)}
			/>
			<ModalEditDescription
				isOpen={openModalEditInfo}
				onRequestClose={() => setOpenModalEditInfo(false, friendInfo)}
				note={note}
				onChange={(e) => setNote(e.target.value)}
				handleUpdateDescription={handleUpdateDescription}
				defaultNote={friendInfo?.note}
				refNote={false}
			/>
			<ModalInfoFriend
				open={openModalFriend}
				handleClose={() => setOpenWalletFriend(false, undefined)}
			/>
		</>
	);
};

export default FriendTable;
