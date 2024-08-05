import { MarketPair } from "@/@type/pair.type";
import colors from "@/colors";
import Button from "@/components/common/Button";
import FormInput from "@/components/common/FormInput";
import ChevronIcon from "@/components/common/Icons/ChevronIcon";
import SearchIcon from "@/components/common/Icons/SearchIcon";
import TickIcon from "@/components/common/Icons/TickIcon";
import Popup from "@/components/common/Popup";
import useToggle from "@/hooks/useToggle";
import useMarketStore from "@/stores/market.store";
import { cn } from "@/utils";
import Image from "next/image";
import React, { ChangeEvent, useMemo, useState } from "react";

interface IAssetDropdownProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	afterIcon?: React.ReactNode;
	classContent?: string;
	asset?: string;
	handleSetAsset: (asset: string) => void;
}

const AssetDropdown = React.forwardRef<HTMLButtonElement, IAssetDropdownProps>(
	(
		{ className, classContent, handleSetAsset, asset, ...rest },
		forwardedRef
	) => {
		const { handleToggle, toggle } = useToggle();
		const [marketPairs, getMarketParis] = useMarketStore((state) => [
			state.marketPairs,
			state.getMarketParis,
		]);
		const [searchKey, setSetSearchKey] = useState("");
		const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;
			setSetSearchKey(value);
		};
		const [selectedPair, setSelectedPair] = useState<MarketPair | null>(null);
		const getPairs = useMemo(() => {
			if (searchKey) {
				return marketPairs.filter((item) =>
					item.asset.toLowerCase().includes(searchKey.toLowerCase())
				);
			}

			return marketPairs;
		}, [marketPairs, searchKey]);

		const handleSetSelectedPair = (pair: MarketPair) => {
			handleSetAsset(pair.asset);
			setSelectedPair(pair);
			handleToggle();
		};
		React.useEffect(() => {
			if (marketPairs.length === 0) {
				getMarketParis();
			}
			if (selectedPair && selectedPair.asset !== asset) {
				setSelectedPair(null);
			}
		}, [marketPairs, asset]);
		return (
			<Popup
				isOpen={toggle}
				classTrigger=""
				classContent="w-[250px] p-4"
				handleOnChangeStatus={handleToggle}
				content={
					<section className="">
						<FormInput
							size="md"
							value={searchKey}
							onChange={handleOnChange}
							wrapperClassInput="w-full"
							suffixClassName="!border-none"
							placeholder="Search pair"
							suffix={<SearchIcon className="size-4" />}
						/>

						<section className="mt-3 flex flex-col gap-3 -mr-[15px] custom-scroll pr-2 overflow-auto max-h-[300px]">
							{getPairs.map((pair, index) => (
								<Button
									size="md"
									key={pair.id}
									onClick={() => handleSetSelectedPair(pair)}
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
					</section>
				}
			>
				<Button
					size="lg"
					variant="outline"
					point={false}
					className="w-[250px]"
					ref={forwardedRef}
					{...rest}
				>
					<section className="w-full flex items-center justify-between gap-2">
						<div className="!text-body-14">
							{selectedPair ? (
								<div className="flex items-center gap-2">
									<Image
										className="size-5"
										src={selectedPair.token.attachment}
										width={20}
										height={20}
										alt="logo"
									/>
									<span
										className={cn(
											!toggle ? "text-typo-primary" : "text-typo-accent"
										)}
									>
										{selectedPair?.asset}
									</span>
									<span
										className={cn(
											!toggle ? "text-typo-secondary" : "text-typo-accent"
										)}
									>
										{" "}
										/ USDT
									</span>
								</div>
							) : (
								<span className="text-typo-secondary">Select asset</span>
							)}
						</div>
						<ChevronIcon
							className={cn(
								"duration-200 ease-linear transition-all",
								toggle ? "rotate-180" : "rotate-0"
							)}
							color={toggle ? colors.typo.accent : colors.typo.secondary}
						/>
					</section>
				</Button>
			</Popup>
		);
	}
);

export default AssetDropdown;
