import { Wallet } from "@/@type/wallet.type";
import useWalletStore from "@/stores/wallet.store";
import { formatNumber } from "@/utils/format";
import { USDT_ADDRESS } from "@/web3/constants";
import React from "react";
import { Address, useAccount, useBalance } from "wagmi";
import { substring } from "@/utils/helper";
import clsx from "clsx";
import Select from "@/components/common/Select";
import Copy from "@/components/common/Copy";
import { Avatar, AvatarImage } from "@/components/common/Avatar";
import PencilIcon from "@/components/common/Icons/PencilIcon";
import Button from "@/components/common/Button";
import { set } from "date-fns";
import ModalAddReferralCode from "../modal/ModalAddReferralCode";

const assets = [
	{
		value: USDT_ADDRESS,
		iconUrl: "/assets/images/cryptos/usdt.png",
		label: "USDT",
		assetImage: "https://tether.to/images/logoMarkGreen.svg",
	},
	{
		className: "text-vnst",
		value: "",
		iconUrl: "/assets/images/cryptos/vic.png",
		label: "VIC",
	},
];
type TProps = {
	handleOpenModalEdit: () => void;
};

const InfoUser = ({ handleOpenModalEdit }: TProps) => {
	const { address } = useAccount();
	const [contractAddress, setContractAddress] = React.useState<any>(assets[0]);
	const { data } = useBalance({
		address: address as Address,
		token: contractAddress.value as Address,
	});
	const [symbol, setSymbol] = React.useState(data?.symbol || "USDT");
	const wallet = useWalletStore((state) => state.wallet) as Wallet;
	const [openModalAddRefCode, setModalAddRefCode] = React.useState(false);
	return (
		<div className="flex flex-col gap-y-5">
			<div className="border-b border-divider-secondary">
				<div className="px-5 py-4 flex items-center gap-x-2">
					<Avatar className="text-center !w-6 !h-6">
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
					</Avatar>
					<Copy
						text={wallet?.walletAddress}
						prefix={
							<p className="text-support-white">
								{substring(wallet?.walletAddress || "")}
							</p>
						}
					/>
				</div>
			</div>
			<div className="px-5">
				<div className="w-full rounded-md border border-divider-secondary bg-support-black p-4 flex items-center">
					<div className="flex w-full h-full flex-col gap-y-1 items-start justify-start">
						<p className="text-xs text-typo-secondary">Balances</p>
						<div>
							<p className="flex items-center justify-start gap-x-1 text-base text-typo-primary">
								{formatNumber(data?.formatted, 2)}
								<span>{symbol}</span>
							</p>
						</div>
					</div>
					<Select
						onChange={(value) => {
							const label =
								assets.find((item) => item.value === value.value)?.label || "";
							setSymbol(label);
							setContractAddress(value);
						}}
						options={assets}
						className="min-w-[102px] text-typo-secondary"
						value={contractAddress}
					/>
				</div>
			</div>
			<div className="rounded-md bg-light-2 lg:px-4 px-5 flex flex-col gap-y-3">
				<div className="flex items-center justify-between">
					<p className="text-sm text-typo-secondary">Username</p>
					<button
						className="text-sm text-typo-primary flex items-center gap-x-1"
						onClick={handleOpenModalEdit}
					>
						{wallet?.username || "----"} <PencilIcon />
					</button>
				</div>
				<div className="flex items-center justify-between">
					<p className="text-sm text-typo-secondary">Email</p>
					<button
						className="text-sm text-typo-primary flex items-center gap-x-1"
						onClick={handleOpenModalEdit}
					>
						{wallet?.email || "----"} <PencilIcon />
					</button>
				</div>
			</div>
			<div className="grid grid-cols-2 items-center gap-x-2 justify-between px-5 py-1">
				<div className="h-full flex items-center col-span-1 flex-col gap-y-1 justify-between border border-divider-secondary py-2 rounded-md">
					<p className="text-sm text-typo-secondary">Commission</p>
					<p className="text-sm text-typo-primary">
						Level {wallet?.level || 1}
					</p>
				</div>
				<div className="h-full flex items-center col-span-1 flex-col gap-y-1 justify-between border border-divider-secondary py-2 rounded-md">
					<p className="text-sm text-typo-secondary">Referral by</p>
					{wallet?.refCode ? (
						<p className="text-sm text-typo-primary">{wallet?.refCode}</p>
					) : (
						<Button
							variant="primary"
							size="md"
							onClick={() => {
								setModalAddRefCode(true);
							}}
						>
							Add refcode
						</Button>
					)}
				</div>
			</div>
			<ModalAddReferralCode
				open={openModalAddRefCode}
				onClose={() => setModalAddRefCode(false)}
			/>
		</div>
	);
};
export default InfoUser;
