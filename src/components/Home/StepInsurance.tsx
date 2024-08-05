"use client";

import Link from "next/link";
import Button from "../common/Button";
import { Timeline, TimelineItem } from "../common/Timeline";
import { useIsMobile } from "@/hooks/useMediaQuery";
import Wallets from "../ConnectWalletModal/Wallets";
import clsx from "clsx";
import styles from "./styles/Animation.module.scss";
import { InView } from "react-intersection-observer";
const StepInsurance = () => {
	const isMobile = useIsMobile();
	const titles = "3 simple steps to activate contract";
	return (
		<div className="">
			<InView rootMargin="0px" threshold={0.5}>
				{({ inView, ref }) => (
					<div
						className={clsx(
							inView ? styles.titleAnimation : "",
							"lg:mb-20 mb:6"
						)}
						ref={ref}
					>
						{titles.split(" ").map((item, index) => (
							<span
								key={`${item}${index}`}
								className="text-typo-accent lg:text-5xl text-3xl lg:h-12 font-determination uppercase lg:tracking-[2.88px] tracking-[1.68px]"
							>
								{item}
							</span>
						))}
					</div>
				)}
			</InView>

			<Timeline>
				<>
					<TimelineItem
						side="left"
						date={
							<div className="lg:w-max lg:min-w-[428px] w-[288px] lg:h-max py-4 px-4 flex flex-col gap-y-2">
								<p className="text-xl text-typo-primary">Connect Wallet</p>
								<Wallets closeModal={() => {}} />
							</div>
						}
						title="Connect Wallet"
						content="Easily connect to blockchain wallets such as Metamask, Coin98,
          Coinbase Wallet, WalletConnect,..."
						isButton={false}
					/>
					<TimelineItem
						side="right"
						date={
							<img
								src="/assets/images/home/step_2.png"
								className="lg:w-[488px] lg:h-[485px]"
							/>
						}
						title="Adjust contract"
						content="Use our suggested parameters or freely customize the contract
          parameters before opening contract."
						isButton={false}
					/>
					<TimelineItem
						side="left"
						date={
							<img
								src="/assets/images/home/step_3.png"
								className="lg:w-[488px] lg:h-[394px]"
							/>
						}
						title="Sign and confirm"
						content="Confirm to open contract, reduce the risk today!"
						isButton={false}
					/>
					{isMobile ? (
						<TimelineItem
							side="left"
							date={
								<Link href="/buy-cover" className="w-[280px] block lg:hidden">
									<Button size="lg" variant="primary" className="w-full">
										<p className="w-full text-center">Cover now</p>
									</Button>
								</Link>
							}
							isButton={true}
							title=""
							content=""
						/>
					) : null}
				</>
			</Timeline>
			<Link
				href="/buy-cover"
				className="w-full lg:flex items-center justify-center hidden"
			>
				<Button size="lg" variant="primary">
					<p className="w-full text-center">Cover now</p>
				</Button>
			</Link>
		</div>
	);
};

export default StepInsurance;
