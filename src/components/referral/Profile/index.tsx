import React, { useState } from "react";
import OverviewChart from "./OverviewChart";
import OverviewStatistic from "./OverviewStatistic";
import { getPnlUser } from "@/apis/referral.api";
import dayjs from "dayjs";
import useWalletStore from "@/stores/wallet.store";
import isoWeek from "dayjs/plugin/isoWeek";
import InfoUser from "./InfoUser";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/common/Tabs";
import OverviewIcon from "@/components/common/Icons/OverViewIcon";
import { DoubleUserIcon } from "@/components/common/Icons/UserIcon";
import ReferralTabs from "../referralTab";
import useReferralStore from "@/stores/referral.store";
dayjs.extend(isoWeek);

const Profile: React.FC = () => {
	const [tabs, setTabs] = React.useState<"history" | "list">("history");
	const [filter, setFilter] = React.useState<{ label: string; value: string }>({
		label: "7D",
		value: "week",
	});
	const [setOpenModalInfo] = useReferralStore((state) => [
		state.setOpenModalInfo,
	]);
	const [wallet] = useWalletStore((state) => [state.wallet]);
	const [data, setData] = React.useState<any>([]);
	const params = React.useMemo(() => {
		switch (filter.value) {
			case "week": {
				return {
					from: dayjs().startOf("isoWeek").valueOf(),
					to: dayjs().endOf("day").valueOf(),
				};
			}
			case "month": {
				return {
					from: dayjs().startOf("month").valueOf(),
					to: dayjs().endOf("day").valueOf(),
				};
			}
			case "year": {
				return {
					from: dayjs().startOf("year").valueOf(),
					to: dayjs().endOf("day").valueOf(),
				};
			}
			default: {
				return undefined;
			}
		}
	}, [filter]);
	const handleGetPnlUser = async () => {
		try {
			const res = await getPnlUser(
				params
					? {
							from: dayjs(params?.from).startOf("day").toISOString(),
							to: dayjs(params?.to).endOf("day").toISOString(),
					  }
					: undefined
			);
			setData(res);
		} catch (error) {}
	};
	React.useEffect(() => {
		handleGetPnlUser();
	}, [params, wallet]);
	return (
		<div className="bg-background-tertiary">
			<div>
				<InfoUser handleOpenModalEdit={() => setOpenModalInfo(true)} />
			</div>
			<Tabs
				activationMode="manual"
				defaultValue="overview"
				className="w-full px-4 py-4"
			>
				<TabsList className="flex items-center gap-x-5 w-full justify-start border-divider-secondary border-b !mb-5">
					<TabsTrigger
						value="overview"
						className="flex items-center uppercase gap-x-1 font-determination hover:text-typo-accent data-[state=active]:text-typo-accent text-typo-secondary data-[state=active]:border-typo-accent data-[state=active]:border-b py-4 "
					>
						<OverviewIcon />
						Overview
					</TabsTrigger>
					<TabsTrigger
						value="referral"
						className="flex items-center gap-x-1 uppercase font-determination hover:text-typo-accent py-4 data-[state=active]:text-typo-accent text-typo-secondary data-[state=active]:border-typo-accent data-[state=active]:border-b"
					>
						<DoubleUserIcon /> Referral
					</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<div className="flex w-full flex-col items-start lg:flex-nowrap">
						<div className="mb-5 w-full lg:mb-0 lg:w-full">
							<OverviewChart
								data={data}
								filter={filter}
								setFilter={setFilter}
							/>
						</div>
						<OverviewStatistic data={data[data.length - 1]} />
					</div>
				</TabsContent>
				<TabsContent value="referral">
					<ReferralTabs />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Profile;
