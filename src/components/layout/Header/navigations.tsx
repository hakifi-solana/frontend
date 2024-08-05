"use client";

import React from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { navigations } from "@/configs/navigations";
import { cn } from "@/utils";
import Link from "next/link";
// import { directWhitepaperPage } from '@/components/common/utils/header';

type Props = {
	className?: string;
};

const Navigation = ({ className }: Props) => {
	const pathname = usePathname();

	return (
		<div
			className={clsx(
				"box-radius p-1 bg-light-2 hidden items-center lg:flex",
				className
			)}
		>
			{navigations.map((nav) => {
				const isActive = nav.href === pathname;
				return (
					<Link
						key={nav.title}
						href={nav.href}
						className={cn(
							"py-1 px-4 text-sm leading-[22px] tracking-[0.84px] font-determination uppercase duration-300",
							isActive
								? "text-typo-accent"
								: "hover:cursor-pointer text-typo-secondary hover:text-typo-accent",
							className
						)}
						target={nav.blank === true ? "_blank" : undefined}
					>
						{nav.title}
					</Link>
				);
			})}
		</div>
	);
};

export default Navigation;
