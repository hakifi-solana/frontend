"use client";

import React, { useEffect } from "react";
import ReferralInfo from "./ReferralInfo";
import useWalletStore from "@/stores/wallet.store";
import ModalAddReferralCode from "../modal/ModalAddReferralCode";

import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { addReferralCode } from "@/apis/referral.api";
import { useNotification } from "@/components/common/Notification";
import ReferralStatistic from "./ReferralStatistic";
const ReferralTabs = () => {
	const [wallet, setWallet] = useWalletStore((state) => [
		state.wallet,
		state.setWallet,
	]);
	const searchParams = useSearchParams();
	const { isConnected } = useAccount();
	const [openModalAddRefCode, setModalAddRefCode] = React.useState(false);
	const notification = useNotification();


	useEffect(() => {
		const refCode = searchParams.get("ref");
		const handleAddReferralCode = async () => {
			if (!!refCode) {
				try {
					const res = await addReferralCode({ code: refCode });
					if (res) {
						setWallet(res);
						notification.success("success_add_referral_code");
					}
				} catch (err) {
					return err;
				}
			}
		};
		if (isConnected && wallet?.refCode === null) {
			handleAddReferralCode();
		}
	}, [isConnected, wallet, searchParams]);
	return (
		<div>
			<div className="w-full">
				<ReferralInfo />
			</div>
			<ReferralStatistic />
			<ModalAddReferralCode
				open={openModalAddRefCode}
				onClose={() => setModalAddRefCode(false)}
			/>
		</div>
	);
};

export default ReferralTabs;
