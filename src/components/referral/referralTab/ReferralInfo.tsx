"use client";

import QRIcon from "@/components/common/Icons/QRIcon";
import FaceBookIcon from "@/components/common/Icons/FacebookIcon";
import TelegramIcon from "@/components/common/Icons/TelegramIcon";
import TwitterIcon from "@/components/common/Icons/TwitterIcon";
import {
	FacebookShareButton,
	TwitterShareButton,
	TelegramShareButton,
} from "next-share";
import { useNotification } from "@/components/common/Notification";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ModalQR from "../modal/ModalQR";
import ModalManagerReferralCode from "../modal/ModalManagerReferralCode";
import useWalletStore from "@/stores/wallet.store";
import { Wallet } from "@/@type/wallet.type";
import ModalEditDescription from "../modal/ModalEditDescription";
import ModalCreateRefCode from "../modal/ModalCreateRefCode";
import ModalListFriend from "../modal/ModalListFriend";
import {
	getReferralCodeInfo,
	getUserStats,
	updateDescRefCode,
} from "@/apis/referral.api";
import ModalSuccess from "@/components/common/Modal/ModalSuccess";
import ModalError from "@/components/common/Modal/ModalError";
import useReferralStore from "@/stores/referral.store";
import Copy from "@/components/common/Copy";
import Button from "@/components/common/Button";
import ProgressBar from "@/components/common/Progressbar.tsx";
import { UserStats } from "../type";
import { levels } from "../constant";
type TProps = {};

