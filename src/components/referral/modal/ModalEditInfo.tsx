import { useForm, Controller } from "react-hook-form";

import { updateUser } from "@/apis/users.api";
import { Wallet } from "@/@type/wallet.type";
import Modal from "@/components/common/Modal";
import clsx from "clsx";
import useWalletStore from "@/stores/wallet.store";
import { useNotification } from "@/components/common/Notification";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
type TProps = {
	userInfo: Wallet;
	open: boolean;
	handleClose: () => void;
};

export function ModalInfo({ userInfo, open, handleClose }: TProps) {
	const form = useForm({ defaultValues: userInfo });
	const {
		handleSubmit,
		watch,
		formState: { errors },
		control,
	} = form;
	const [wallet, setWallet] = useWalletStore((state) => [
		state.wallet,
		state.setWallet,
	]);
	const toast = useNotification();
	const onSubmit = async (data: Wallet) => {
		const params = {
			username: data?.username,
			email: data?.email,
			phoneNumber: data?.phoneNumber,
			refCode: data?.refCode || undefined,
		};
		try {
			const res: any = await updateUser(params);
			if (res) {
				setWallet(res.data);
				toast.success("Update user information successfully!");
			}
		} catch (err) {
			console.log(err);
			toast.error("Update user information failed");
		}
	};
	const handleErrors = (fieldName: string) => {
		return errors[fieldName as keyof Wallet]?.message;
	};
	return (
		<Modal
			title={<div className="text-typo-primary">Personal information</div>}
			isOpen={open}
			onRequestClose={handleClose}
			contentClassName="py-0"
			modal={true}
		>
			<div className="grid gap-4">
				<form {...form}>
					<div className="flex flex-col gap-y-3">
						<Controller
							control={control}
							rules={{
								required: true,
								pattern: {
									value: /^[a-zA-Z0-9_.]+$/,
									message: "Invalid user name",
								},
							}}
							render={({ field: { onChange, value } }) => (
								<div className="py-2 flex flex-col gap-y-1.5">
									<label
										htmlFor="username"
										className="text-sm text-typo-primary"
									>
										Username
									</label>
									<Input
										type="text"
										value={value}
										onChange={onChange}
										wrapperClassInput="rounded-md bg-transparent text-typo-secondary rounded-md border border-divider-secondary"
										size="lg"
									/>
									{handleErrors("username") && (
										<span className="text-xs text-red">
											{handleErrors("username")}
										</span>
									)}
								</div>
							)}
							name="username"
						/>
						<Controller
							control={control}
							rules={{
								required: true,
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Invalid email address",
								},
							}}
							render={({ field: { onChange, value } }) => (
								<div className="py-2  flex flex-col gap-y-1.5">
									<label htmlFor="email" className="text-sm text-typo-primary">
										Email
									</label>
									<Input
										type="email"
										onChange={onChange}
										value={value}
										wrapperClassInput="rounded-md bg-transparent text-typo-secondary rounded-md border border-divider-secondary"
										size="lg"
									/>
									{handleErrors("email") && (
										<span className="text-xs text-red">
											{handleErrors("email")}
										</span>
									)}
								</div>
							)}
							name="email"
						/>

						<Controller
							control={control}
							rules={{
								required: true,
								pattern: {
									value: /^(\+\d{1,3}|0)\d{9}$/,
									message: "Invalid phone number",
								},
							}}
							render={({ field: { onChange, value } }) => (
								<div className="py-2  flex flex-col gap-y-1.5">
									<label
										htmlFor="phoneNumber"
										className="text-sm text-typo-primary"
									>
										Phone number
									</label>
									<Input
										type="tel"
										onChange={onChange}
										value={value}
										wrapperClassInput="rounded-md bg-transparent text-typo-secondary rounded-md border border-divider-secondary"
										size="lg"
									/>
									{handleErrors("phoneNumber") && (
										<span className="text-xs text-red">
											{handleErrors("phoneNumber")}
										</span>
									)}
								</div>
							)}
							name="phoneNumber"
						/>
						{!userInfo?.refCode ? (
							<Controller
								control={control}
								rules={{
									required: false,
									pattern: {
										value: /^[a-zA-Z0-9]+$/,
										message: "Invalid referrer",
									},
								}}
								render={({ field: { onChange, value } }) => (
									<div className="py-2  flex flex-col gap-y-1.5">
										<label
											htmlFor="defaultMyRefCode"
											className="text-sm text-typo-primary"
										>
											Referral by
										</label>
										<Input
											type="text"
											placeholder="Please enter referrer by"
											onChange={onChange}
											value={value || ""}
											wrapperClassInput="rounded-md bg-transparent text-typo-secondary rounded-md border border-divider-secondary"
											size="lg"
										/>
										{handleErrors("refCode") && (
											<span className="text-xs text-red">
												{handleErrors("refCode")}
											</span>
										)}
									</div>
								)}
								name="refCode"
							/>
						) : (
							<div className="py-2  flex flex-col gap-y-1.5">
								<label
									htmlFor="defaultMyRefCode"
									className="text-sm text-typo-primary"
								>
									Referral by
								</label>
								<Input
									type="text"
									placeholder="Please enter referrer by"
									value={userInfo?.refCode || ""}
									wrapperClassInput="rounded-md bg-transparent text-typo-secondary rounded-md border border-divider-secondary"
									size="lg"
									disabled={true}
								/>
							</div>
						)}
					</div>
					<div
						className={clsx(
							"flex w-full justify-center rounded-xxl bg-primary-1 text-white mt-5 pb-5",
							{
								"!bg-light-1": Object.keys(errors).length > 0,
							}
						)}
					>
						<Button
							type="submit"
							className="w-full"
							onClick={handleSubmit(onSubmit)}
							variant="primary"
							size="lg"
						>
							<p className="text-center w-full">Confirm</p>
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
}
