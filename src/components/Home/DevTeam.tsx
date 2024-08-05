"use client";
import React from "react";
import clsx from "clsx";
import Image from "next/image";

const TeamElement = ({
	item,
}: {
	item: {
		name: string;
		title: string;
		img: string;
	};
}) => {
	return (
		<div
			className={clsx(
				"flex flex-col lg:items-center items-start justify-center col-span-1 p-0 hover:shadow-card2 bg-white cursor-pointer"
			)}
		>
			<div className="w-[195px] h-[205px] md:h-[452px] md:w-[360px] bg-[url(/assets/images/home/bg_dev.png)] bg-cover bg-repeat-x bg-center">
				<Image
					width={360}
					height={378}
					className="lg:object-cover object-fit w-[195px] h-[205px] md:h-[452px] md:w-[360px] "
					src={item.img}
					alt={item.name}
				/>
			</div>
			<div className="mt-4 sm:mt-4 w-max lg:w-full text-start px-4">
				<p
					className={clsx(
						"text-base uppercase sm:text-3xl w-full font-semibold whitespace-nowrap font-determination transition-all text-typo-primary text-start"
					)}
				>
					{item.name}
				</p>
				<div className="text-sm w-full sm:text-base mt-2 text-typo-secondary font-semibold break-words text-start">
					{item.title}
				</div>
			</div>
		</div>
	);
};

const TeamTab = () => {
	const dataSource = [
		{
			name: "Cuong Le Chanh",
			title: "Founder & CEO",
			img: "/assets/images/home/ic_mr_cuong.png",
		},
		{
			name: "Minh Chau Nguyen",
			title: "Tech Lead",
			img: "/assets/images/home/ic_mr_chau.png",
		},
	];
	return (
		<div className="flex flex-col items-center justify-center w-full space-y-5">
			<div className="flex lg:items-start items-center flex-col py-[22px] px-6 bg-white box-radius lg:h-[124px] gap-y-5 w-full">
				<div className="text-3xl sm:text-5xl lg:text-start text-center lg:w-1/3 w-full font-bold text-typo-primary font-determination">
					Team
				</div>
				<div className="text-sm lg:text-base lg:w-2/3 w-full text-typo-secondary lg:text-start text-center">
					The development team of our{" "}
					<span className="text-typo-primary">Fintech</span> is driven by
					<span className="text-typo-primary ml-1">Passion, Innovation,</span>
					and <span className="text-typo-primary">Enthusiasm</span>
				</div>
			</div>
			<div className="grid grid-cols-2 grid-rows-1 gap-x-1 gap-y-1 justify-center w-full lg:py-0 py-4">
				{dataSource.map((item, i) => (
					<TeamElement key={i} item={item} />
				))}
			</div>
		</div>
	);
};

const AdvisorTab = () => {
	const dataSource = [
		{
			name: "Dai Giap Van",
			title: "CEO SCI Labs",
			img: "/assets/images/home/ic_mr_dai.png",
		},
		{
			name: "Minh Chau Nguyen",
			title: "CTO Nami Innovation",
			img: "/assets/images/home/ic_mr_chau.png",
		},
	];
	return (
		<div className="flex flex-col items-center justify-center w-full space-y-5">
			<div className="flex lg:items-start items-center flex-col gap-y-5 py-[22px] px-6 bg-white box-radius lg:h-[124px] w-full">
				<div className="text-3xl sm:text-5xl lg:text-start text-center font-bold lg:w-1/3 w-full text-typo-primary font-determination">
					Advisor
				</div>
				<div className="text-sm lg:text-base lg:w-2/3 w-full text-typo-secondary lg:text-start text-center">
					<span className="text-typo-primary">Hakifi</span> is advised from the
					guidance of seasoned experts with many years of experience in{" "}
					<span className="text-typo-primary">Web3</span> and
					<span className="text-typo-primary ml-1">Fintech</span>.
				</div>
			</div>
			<div className="grid grid-cols-2 grid-rows-1 gap-x-1 gap-y-1 justify-center w-full h-full">
				{dataSource.map((item, i) => (
					<TeamElement key={i} item={item} />
				))}
			</div>
		</div>
	);
};

const DevTeamLanding = () => {
	return (
		<div
			style={{
				backgroundImage: "url(/assets/images/home/bg_dev_team.png)",
			}}
			className="bg-no-repeat bg-contain bg-left"
		>
			<section className="max-w-desktop overflow-hidden flex flex-col gap-y-4 items-center justify-center py-[3rem] sm:py-[100px] lg:px-0">
				<div className="grid lg:grid-cols-2 grid-rows-2 grid-cols-1 lg:grid-rows-1 gap-y-4">
					<div className="flex-1 box-radius">
						<AdvisorTab />
					</div>
					<div className="flex-1 box-radius">
						<TeamTab />
					</div>
				</div>
			</section>
		</div>
	);
};

export default DevTeamLanding;