const ReferralInfo: React.FC<TProps> = () => {
	const notification = useNotification();
	const searchParams = useSearchParams();
	const [openModalEdit, setOpenModalEdit] = useReferralStore((state) => [
		state.openModalEdit,
		state.setOpenModalEdit,
	]);
	const [openModalQR, setOpenModalQR] = React.useState(false);
	const [openModalManager, setOpenModalManager] = React.useState(false);
	const [note, setNote] = React.useState("");
	const [openModalListFriend, setOpenModalListFriend] = React.useState(false);
	const [openModalCreate, setOpenModalCreate] = React.useState(false);
	const [infoCode, setInfoCode] = React.useState<any>({});
	const [openModalSuccess, setOpenModalSuccess] = React.useState(false);
	const [openModalError, setOpenModalError] = React.useState(false);
	const [wallet] = useWalletStore((state) => [state.wallet]);
	const [infoCreateCode, setInfoCreateCode] = React.useState<any>({});
	const [dataStats, setDataStats] = React.useState<Partial<UserStats>>({});
	const [dataRefCode, setDataRefCode] = React.useState<any>({});
	const code = searchParams.get("referral");
	const url = `${process.env.NEXT_PUBLIC_APP_URL}/commission?ref=${wallet?.defaultMyRefCode}`;
	const hashtags = ["Hakifi.io,ChangeRiskToPayback"];
	const hashtag = "#Hakifi.io";
	const title = "Hakifi.io";
	const handleUpdateDescriptionRefCode = async () => {
		try {
			const res = await updateDescRefCode({
				description: note,
				code: infoCode.code,
			});
			if (res) {
				notification.success("Edit description referral code successfully!");
				setOpenModalEdit(false);
				setOpenModalManager(true);
			}
		} catch (err) {
			notification.error("Edit description referral code error!");
		}
	};

	const listItem = [
		{
			key: "qr",
			render: () => (
				<Button
					size="lg"
					onClick={() => setOpenModalQR(true)}
					className="flex w-full items-center justify-center gap-x-1  !bg-background-primary p-2 text-white"
					variant="primary"
				>
					<QRIcon />
				</Button>
			),
		},
		{
			key: "facebook",
			render: () => (
				<FacebookShareButton
					url={url}
					hashtag={hashtag}
					quote={title}
					style={{ width: "100%" }}
				>
					<Button
						size="lg"
						className="w-full gap-x-1 flex items-center justify-center !text-support-white !bg-[#1877F2] p-2"
						variant="primary"
					>
						<FaceBookIcon />
					</Button>
				</FacebookShareButton>
			),
		},
		{
			key: "twitter",
			render: () => (
				<TwitterShareButton
					url={url}
					style={{ width: "100%" }}
					hashtags={hashtags}
					title={title}
				>
					<Button
						variant="outline"
						className="flex w-full items-center justify-center  gap-x-1 !bg-support-black p-2 !text-support-white"
						size="lg"
					>
						<TwitterIcon fill="transparent" />
					</Button>
				</TwitterShareButton>
			),
		},
		{
			key: "qr",
			render: () => (
				<TelegramShareButton url={url} style={{ width: "100%" }} title={title}>
					<Button
						size="lg"
						variant="primary"
						className="flex w-full items-center justify-center  gap-x-1  !bg-[#0088CC] p-2 !text-support-white"
					>
						<TelegramIcon />
					</Button>
				</TelegramShareButton>
			),
		},
	];

	const { level, nextLevel } = React.useMemo(() => {
		if (wallet?.level) {
			const levelIndex = levels.findIndex(
				(item: { level: number }) => item.level === (wallet?.level || 0)
			);
			const level = levels[levelIndex];
			return {
				level,
				nextLevel: levels[levelIndex + 1],
			};
		} else
			return {
				level: {
					level: 1,
					rate: 1,
					max: 20000,
				},
				nextLevel: levels[0],
			};
	}, [wallet]);
	useEffect(() => {
		const handleGetReferralCodeInfo = async () => {
			try {
				const [referralCodeInfo, userStats] = await Promise.all([
					getReferralCodeInfo(wallet?.defaultMyRefCode || ""),
					getUserStats(),
				]);
				setDataRefCode(referralCodeInfo);
				setDataStats(userStats);
			} catch (err) {
				console.log(err);
			}
		};
		handleGetReferralCodeInfo();
	}, [wallet?.defaultMyRefCode]);
	return (
		<div>
			<div className="flex w-full items-center justify-between">
				<div className="border border-divider-secondary flex items-center justify-between w-full p-3 rounded-md bg-support-black">
					<p className="text-sm">
						<p className="text-typo-secondary">Referral code</p>{" "}
						<Copy
							text={code || (wallet?.defaultMyRefCode as string)}
							prefix={
								<p className="text-xl text-typo-accent">
									{code || wallet?.defaultMyRefCode}
								</p>
							}
						/>
					</p>
					<Button
						onClick={() => setOpenModalManager(true)}
						variant="primary"
						size="lg"
					>
						Manage code
					</Button>
				</div>
			</div>
			<div>
				<div className="mt-5 flex flex-col w-full items-start justify-start gap-y-2">
					<p className="text-base text-typo-primary">Referral link</p>
					<div className="text-sm text-typo-secondary">
						You get:
						<span className="text-typo-primary">
							{" "}
							{dataRefCode.myPercent * 100}%
						</span>{" "}
						- Your friends get:{" "}
						<span className="text-typo-primary">
							{100 - dataRefCode.myPercent * 100}%
						</span>
					</div>
				</div>
				<div className="mt-2 flex items-center gap-x-2 text-sm w-full">
					<Copy
						text={
							`${process.env.NEXT_PUBLIC_APP_URL}/referral?ref=${wallet?.defaultMyRefCode}` as string
						}
						prefix={
							<input
								type="text"
								className="w-full bg-transparent text-typo-accent"
								value={`${process.env.NEXT_PUBLIC_APP_URL}/referral?ref=${wallet?.defaultMyRefCode}`}
								readOnly
							/>
						}
						styleContent="w-full"
						className="w-full bg-support-black flex items-center text-typo-secondary justify-between px-2 py-2 rounded-md"
					/>
				</div>
			</div>
			<div className="py-5 border-b border-divider-secondary grid w-full grid-cols-2 gap-3">
				{listItem.map((item) => (
					<React.Fragment key={item?.key}>{item.render()}</React.Fragment>
				))}
			</div>
			<div className="border border-divider-secondary rounded-md mt-5 mb-4">
				<div className="p-3">
					<p className="text-typo-primary text-sm">Current commission rate</p>
					<p className="text-2xl text-typo-accent mt-4 mb-3">{level.rate}%</p>
					<div className="flex flex-col gap-y-1">
						<div className="flex items-center text-xs justify-between">
							<p className="text-typo-secondary">
								<span className="text-typo-primary">
									${dataStats?.totalFriendsMargin}
								</span>
								/${level.max}
							</p>
							<p className="text-typo-secondary">
								Next level:{" "}
								<span className="text-typo-accent">{nextLevel.rate}%</span>
							</p>
						</div>
						<ProgressBar
							value={dataStats?.totalFriendsMargin as number}
							max={level.max}
							size={"md"}
						/>
					</div>
				</div>
			</div>
			<ModalQR
				openModalQR={openModalQR}
				handleCloseModalQR={() => setOpenModalQR(false)}
				userInfoCode={wallet as Wallet}
			/>
			<ModalManagerReferralCode
				open={openModalManager}
				handleCloseModalManager={() => setOpenModalManager(false)}
				handleOpenModalEdit={() => setOpenModalEdit(true)}
				handleOpenModalCreate={() => setOpenModalCreate(true)}
				setInfoCode={setInfoCode}
				handleOpenModalListFriend={() => setOpenModalListFriend(true)}
			/>
			<ModalEditDescription
				isOpen={openModalEdit}
				onRequestClose={() => {
					setOpenModalEdit(false);
					setOpenModalManager(true);
				}}
				note={note}
				onChange={(e) => setNote(e.target.value)}
				defaultNote={infoCode?.description}
				handleUpdateDescription={handleUpdateDescriptionRefCode}
			/>
			<ModalCreateRefCode
				isOpen={openModalCreate}
				onRequestClose={() => {
					setOpenModalCreate(false);
				}}
				handleOpenModalSuccess={() => setOpenModalSuccess(true)}
				handleOpenModalError={() => setOpenModalError(true)}
				setInfoCreate={setInfoCreateCode}
				handleOpenModalManager={() => setOpenModalManager(true)}
			/>
			<ModalListFriend
				open={openModalListFriend}
				handleClose={() => {
					setOpenModalListFriend(false);
					setOpenModalManager(true);
				}}
				infoCode={infoCode}
			/>
			<ModalSuccess
				open={openModalSuccess}
				handleClose={() => {
					setOpenModalSuccess(false);
					setOpenModalManager(true);
				}}
				title=""
				footer={
					<Button
						onClick={() => {
							setOpenModalSuccess(false);
							setOpenModalCreate(true);
						}}
						className="w-full"
						size="lg"
						variant="primary"
					>
						<p className="text-center w-full">Create new referral code</p>
					</Button>
				}
				successMessage={
					<div className="w-full text-center">
						<p className="text-typo-primary text-2xl text-center">
							Create successful
						</p>
						<p className="text-base mt-3 text-typo-secondary text-center">
							Referral code
							<span className="mx-1 text-xl text-typo-accent">
								{infoCreateCode?.code}
							</span>
							successfully generated
						</p>
					</div>
				}
			/>
			<ModalError
				open={openModalError}
				handleClose={() => {
					setOpenModalError(false);
					setOpenModalManager(true);
				}}
				title=""
				footer={
					<div className="flex w-full flex-col items-center gap-y-3">
						<Button
							onClick={() => {
								setOpenModalError(false);
								setOpenModalCreate(true);
							}}
							className="w-full bg-primary-1 px-4 py-2 text-sm text-white"
							size="lg"
							variant="primary"
						>
							<p className="text-center w-full">Create new referral code</p>
						</Button>
					</div>
				}
				errorMessage={
					<div className="text-primary-3">
						<p className="text-typo-primary text-center text-2xl">
							Create unsuccessful
						</p>
						<p className="mx-1 w-full text-base text-typo-secondary text-center my-3">
							The introduction code
							<span className="mx-1 text-xl text-typo-accent">
								{infoCreateCode?.code}
							</span>
							already existed. Please create another referral code
						</p>
					</div>
				}
			></ModalError>
		</div>
	);
};

export default ReferralInfo;
