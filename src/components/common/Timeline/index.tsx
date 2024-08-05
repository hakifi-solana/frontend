import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Timeline.module.scss";
import colors from "@/colors";
import { useIsMobile } from "@/hooks/useMediaQuery";

export interface TimelineProps {
	children: React.JSX.Element;
}

export interface TimelineItemProps {
	date: number | string | React.JSX.Element;
	side: "left" | "right";
	title: string;
	content: string;
	isButton?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({ children, ...rest }) => {
	const [borderHeight, setBorderHeight] = useState(0);
  const isMobile = useIsMobile()
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const maxHeight = isMobile ? 2700 : 2200
			const contentHeight = isMobile ? 1550 : 1746
			let height = 0;
			if (scrollTop - maxHeight > contentHeight) {
				height = contentHeight;
			} else if (scrollTop - maxHeight < 0) {
				height = 0;
			} else {
				height = scrollTop - maxHeight;
			}
			setBorderHeight(height);
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [isMobile]);
	return (
		<div className="relative">
			<div className="w-2.5 h-2.5 relative top-0 lg:left-[calc(50%-5px)] rounded-b-md border-l-[5px] border-r-[5px] border-background-primary z-10"></div>
			<div {...rest} className={clsx(styles.timeline)}>
				{children}
			</div>
			<div
				className={styles.line}
				style={{
					height: borderHeight,
					borderColor:
						borderHeight > 0
							? colors.background.primary
							: colors.divider.secondary,
					zIndex: 10,
				}}
			/>
			<div
				className={styles.line}
				style={{
					height: "100%",
					borderColor: colors.divider.secondary,
					zIndex: 1,
				}}
			/>
		</div>
	);
};

export const TimelineItem: React.FC<TimelineItemProps> = (props) => {
	const { date, side, title, content, isButton } = props;
	const [inView, setInView] = useState(false);

	const handleIntersection = (entries: IntersectionObserverEntry[]) => {
		const [entry] = entries;
		setInView(entry.isIntersecting);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(handleIntersection, {
			rootMargin: "0px",
			threshold: 1,
		});

		const currentRef = ref.current; // Create a variable to store the current value of the ref

		if (currentRef) { // Add a null check to ensure the ref is not null
			observer.observe(currentRef);
		}

		return () => {
			if (currentRef) { // Add a null check to ensure the ref is not null
				observer.unobserve(currentRef);
			}
		};
	}, []);

	const ref = useRef<HTMLDivElement>(null);

	return (
		<div
			className={clsx(
				styles.container,
				side === "left" ? styles.left : styles.right,
				"before:border before:border-dashed",
				{
					"before:border-background-primary after:bg-[url(/assets/images/home/active.png)] after:bg-cover after:bg-center":
						inView,
					"before:border-divider-secondary after:bg-[url(/assets/images/home/disable.png)] after:bg-cover after:bg-center":
						!inView,
				}
			)}
			ref={ref}
		>
			<div
				className={clsx(styles.date, styles[side], {
					"border-background-primary": inView,
					"border-background-tertiary": !inView,
					"border w-max": isButton === false,
				})}
			>
				{date}
			</div>
			{isButton === true ? null : (
				<div
					className={`${styles.content} ${
						inView
							? "border border-t-8 border-l-1 border-r-1 border-b-1 border-background-primary"
							: "border border-t-8 border-l-1 border-r-1 border-b-1 border-divider-secondary"
					}`}
				>
					<div>
						<p
							className={clsx("lg:text-3xl text-sm font-determination uppercase", {
								"text-typo-accent": inView,
								"text-typo-primary": !inView,
							})}
						>
							{title}
						</p>
						<p
							className={clsx("font-saira lg:text-base text-xs lg:mt-4 mt-1", {
								"text-typo-primary": inView,
								"text-typo-disable": !inView,
							})}
						>
							{content}
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Timeline;
