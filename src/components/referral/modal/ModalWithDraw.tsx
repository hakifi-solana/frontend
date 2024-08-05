import { withDraw } from "@/apis/referral.api";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import { formatNumber } from "@/utils/format";
import React from "react";

interface ModalWithdrawProps {
	open: boolean;
	onClose: () => void;
	availableCommission: number;
	handleOpenModalLoading: () => void;
	handleCloseModalLoading: () => void;
	handleOpenModalSuccess: () => void;
	handleOpenModalError: () => void;
}

const ModalWithdraw: React.FC<ModalWithdrawProps> = ({
	open,
	onClose,
	availableCommission,
	handleOpenModalLoading,
	handleCloseModalLoading,
	handleOpenModalSuccess,
	handleOpenModalError,
}) => {
	const handleWithDraw = async () => {
		try {
			handleOpenModalLoading();
			onClose();
			const res = await withDraw({
				amount: availableCommission,
				token: "USDT",
			});
			if (res) {
				setTimeout(() => {
					handleCloseModalLoading();
					handleOpenModalSuccess();
				}, 2000);
			}
		} catch (err) {
			return setTimeout(() => {
				handleCloseModalLoading();
				handleOpenModalError();
			}, 2000);
		}
	};
	return (
		<Modal isOpen={open} onRequestClose={onClose} modal>
			<div className="flex flex-col items-center justify-center gap-y-5">
				<img
					src="/assets/images/referral/icon_with_draw.png"
					className="mb-5 aspect-square w-[124px]"
					alt="icon_with_draw"
				/>

				<p className="text-2xl">Withdraw reward</p>
				<div className="text-base text-typo-secondary">
					Quantity:
					<span className="ml-1 text-typo-primary">
						{formatNumber(availableCommission, 2)} USDT
					</span>
				</div>
				<div className="mt-5 w-full px-4">
					<Button
						className="w-full px-4 py-2 text-sm"
						onClick={handleWithDraw}
            size="lg"
            variant="primary"
					>
					<p className="w-full text-center">Confirm</p>
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default ModalWithdraw;
