import React from "react";
import AnimationText from "./AnimationText";
import Button from "../common/Button";
import Statistic from "./Statistic";
import MapPool from "./MapPool";
import StepInsurance from "./StepInsurance";
import WhyChoose from "./WhyChoose";
import PartnerDesc from "./PartnerDesc";
import OnchainActivity from "./OnchainActivity";
import DevTeamLanding from "./DevTeam";
import Link from "next/link";
const Home = () => {
	return (
		<div>
			<div
				style={{ backgroundImage: "url(/assets/images/home/banner_bg.png)" }}
				className="w-full h-max  lg:min-h-[630px] bg-contain lg:bg-right bg-top bg-no-repeat"
			>
				<div className="desktop-screen h-full lg:pt-[180px] pt-[310px] flex items-start justify-center flex-col">
					<div className="my-auto lg:w-1/3 w-full h-max px-4">
						<div className="flex flex-col lg:items-start items-center gap-y-4">
							<AnimationText
								contents={[
									["Change Risk", "To Payback"],
									["Cover", " Your Future"],
								]}
							/>
							<Link href="/buy-cover">
								<Button size="lg" variant="primary" className="w-max">
									Buy Cover
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="desktop-screen flex flex-col lg:gap-y-[160px] gap-y-[80px] lg:px-0 px-4 overflow-hidden">
				<div className="mt-[60px]">
					<Statistic />
				</div>
				<div>
					<MapPool />
				</div>
				<div>
					<WhyChoose />
				</div>
				<div>
					<StepInsurance />
				</div>
				<div>
					<PartnerDesc />
				</div>
			</div>
			<div>
				<OnchainActivity />
			</div>
			{/* <div>
				<DevTeamLanding />
			</div> */}
		</div>
	);
};

export default Home;
