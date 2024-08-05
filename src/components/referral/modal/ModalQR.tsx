import React, { useMemo, useRef } from "react";
import QRCode from "qrcode.react";

import DomToImage from "dom-to-image";
import { useIsMobile } from "@/hooks/useMediaQuery";
import clsx from "clsx";
import { Wallet } from "@/@type/wallet.type";
import Modal from "@/components/common/Modal";
import { useNotification } from "@/components/common/Notification";
import Button from "@/components/common/Button";
interface ModalQRProps {
	userInfoCode: Wallet;
	openModalQR: boolean;
	handleCloseModalQR: () => void;
}
const FILE_NAME = "My-QRCode.png";
const ModalQR: React.FC<ModalQRProps> = ({
	userInfoCode,
	openModalQR,
	handleCloseModalQR,
}) => {
	const timer = useRef<ReturnType<typeof setTimeout>>();
	const isMobile = useIsMobile();
	const nofication = useNotification();
	const qrValue = useMemo(
		() => userInfoCode?.defaultMyRefCode,
		[userInfoCode?.defaultMyRefCode]
	);
	const options = (el: any) => {
		const scale = 2;
		const option = {
			height: el.offsetHeight * scale,
			width: el.offsetWidth * scale,
			style: {
				transform: `scale(${scale})`,
				transformOrigin: "top left",
				width: `${el.offsetWidth}px`,
				height: `${el.offsetHeight}px`,
			},
		};
		return option;
	};

	const onShare = async () => {
		try {
			const file = await formatFile();
			if (file) {
				timer.current = setTimeout(() => {
					share(file, isMobile as boolean);
				}, 100);
			}
		} catch (error) {
			console.error(error);
		}
	};
	const share = async (file: File, mobile: boolean) => {
		if (!mobile) {
			return saveFile(file, FILE_NAME);
		}
		if (!("share" in navigator)) {
			return nofication.error("Sorry, we can't support your device");
		}

		if (navigator.canShare({ files: [file] })) {
			try {
				await navigator.share({
					title: "Images",
					text: "text",
					files: [file],
				});
				saveFile(file, FILE_NAME);
        nofication.success("Download QRCode image success!")
			} catch (e) {
				const message = e instanceof Error ? e.message : "Unknown error.";
				console.error("Error", message);
			}
		} else {
			nofication.error("Sorry, we can't support your device");
		}
	};

	const saveFile = (file: File, name: string) => {
		const a = document.createElement("a");
		const url = URL.createObjectURL(file);
		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	};

	const formatFile = () => {
		const el = document.getElementById("capture-qrCode") as HTMLElement;
		if (el) {
			const option = options(el);
			return DomToImage.toBlob(el, option)
				.then((blob: Blob) => {
					return new File([blob], FILE_NAME, { type: "image/png" });
				})
				.catch((error) => console.error(error));
		}
	};

	const renderMobile = () => {
		return (
			<div
				id="capture-qrCode"
				className="relative mt-6 h-[490px] overflow-hidden rounded-[20px] "
			>
				<img
					src="/assets/images/referral/bg_mobile_qrCode.png"
					className="absolute h-full w-full"
					alt="QRCode"
				/>
				<div className="text-primary-dark absolute top-12 w-full text-center font-semibold">
					<div
						className={clsx(
							"text-primary text-[30px] font-bold leading-[38px]",
							{
								"text-[18px] text-base font-semibold text-typo-secondary leading-7":
									isMobile,
							}
						)}
					>
						{`${"referral:qr_code:title"}`}
					</div>
					<div
						className={clsx("mt-1", {
							"text-xs": isMobile,
						})}
					>
						{"referral:qr_code:description"}
					</div>
				</div>
				<div className="absolute bottom-0 z-10 w-full bg-white bg-opacity-80">
					<div className="flex h-[68px] flex-row items-center justify-between pl-6 pr-4">
						<div className="flex flex-row items-center justify-between gap-x-3">
							<div className="text-typo-secondary flex flex-col gap-1 ">
								<div className="text-xs font-normal">
									{"referral:qr_code:subtitle"}
								</div>
								<div className="text-base font-semibold text-typo-secondary">
									{qrValue}
								</div>
							</div>
							<div className="relative h-[44px] w-[44px] rounded bg-white lg:h-[68px] lg:w-[68px]">
								<div className="absolute left-2/4 top-2/4 -translate-x-1/2 -translate-y-1/2">
									<QRCode
										className="rounded-sm"
										value={`${process.env.NEXT_PUBLIC_APP_URL}/referral?ref=${qrValue}`}
										size={40}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderDesktop = () => {
		return (
			<div className="border border-divider-secondary rounded-md lg:mt-0 mt-5" id="capture-qrCode" >
				<div
					style={{
						backgroundImage:
							"url(/assets/images/referral/bg_desktop_qrCode.png)",
					}}
					className="w-full lg:min-w-[524px] lg:h-[198px] h-[218px]  overflow-hidden bg-cover bg-right bg-no-repeat shadow-md"
				>
					<div className="flex flex-col gap-y-10 p-4">
						<div className="flex flex-col items-start gap-y-3">
							<p className="text-3xl font-bold text-typo-accent font-determination uppercase">
								Join Hakifi
							</p>
							<p className="text-sm text-typo-primary">
								Register now <br />
								Make money together
							</p>
						</div>
					</div>
				</div>
				<div className=" flex items-center justify-between bg-background-tertiary px-4 py-3">
					<div className=" flex items-center justify-start gap-x-1 text-3xl font-determination font-bold text-typo-accent">
						Hakifi
					</div>
					<div className="flex gap-x-2 items-center">
						<div className="text-base text-typo-primary flex flex-col gap-y-2 items-end">
							<p className="text-xs">Referral ID</p>
							<p className="text-typo-accent px-3 py-1 border border-divider-primary bg-background-secondary rounded-md">
								{qrValue}
							</p>
						</div>
						<div className="w-max rounded-md bg-support-white p-2">
							<QRCode
								className="rounded-sm"
								value={`${process.env.NEXT_PUBLIC_APP_URL}/commission?ref=${qrValue}`}
								size={50}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<Modal
			title={""}
			isOpen={openModalQR}
			onRequestClose={handleCloseModalQR}
			contentClassName="lg:!max-w-[600px]"
			className="!text-typo-primary"
			modal
		>
			<>
				{renderDesktop()}
				<Button
					size="lg"
					onClick={() => onShare()}
					variant="primary"
					className="w-full !mt-5 text-center"
				>
					<p className="text-center w-full">Download</p>
				</Button>
			</>
		</Modal>
	);
};

export default ModalQR;
