import { Wallet } from "@/@type/wallet.type";
import Modal from "@/components/common/Modal";
import useWalletStore from "@/stores/wallet.store";
import { formatNumber } from "@/utils/format";
import { USDT_ADDRESS } from "@/web3/constants";
import { ArrowLeft, CopyIcon } from "lucide-react";
import React from "react";
import { Address, useAccount, useBalance } from "wagmi";

import { copyToClipboard, substring } from "@/utils/helper";
import { useNotification } from "@/components/common/Notification";
import clsx from "clsx";
import Select from "@/components/common/Select";
interface ModalInfoUserProps {
	isOpen: boolean;
	onRequestClose: () => void;
	handleOpenModalEdit?: () => void;
}
const assets = [
	{
		className: "text-primary",
		contractAddress: USDT_ADDRESS,
		iconUrl: "/assets/images/cryptos/usdt.png",
		symbol: "USDT",
		assetImage: "https://tether.to/images/logoMarkGreen.svg",
	},
	{
		className: "text-vnst",
		contractAddress: undefined,
		iconUrl: "/assets/images/cryptos/vic.png",
		symbol: "VIC",
	},
];
const ModalInfoUser: React.FC<ModalInfoUserProps> = ({
	isOpen,
	onRequestClose,
	handleOpenModalEdit,
}) => {
	const { address, isConnected, connector } = useAccount();
	const notification = useNotification();
	const [contractAddress, setContractAddress] = React.useState<
		string | undefined
	>(USDT_ADDRESS);
	const { data } = useBalance({
		address: address as Address,
		token: contractAddress as Address,
	});
	const [symbol, setSymbol] = React.useState(data?.symbol || "USDT");
	const wallet = useWalletStore((state) => state.wallet) as Wallet;
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			title={
				<div className="flex w-full items-center">
					<p className="flex-1 text-center text-primary-3">
						{"referral:modal:title_info"}
					</p>
				</div>
			}
			modal
		>
			<div className="flex flex-col gap-y-3">
				<div>
					<div
						style={{
							backgroundImage: "url(/assets/images/referral/bg_info.png)",
						}}
						className="w-full rounded-md bg-cover bg-center bg-no-repeat p-4 lg:h-[140px]"
					>
						<Select
							onChange={(value) => {
								setSymbol(value);
								const address = assets.filter(
									(item) => item.symbol === value
								)[0].contractAddress;
								setContractAddress(address);
							}}
							defaultValue={[symbol]}
							options={assets}
							value={[symbol]}
						></Select>
						<div className="mt-4 flex h-full flex-col items-start justify-start px-4">
							<p className="text-sm">{"referral:balances"}</p>
							<div>
								<p className="flex items-center justify-start gap-x-1 text-[28px] font-semibold text-primary-3">
									{formatNumber(data?.formatted, 2)}
									<span>
										{
											assets.find((item) => item.symbol === data?.symbol)
												?.symbol
										}
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="rounded-md bg-light-2 p-4">
					<div className="flex items-center justify-between">
						<p className="text-sm">{"referral:modal:address"}</p>
						<p className="flex items-center gap-x-1 text-sm text-primary-3">
							{substring(address as string, 6)}{" "}
							<button
								onClick={() => {
									notification.success("referral:qr_code:copy_success");
									copyToClipboard(address as unknown as string);
								}}
							>
								<CopyIcon className="h-5 w-5 text-grey-1" />
							</button>
						</p>
					</div>
					<div className="flex items-center justify-between">
						<p className="text-sm">{"referral:modal:user_name"}</p>
						<p className="text-sm text-primary-3">
							{wallet?.username || "----"}
						</p>
					</div>
					<div className="flex items-center justify-between">
						<p className="text-sm">{"referral:modal:phone"}</p>
						<p className="text-sm text-primary-3">
							{wallet?.phoneNumber || "----"}
						</p>
					</div>
					<div className="flex items-center justify-between">
						<p className="text-sm">{"referral:modal:email"}</p>
						<p className="text-sm text-primary-3">{wallet?.email || "----"}</p>
					</div>
					<div className="flex items-center justify-between">
						<p className="text-sm">{"referral:modal:referrer"}</p>
						<p className="text-sm text-primary-3">
							{wallet?.refCode || "----"}
						</p>
					</div>
				</div>
				<button
					onClick={handleOpenModalEdit}
					className={clsx(
						"mt-2 w-full rounded-[100px] bg-primary-1 py-3 text-center text-white hover:bg-primary-3"
					)}
				>
					{"referral:modal:edit_info"}
				</button>
			</div>
		</Modal>
	);
};

export default ModalInfoUser;
