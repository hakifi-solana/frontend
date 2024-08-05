import { addReferralCode } from "@/apis/referral.api";
import CommonInput from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import clsx from "clsx";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useNotification } from "@/components/common/Notification";
import useWalletStore from "@/stores/wallet.store";
import Button from "@/components/common/Button";
interface ModalAddReferralCodeProps {
	open: boolean;
	onClose: () => void;
}

const ModalAddReferralCode: React.FC<ModalAddReferralCodeProps> = (props) => {
	const form = useForm({
		defaultValues: {
			code: "",
		},
	});
	const {
		watch,
		formState: { errors },
		handleSubmit,
		setValue,
		control,
		setError,
	} = form;
	const toast = useNotification();
	const setWallet = useWalletStore((state) => state.setWallet);
	const pasteFromClipboard = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault(); // Prevent form submission
		try {
			const text = await navigator.clipboard.readText();
			if (text.length > 8) {
				setError("code", { message: "Referral biggest length" });
			}
			return setValue("code", text.toUpperCase());
		} catch (error) {
			console.error("Failed to read text from clipboard:", error);
			return "";
		}
	};

	const handleAddReferralCode = async (data: any) => {
		try {
			const res = await addReferralCode({ code: data.code });

			if (res) {
				setWallet(res.data);
				toast.success("Add referral code successfully!");
			}
			props.onClose();
		} catch (err) {
			toast.error("Add referral code failed");
			return err;
		}
	};

	const watchedFields = watch();
	return (
		<Modal
			isOpen={props.open}
			onRequestClose={props.onClose}
			title={
				<div className="text-typo-primary text-start">Enter referral code</div>
			}
			modal={true}
		>
			<form {...form} className="flex flex-col gap-y-5">
				<div className="text-typo-primary text-start lg:hidden block mt-5 text-xl">
					Enter referral code
				</div>
				<div>
					<p className="text-typo-primary text-sm mb-4">Referral by</p>

					<Controller
						render={({ field: { onChange, value } }) => (
							<CommonInput
								wrapperClassInput="w-full resize-none rounded-md bg-support-black"
								suffix={
									<button
										onClick={(e) => pasteFromClipboard(e)}
										className="text-grey-1 hover:text-primary-1"
									>
										Paste
									</button>
								}
								value={value}
								onChange={(e) => onChange(e.target.value.toUpperCase())}
								size="lg"
								placeholder="Enter referral code"
							/>
						)}
						rules={{
							required: true,
							maxLength: 8,
							pattern: /^[a-zA-Z0-9]*$/,
						}}
						name="code"
						control={control}
					/>
					{errors.code && (
						<div className="text-xs text-red">
							{watchedFields.code.length > 8
								? "referral:error:biggest_length"
								: "referral:error:required"}
						</div>
					)}
				</div>
				<Button
					size="lg"
					variant="primary"
					onClick={handleSubmit(handleAddReferralCode)}
					disabled={watchedFields.code.length === 0}
				>
					<p className="text-center w-full">Confirm</p>
				</Button>
			</form>
		</Modal>
	);
};

export default ModalAddReferralCode;
