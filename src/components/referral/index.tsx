"use client";

import useWalletStore from "@/stores/wallet.store";
import React from "react";
// import EditIcon from '../common/Icons/EditIcon';
import dynamic from "next/dynamic";
import { ModalInfo } from "./modal/ModalEditInfo";
import { Wallet } from "@/@type/wallet.type";
import Spinner from "../common/Spinner";
import StatisticBox from "./StatisticBox";
import useReferralStore from "@/stores/referral.store";
import { useAccount } from "wagmi";
import { useRouter, usePathname } from "next/navigation";

const OverviewTabs = dynamic(() => import("./Profile"), {
	ssr: false,
	loading: () => (
		<div className="flex w-full items-center justify-center">
			<Spinner size="large" />
		</div>
	),
});

const ReferralPage: React.FC = () => {
	const wallet = useWalletStore((state) => state.wallet);
	const [openModalInfo, setOpenModalInfo] = useReferralStore((state) => [
		state.openModalInfo,
		state.setOpenModalInfo,
	]);
	const { isConnected } = useAccount();
	const router = useRouter();
	const pathName = usePathname();
	React.useEffect(() => {
		if (pathName === "/referral" && !isConnected) {
			router.push("/");
		}
	}, [isConnected, pathName, router]);
	return (
		<div className="w-full bg-support-black">
			<div className="lg:grid lg:grid-cols-4">
				<div className="lg:col-span-1 border-r border-divider-secondary">
					<OverviewTabs />
				</div>
				<div className="lg:col-span-3 lg:m-5 rounded-md border border-divider-secondary bg-background-tertiary h-max">
					<StatisticBox />
				</div>
			</div>
			<ModalInfo
				open={openModalInfo}
				handleClose={() => setOpenModalInfo(false)}
				userInfo={wallet as Wallet}
			/>
		</div>
	);
};

export default ReferralPage;
