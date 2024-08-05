"use client";

import { useIsMobile, useIsTablet } from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import Navigation from "./navigations";
import Button from "@/components/common/Button";
import { Skeleton } from "@/components/common/Skeleton";
import BarIcons from "@/components/common/Icons/BarsIcons";
import CloseIcon from "@/components/common/Icons/CloseIcon";
import useToggle from "@/hooks/useToggle";
import NotificationIcon from "@/components/common/Icons/NotificationIcon";
import DrawerWrapper from "@/components/common/Drawer";
import { navigations } from "@/configs/navigations";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { useAccount } from "wagmi";

const ConnectWallet = dynamic(() => import('./ConnectWallet'), {
	ssr: false,
	loading: () => <Skeleton className="h-10 w-10 rounded-full sm:w-[167px] sm:!rounded" />,
});

function Header() {
	// const [isOpenMobileNav, toggleOpenMobileNav] = useCycle(false, true);
	const { handleToggle, toggle } = useToggle();
	const isMobile = useIsMobile();
	const pathname = usePathname();
	const { isConnected } = useAccount();
	/**
	 * Uncomment when apply get config chart
	 */
	// const getChartConfig = async () => {
	//     const [err, response] = await handleRequest<ChartConfig>(getUpdateChartConfigApi());

	//     if (err) {
	//         console.log("Get chart config is error with message", err);
	//         return;
	//     }

	//     if (response) {
	//         const { data: config } = response;
	//         setChartConfig(config);
	//     }
	// };

	// useEffect(() => {
	//     getChartConfig();
	// }, []);

	return (
		<>
			<header className="z-30 h-17 bg-background-tertiary sticky top-0 border-b border-divider-secondary">
				<div className="flex h-full w-full items-center justify-between sm:px-5 sm:py-3 py-2 px-4">
					<Link href="/" className="flex items-center">
						<p className="lg:text-3xl text-2xl tracking-[1.68px] leading-[48px] font-bold text-typo-accent uppercase text-heading-3">
							Hakifi
						</p>
					</Link>

					{/* Main menu */}
					<Navigation />

					<section className="flex items-center gap-x-5">
						{/* {isLogging ? <NotificationIcon className="mr-4" /> : null} */}
						{/* <LanguageSelector className="mr-3 h-fit lg:mr-4" /> */}
						{isConnected ? <NotificationIcon className="size-6" /> : null}
						<ConnectWallet />

						<DrawerWrapper
							isOpen={toggle}
							title="Menu"
							handleOpenChange={handleToggle}
							content={
								<>
									<section className="flex flex-col gap-6 mt-5">
										{navigations.map((nav) => {
											const isActive = nav.href === pathname;
											return (
												<Link
													key={nav.title}
													href={nav.href}
													onClick={handleToggle}
													className={cn(
														"duration-300 text-body-16",
														isActive
															? "text-typo-accent"
															: "hover:cursor-pointer text-typo-secondary hover:text-typo-accent"
													)}
													target={nav.blank === true ? "_blank" : undefined}
												>
													{nav.title}
												</Link>
											);
										})}
									</section>
								</>
							}
						>
							<Button size="lg" className="lg:hidden block">
								{toggle ? <CloseIcon /> : <BarIcons className="w-6 h-6" />}
							</Button>
						</DrawerWrapper>
					</section>
				</div>
			</header>
		</>
	);
}

export default memo(Header);
