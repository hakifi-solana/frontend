import { MarketPair } from "@/@type/pair.type";
import Button from "@/components/common/Button";
import FormInput from "@/components/common/FormInput";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import TickIcon from "@/components/common/Icons/TickIcon";
import useMarketStore from "@/stores/market.store";
import { cn } from "@/utils";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type AssetDrawerProps = {
	handleSelectedPair: (pair: MarketPair) => void;
	selectedPair?: MarketPair;
};

const AssetDrawer = ({
	selectedPair,
	handleSelectedPair,
}: AssetDrawerProps) => {
	const [marketPairs, getMarketParis] = useMarketStore((state) => [
		state.marketPairs,
		state.getMarketParis,
	]);
	const [searchKey, setSetsearchKey] = useState("");
	const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSetsearchKey(value);
	};
	const getPairs = useMemo(() => {
		if (searchKey) {
			return marketPairs.filter((item) =>
				item.asset.toLowerCase().includes(searchKey.toLowerCase())
			);
		}

		return marketPairs;
	}, [marketPairs, searchKey]);
	useEffect(() => {
		if (marketPairs.length === 0) {
			getMarketParis();
		}
	}, [marketPairs]);
	return (
		<>
			<p className="my-4 text-title-20">Asset</p>

			<FormInput
				size="md"
				value={searchKey}
				onChange={handleOnChange}
				wrapperClassInput="w-full"
				suffixClassName="!border-none"
				placeholder="Search pair"
				suffix={<SearchIcon className="size-4" />}
			/>

			<section className="mt-4 flex flex-col gap-3 -mr-[15px] custom-scroll pr-2 overflow-auto max-h-[300px]">
				{getPairs.map((pair, index) => (
					<Button
						size="md"
						key={pair.id}
						onClick={() => handleSelectedPair(pair)}
						className={cn(
							"w-full flex items-center justify-between py-2 hover:text-typo-accent hover:bg-background-secondary hover:px-2 transition-all duration-200",
							selectedPair?.asset === pair.asset &&
								"bg-background-secondary text-typo-accent px-2"
						)}
					>
						<div className="flex items-center gap-2">
							<Image
								className="size-5"
								src={pair.token.attachment}
								width={20}
								height={20}
								alt="logo"
							/>

							<span className="text-typo-secondary">
								<span className="text-typo-primary">{pair.asset}</span>/
								{pair.unit}
							</span>
						</div>

						{selectedPair?.asset === pair.asset && (
							<TickIcon className="size-3.5" />
						)}
					</Button>
				))}
			</section>
		</>
	);
};

export default AssetDrawer;
