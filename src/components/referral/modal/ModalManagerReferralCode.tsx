import React, { useEffect, useState } from "react";
import { useNotification } from "@/components/common/Notification";
import { getListReferralCode, updateDefaultCode } from "@/apis/referral.api";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import Copy from "@/components/common/Copy";
import Tag from "@/components/common/Tag";
import Button from "@/components/common/Button";
import ListIcons from "@/components/common/Icons/ListIcons";
import PencilIcon from "@/components/common/Icons/PencilIcon";
import useWalletStore from "@/stores/wallet.store";
import { Wallet } from "@/@type/wallet.type";
type TProps = {
	open: boolean;
	handleOpenModalEdit: () => void;
	handleOpenModalCreate: () => void;
	handleCloseModalManager: () => void;
	setInfoCode: React.Dispatch<React.SetStateAction<any>>;
	handleOpenModalListFriend: () => void;
};
const ITEMS_PER_PAGE = 4;

type Referral = {
	id: string;
	userId: string;
	code: string;
	myPercent: number;
	description: string;
	totalFriends: number;
	createdAt: string;
	updatedAt: string;
};

const ModalManagerReferralCode: React.FC<TProps> = ({
	open,
	handleOpenModalEdit,
	handleOpenModalCreate,
	handleCloseModalManager,
	setInfoCode,
	handleOpenModalListFriend,
}) => {
	const [wallet, setWallet] = useWalletStore((state) => [
		state.wallet,
		state.setWallet,
	]);
	const notifications = useNotification();
	const [listCode, setListCode] = useState<Referral[]>([]);
	useEffect(() => {
		const handleGetListCode = async () => {
			try {
				const res = await getListReferralCode();
				if (res) {
					setListCode(res);
				}
			} catch (err) {
				err;
			}
		};
		if (open === true) {
			handleGetListCode();
		}
	}, [open]);

	const handleSetdefaultMyRefCode = async (refCode: string) => {
		setWallet({ ...wallet, defaultMyRefCode: refCode } as unknown as Wallet);
		try {
			const res = await updateDefaultCode({ defaultMyRefCode: refCode });
			if (res) {
				notifications.success(`Set code ${refCode} as default successfully`);
			}
		} catch (err) {
			err;
		}
	};
	const [currentPage, setCurrentPage] = useState(0);

	const onNextPage = () => {
		setCurrentPage(currentPage + 1);
	};
	const onPrevPage = () => {
		setCurrentPage(currentPage - 1);
	};
	const { totalItems, totalPages, currentItems } = React.useMemo(() => {
		const totalItems = listCode.length;
		const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
		const startIndex = currentPage * ITEMS_PER_PAGE;
		const endIndex = startIndex + ITEMS_PER_PAGE;
		const currentItems = listCode?.slice(startIndex, endIndex);
		return { totalItems, totalPages, startIndex, endIndex, currentItems };
	}, [listCode, currentPage]);
	return (
		<Modal
			title={
				<div className="flex flex-col items-start !text-start gap-y-1">
					<p className="text-typo-primary text-2xl">Manage Referral Codes</p>
					<p className="text-sm text-typo-secondary">
						You can only create and share a maximum profit of 30
					</p>
				</div>
			}
			isOpen={open}
			onRequestClose={handleCloseModalManager}
			className="!text-typo-primary"
			contentClassName="lg:!max-w-[804px]"
			modal
		>
			<div>
				<div className="grid grid-cols-1 gap-4 py-4 lg:grid-cols-2">
					{currentItems.map((item) => (
						<div
							key={item.id}
							className="col-span-1 w-full rounded-xxl bg-support-black border border-divider-secondary rounded-md p-4 lg:min-w-[373px]"
						>
							<div className="mb-3 flex items-center justify-between">
								<Copy text={item.code} prefix={item.code} />
								{item?.code === wallet?.defaultMyRefCode ? (
									<Tag variant="success" text="Default" />
								) : (
									<Button
										className="bg-grey-2 px-3 py-1 text-sm text-white hover:bg-primary-1"
										onClick={() => handleSetdefaultMyRefCode(item.code)}
										size="md"
										variant="outline"
									>
										Set as default
									</Button>
								)}
							</div>
							<div className="flex flex-col gap-y-1">
								<div className="flex items-center justify-between">
									<div className="text-sm text-typo-secondary">
										You get/ Friends get
									</div>
									<div className="text-sm text-typo-accent">
										{item.myPercent * 100}%/{100 - item.myPercent * 100}%
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-sm text-typo-secondary">
										Referral link
									</div>
									<Copy
										text={`${process.env.NEXT_PUBLIC_APP_URL}/referral?ref=${item.code}`}
										prefix={
											<p className="max-w-[166px] truncate text-sm text-typo-primary">{`${process.env.NEXT_PUBLIC_APP_URL}/referral?ref=${item.code}`}</p>
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-sm text-typo-secondary">Friends</div>
									<div className="flex items-center gap-x-1">
										<p className="text-sm text-typo-primary">
											{item.totalFriends}
										</p>
										<button
											onClick={() => {
												setInfoCode(item);
												handleOpenModalListFriend();
												handleCloseModalManager();
											}}
											className="text-typo-secondary"
										>
											<ListIcons />
										</button>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-sm text-typo-secondary">Description</div>
									<button
										className="flex items-center gap-x-1 text-typo-secondary"
										onClick={() => {
											handleOpenModalEdit();
											handleCloseModalManager();
											setInfoCode(item);
										}}
									>
										<p className="max-w-[166px] truncate text-sm text-typo-primary">
											{item.description}
										</p>
										<PencilIcon />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
				{totalItems > ITEMS_PER_PAGE ? (
					<div className="mb-5">
						<Pagination
							onPreviousPage={onPrevPage}
							canPreviousPage={currentPage === 0}
							onNextPage={onNextPage}
							pageIndex={currentPage}
							pageCount={ITEMS_PER_PAGE}
							canNextPage={currentPage === totalPages - 1}
							setPageIndex={setCurrentPage}
							limit={ITEMS_PER_PAGE}
						/>
					</div>
				) : null}
				<div className="flex justify-end">
					<Button
						onClick={() => {
							handleOpenModalCreate();
							handleCloseModalManager();
						}}
						className="w-full"
						size="lg"
						variant="primary"
					>
						<p className="text-center w-full">Add referral code</p>
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalManagerReferralCode;
