import Modal from "@/components/common/Modal";
import useReferralStore from "@/stores/referral.store";
import { ArrowLeft } from "lucide-react";
import React from "react";
import dayjs from "dayjs";
import { substring } from "@/utils/helper";
import Button from "@/components/common/Button";
interface ModalEditDescriptionProps {
	isOpen: boolean;
	onRequestClose: () => void;
	handleUpdateDescription?: () => void;
	note: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	defaultNote: any;
	refNote?: boolean;
}

const ModalEditDescription: React.FC<ModalEditDescriptionProps> = ({
	isOpen,
	onRequestClose,
	handleUpdateDescription,
	note,
	onChange,
	defaultNote,
	refNote = true,
}) => {
	const [friendInfo] = useReferralStore((state) => [state.infoFriend]);
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={onRequestClose}
			title={
				<div className="flex w-full flex-col items-start text-start">
					{refNote ? (
						<ArrowLeft
							className="h-5 w-5 text-grey-1"
							onClick={onRequestClose}
						/>
					) : null}
					<p className="flex-1 text-center text-typo-primary">Edit Note</p>
				</div>
			}
			modal={true}
		>
			<div className="flex flex-col gap-y-3">
				{!refNote ? (
					<div className="p-4 flex flex-col items-center gap-y-4 border bg-support-black border-divider-secondary rounded-md">
						<div className="w-full flex items-center justify-between">
							<p className="text-typo-secondary text-sm">Wallet address</p>
							<p className="text-typo-primary text-sm">
								{substring(friendInfo?.walletAddress)}
							</p>
						</div>
						<div className="w-full flex items-center justify-between">
							<p className="text-typo-secondary text-sm">Date of referral</p>
							<p className="text-typo-primary text-sm">
								{dayjs(friendInfo?.createdAt).format("DD/MM/YYYY")}
							</p>
						</div>
					</div>
				) : null}
				<p className="text-typo-primary mt-5">Note</p>
				<textarea
					className="h-[128px] w-full resize-none rounded-xxl bg-support-black border border-divider-secondary rounded-md text-typo-secondary p-4"
					placeholder={defaultNote || "Enter your note"}
					onChange={(e) => onChange(e)}
					value={note}
					defaultValue={defaultNote}
				/>
				<Button
					onClick={handleUpdateDescription}
					size="lg"
					variant="primary"
					className="w-full mt-5"
					disabled={note === defaultNote && note?.length === 0}
					
				>
					<p className="text-center w-full">Confirm</p>
				</Button>
			</div>
		</Modal>
	);
};

export default ModalEditDescription;
