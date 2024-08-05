import React, { useEffect, useState } from "react";
import ModalWithdraw from "../modal/ModalWithDraw";
import { getWalletStatistic } from "@/apis/referral.api";
import { formatNumber } from "@/utils/format";
import ModalSuccess from "@/components/common/Modal/ModalSuccess";
import ModalError from "@/components/common/Modal/ModalError";
import ModalLoadingWithDraw from "../modal/ModalLoadingWithDraw";
import Button from "@/components/common/Button";
import { WalletStatistic } from "../type";

const ReferralStatistic: React.FC = () => {
	const [openWithDraw, setOpenWithDraw] = React.useState<boolean>(false);
	const [data, setData] = useState<Partial<WalletStatistic>>({});
	const [openModalLoading, setOpenModalLoading] = React.useState(false);
	const [openModalSuccess, setOpenModalSuccess] = React.useState(false);
	const [openModalError, setOpenModalError] = React.useState(false);
	useEffect(() => {
		const handleGetCommissionStats = async () => {
			try {
				const res = await getWalletStatistic("USDT").then(
					(response) => response
				);
				if (res) {
					setData(res);
				}
			} catch (err) {
				return err;
			}
		};
		handleGetCommissionStats();
	}, [openModalSuccess, openModalError]);
	return (
		<div className="my-5">
			<div className="flex w-full items-center justify-between">
				<p className="text-base text-typo-primary">Reward statistics</p>
			</div>
			<div className="mt-5 flex w-full flex-col gap-5">
				<div className="flex items-center justify-between w-full bg-white shadow-md">
					<p className="text-sm text-typo-secondary">Total</p>
					<p className="flex items-center gap-x-1 text-sm text-typo-primary">
						{formatNumber(data.totalCommission || 0, 2)}
						<img src="/assets/images/cryptos/usdt.png" className="h-6 w-6" />
					</p>
				</div>
				<div className="flex items-center justify-between bg-white shadow-md">
					<p className="text-sm text-typo-secondary">Withdrawn</p>
					<p className="flex items-center gap-x-1 text-sm text-typo-primary">
						{formatNumber(
							Number(data?.totalCommission) - Number(data.balance) || 0,
							2
						)}
						<img src="/assets/images/cryptos/usdt.png" className="h-6 w-6" />
					</p>
				</div>
				<div className="flex items-center w-full justify-between">
					<p className="text-sm text-typo-secondary">Available</p>
					<p className="flex items-center gap-x-1 text-sm text-typo-primary">
						{formatNumber(data.balance || 0, 2)}
						<img src="/assets/images/cryptos/usdt.png" className="h-6 w-6" />
					</p>
				</div>
			{/* <Button
				size="lg"
				variant="primary"
				className="px-4 py-2 !text-center w-full !flex !items-center"
				onClick={() => setOpenWithDraw(true)}
			>
				<p className="w-full text-center">Withdraw</p>
			</Button> */}
			</div>
			<ModalWithdraw
				open={openWithDraw}
				onClose={() => setOpenWithDraw(false)}
				availableCommission={data.balance || 0}
				handleCloseModalLoading={() => setOpenModalLoading(false)}
				handleOpenModalError={() => setOpenModalError(true)}
				handleOpenModalSuccess={() => setOpenModalSuccess(true)}
				handleOpenModalLoading={() => setOpenModalLoading(true)}
			/>
			<ModalSuccess
				open={openModalSuccess}
				handleClose={() => setOpenModalSuccess(false)}
				successMessage={
					<div className="flex flex-col gap-y-5 text-center items-center">
						<p className="text-2xl">Withdraw reward successful</p>
						<p className="text-typo-secondary">
							You have successfully withdrawn your reward
							<span className="text-typo-primary">
								{formatNumber(data.balance, 2)} USDT
							</span>
						</p>
						<Button
							size="lg"
							variant="primary"
							className="px-4 py-2 !text-center w-full !flex !items-center"
							onClick={() => setOpenWithDraw(true)}
						>
							<p className="w-full text-center">Try again</p>
						</Button>
					</div>
				}
				footer={<span></span>}
			/>
			<ModalError
				open={openModalError}
				handleClose={() => setOpenModalError(false)}
				errorMessage={
					<div className="flex flex-col gap-y-5 text-center items-center">
						<p className="text-2xl">Withdraw reward unsuccessful</p>
						<p className="text-typo-secondary">
							Reason: Network connection error
						</p>
						<Button
							size="lg"
							variant="primary"
							className="px-4 py-2 !text-center w-full !flex !items-center"
							onClick={() => setOpenWithDraw(true)}
						>
							<p className="w-full text-center">Try again</p>
						</Button>
					</div>
				}
				footer={<span></span>}
			/>
			<ModalLoadingWithDraw
				open={openModalLoading}
				onClose={() => setOpenModalLoading(false)}
			/>
		</div>
	);
};

export default ReferralStatistic;
