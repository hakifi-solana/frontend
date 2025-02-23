import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/common/Tabs";
import dynamic from "next/dynamic";
import ContractLoader from "@/components/BuyCover/Loader/ContractLoader";
import FavoritesLoader from "@/components/BuyCover/Loader/FavoritesLoader";

const ContractList = dynamic(() => import("./ContractList"), {
	ssr: false,
	loading: () => <FavoritesLoader />,
});
const TransactionHistory = dynamic(() => import("./TransactionHistory"), {
	ssr: false,
	loading: () => <FavoritesLoader />,
});
const FriendListTab = dynamic(() => import("./FriendListTab"), {
	ssr: false,
	loading: () => <FavoritesLoader />,
});
const CommissionHistory = dynamic(() => import("./CommissionHistory"), {
	ssr: false,
	loading: () => <FavoritesLoader />,
});
const listTabs = [
	{
		title: "Contracts",
		value: "contract_list",
	},
	{
		title: "Transaction History",
		value: "transaction_history",
	},
	{
		title: "Friend List",
		value: "friend_list",
	},
	{
		title: "Commission History",
		value: "commission_history",
	},
];

const StatisticBox = () => {
	return (
		<Tabs
			id="statistic_box"
			activationMode="manual"
			defaultValue="contract_list"
			className="w-full px-4 py-4"
		>
			<TabsList className="flex items-center gap-x-5 w-full justify-start border-divider-secondary border-b !mb-5">
				{listTabs.map((item) => (
					<TabsTrigger
						key={item.value}
						value={item.value}
						className="flex items-center font-determination uppercase gap-x-1 hover:text-typo-accent data-[state=active]:text-typo-accent text-typo-secondary data-[state=active]:border-typo-accent data-[state=active]:border-b py-4 "
					>
						{item.title}
					</TabsTrigger>
				))}
			</TabsList>
			<TabsContent value="contract_list">
				<ContractList />
			</TabsContent>
			<TabsContent value="transaction_history">
				<TransactionHistory />
			</TabsContent>
			<TabsContent value="friend_list">
				<FriendListTab />
			</TabsContent>
			<TabsContent value="commission_history">
				<CommissionHistory />
			</TabsContent>
		</Tabs>
	);
};

export default StatisticBox;
