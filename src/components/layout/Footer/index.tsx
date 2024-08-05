import AccordionWrapper from "@/components/common/Accordion";
import FacebookIcon from "@/components/common/Icons/FacebookIcon";
import MailIcon from "@/components/common/Icons/MailIcon";
import TelegramIcon from "@/components/common/Icons/TelegramIcon";
import TwitterIcon from "@/components/common/Icons/TwitterIcon";
import { useIsMobile } from "@/hooks/useMediaQuery";
import Link from "next/link";
import { useMemo } from "react";

const Footer = () => {
	const isMobile = useIsMobile();
	const content = useMemo(() => {
		return [
			{
				label: "Categories",
				content: (
					<section className="text-body-12 text-typo-secondary px-4 flex flex-col gap-y-2">
						<Link className="hover:text-typo-accent py-2" href="/buy-cover">
							Buy Cover
						</Link>
						{/* <p className="py-2">Market</p>
						<p className="py-2">Referral</p> */}
					</section>
				),
			},
			{
				label: "On-Boarding",
				content: (
					<section className="text-body-12 text-typo-secondary px-4 flex flex-col gap-y-2">
						<Link
							className="hover:text-typo-accent"
							href="https://docs.umbrellaz.io/tutorials/instructions-for-establishing-a-contract"
						>
							Learn
						</Link>
						<Link
							className="hover:text-typo-accent"
							href="https://docs.umbrellaz.io/overall/terms"
						>
							Terminology System
						</Link>
						<Link
							className="hover:text-typo-accent"
							href="https://docs.umbrellaz.io/overall/status-system"
						>
							Status System
						</Link>
					</section>
				),
			},
			{
				label: "Documentation",
				content: (
					<section className="text-body-12 text-typo-secondary px-4 flex flex-col gap-y-2">
						<Link
							className="hover:text-typo-accent"
							href="https://docs.umbrellaz.io"
						>
							Whitepaper
						</Link>
						{/* <p>Blogs</p> */}
						<Link
							className="hover:text-typo-accent"
							href="https://umbrellaz.io/docs/policy.pdf"
						>
							Referral policy
						</Link>
					</section>
				),
			},
		];
	}, []);

	if (isMobile) {
		return (
			<section className="bg-background-tertiary border-t border-t-divider-secondary border-b-4 border-b-typo-accent">
				<section className="container flex flex-col items-center justify-between py-5 gap-5">
					<Link
						className="hover:text-typo-accent flex items-center" 
						href="/"
					>
						<p className="text-typo-accent text-heading-3 uppercase">Hakifi</p>
					</Link>

					<section className="w-full">
						<AccordionWrapper
							body={content}
							labelClassName="lg:text-body-14 text-base"
						/>
					</section>
					<section className="text-body-16 text-support-black flex items-center gap-4">
						<TwitterIcon className="w-10 h-10" fill="#F37B23" />
						<FacebookIcon className="w-10 h-10" fill="#F37B23" />
						<TelegramIcon className="w-10 h-10" fill="#F37B23" />
						<MailIcon className="w-10 h-10" fill="#F37B23" />
					</section>
					<section className="text-body-12 text-typo-secondary">
						<p>Copyright © 2023 Hakifi.All rights reserved.</p>
					</section>
				</section>
			</section>
		);
	}

	return (
		<section className="bg-background-tertiary border-t flex items-center justify-center border-t-divider-secondary w-full border-b-4 border-b-typo-accent">
			<section className="px-[112px] flex items-start w-full pt-10 pb-[50px] justify-between">
				<section>
					<Link
						className="hover:text-typo-accent flex items-center"
						href="/"
					>
						<p className="text-typo-accent text-heading-3 uppercase">Hakifi</p>
					</Link>
					<section className="text-body-16 text-typo-secondary mt-3">
						<p>Copyright © 2023 Hakifi.</p>
						<p>All rights reserved.</p>
					</section>
				</section>
				<section className="flex items-start gap-20">
					<section>
						<p className="text-heading-4 text-support-white uppercase">
							Categories
						</p>
						<section className="text-body-16 text-typo-secondary mt-4 flex flex-col gap-2">
							<Link className="hover:text-typo-accent" href="/buy-cover">
								Buy Cover
							</Link>
							{/* <p>Market</p>
							<p>Referral</p> */}
						</section>
					</section>
					<section>
						<p className="text-heading-4 text-support-white uppercase">
							On-Boarding
						</p>
						<section className="text-body-16 text-typo-secondary mt-4 flex flex-col gap-2">
							<Link
								className="hover:text-typo-accent"
								href="https://docs.umbrellaz.io/tutorials/instructions-for-establishing-a-contract"
							>
								Learn
							</Link>
							<Link
								className="hover:text-typo-accent"
								href="https://docs.umbrellaz.io/overall/terms"
							>
								Terminology System
							</Link>
							<Link
								className="hover:text-typo-accent"
								href="https://docs.umbrellaz.io/overall/status-system"
							>
								Status System
							</Link>
						</section>
					</section>
					<section>
						<p className="text-heading-4 text-support-white uppercase">
							Documentation
						</p>
						<section className="text-body-16 text-typo-secondary mt-4 flex flex-col gap-2">
							<Link
								className="hover:text-typo-accent"
								href="https://docs.umbrellaz.io"
							>
								Whitepaper
							</Link>
							{/* <p>Blogs</p> */}
							<Link
								className="hover:text-typo-accent"
								href="https://umbrellaz.io/docs/policy.pdf"
							>
								Referral policy
							</Link>
						</section>
					</section>
					<section>
						<p className="text-heading-4 text-support-white uppercase">
							Join the community
						</p>
						<section className="text-body-16 text-support-black mt-4 flex items-center gap-4">
							<TwitterIcon className="w-6 h-6" fill="#F37B23" />
							<FacebookIcon className="w-6 h-6" fill="#F37B23" />
							<TelegramIcon className="w-6 h-6" fill="#F37B23" />
							<MailIcon className="w-6 h-6" fill="#F37B23" />
						</section>
					</section>
				</section>
			</section>
		</section>
	);
};

export default Footer;
