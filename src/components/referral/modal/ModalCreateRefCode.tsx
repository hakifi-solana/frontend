import React from "react";
// import { Slider } from '@/components/common/Slider';

import { useForm, Controller } from "react-hook-form";
import Input from "@/components/common/Input";
import { createRefCode } from "@/apis/referral.api";
import Modal from "@/components/common/Modal";
import useReferralStore from "@/stores/referral.store";
import Button from "@/components/common/Button";
import SliderCustom from "@/components/common/Slider/SliderCustom";
import colors from "@/colors";
interface ModalCreateRefCodeProps {
	isOpen: boolean;
	onRequestClose: () => void;
	handleOpenModalSuccess: () => void;
	handleOpenModalError: () => void;
	setInfoCreate: any;
	handleOpenModalManager: () => void;
}

const ModalCreateRefCode: React.FC<ModalCreateRefCodeProps> = (props) => {
	const form = useForm({
		defaultValues: {
			myPercent: 0,
			code: "",
			description: "",
		},
	});
	const setErrorCreateCode = useReferralStore(
		(state) => state.setErrorCreateCode
	);
	const {
		watch,
		formState: { errors },
		handleSubmit,
		reset,
		control,
	} = form;
	const watchedFields = watch();
	const onSubmit = async (data: any) => {
		props.setInfoCreate(data);
		try {
			const res = await createRefCode({
				code: data.code.toUpperCase(),
				description: data.description,
				myPercent: data.myPercent / 100,
			});
			if (res) {
				props.onRequestClose();
				props.handleOpenModalSuccess();
				reset({ code: "", description: "", myPercent: 0 });
			}
		} catch (e: any) {
			console.log(e);
			props.onRequestClose();
			props.handleOpenModalError();
			reset({ code: "", description: "", myPercent: 0 });
			setErrorCreateCode(e.response.data.message);
		}
	};
	return (
		<Modal
			title={
				<div className="text-typo-primary text-start">Add referral code</div>
			}
			className="!max-w-[500px]"
			isOpen={props.isOpen}
			onRequestClose={() => {
				props.onRequestClose();
				props.handleOpenModalManager();
			}}
			modal={true}
		>
			<div className="grid gap-4 py-4">
				<form {...form} className="flex flex-col gap-y-5">
					<div className="flex w-full flex-col items-start gap-y-2">
						<label
							className="text-sm text-typo-primary flex items-center justify-between w-full"
							htmlFor="code"
						>
							<p>Referral code (Optional)</p>
							<div className="text-typo-secondary">
								<span>{watchedFields.code.length || 0}/8</span>
							</div>
						</label>
						<Controller
							render={({ field: { onChange, value } }) => (
								<Input
									wrapperClassInput="w-full border border-divider-secondary rounded-md bg-support-black"
									className=" w-full bg-transparent focus:outline-none"
									onChange={(e) => onChange(e.target.value.toUpperCase())}
									size="lg"
									value={value}
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
					<div className="flex w-full flex-col items-start gap-y-2">
						<label className="text-sm text-typo-primary">Reward rate</label>
						<Controller
							render={({ field: { onChange, value } }) => (
								<div className="w-full">
									<SliderCustom
										min={0}
										max={100}
										onChange={onChange}
										value={value}
										step={25}
										dots={true}
										dotStyle={(dotValue) => {
											const position =
												dotValue === 0
													? { left: "8px" }
													: dotValue === 100
													? { right: "8px", left: "calc(100% - 8px)" }
													: {};
											return {
												width: "4px",
												height: "12px",
												borderRadius: "1px",
												background: colors.divider.secondary,
												bottom: "-4px",
												zIndex: 1,
												border: "none",
												...position,
											};
										}}
										activeDotStyle={(dotValue) => {
											const position =
												dotValue === 0
													? { left: "8px" }
													: dotValue === 100
													? { right: "8px" }
													: {};
											return {
												width: "4px",
												height: "12px",
												borderRadius: "1px",
												background: colors.typo.accent,
												border: "none",
												bottom: "-4px",
												...position,
												"&:last-child": {
													right: "8px",
												},
											};
										}}
										handleStyle={{
											width: "20px",
											height: "20px",
											borderRadius: "1px",
											background: colors.typo.accent,
											border: "none",
											zIndex: 100,
											bottom: "-2px",
											opacity: 1,
											left:
												watchedFields.myPercent > 0
													? `${watchedFields.myPercent}%`
													: "8px",
										}}
										railStyle={{
											background: colors.divider.secondary,
										}}
										trackStyle={{
											background: colors.typo.accent,
										}}
									/>
									<div className="mt-2 flex w-full items-center justify-between">
										<p className="text-xs text-typo-secondary">
											You get:
											<span className="text-typo-accent">
												{watchedFields.myPercent}%
											</span>
										</p>
										<p className="text-xs text-typo-secondary">
											Friend get:
											<span className="text-typo-accent">
												{100 - watchedFields.myPercent}%
											</span>
										</p>
									</div>
								</div>
							)}
							name="myPercent"
							rules={{
								required: true,
							}}
							control={control}
						/>
					</div>

					<div className="flex w-full flex-col items-start gap-y-2">
						<label
							className="text-sm text-typo-primary flex items-center justify-between w-full"
							htmlFor="description"
						>
							<p>Note</p>
							<div className="text-typo-secondary">
								<span>{watchedFields.description.length || 0}/30</span>
							</div>
						</label>
						<Controller
							render={({ field: { onChange, value } }) => (
								<Input
									wrapperClassInput="bg-support-black border border-divider-secondary rounded-md w-full"
									className=" w-full rounded-md bg-transparent focus:outline-none"
									onChange={onChange}
									value={value}
									size="lg"
								/>
							)}
							rules={{
								required: false,
								maxLength: 30,
							}}
							name="description"
							control={control}
						/>
						{errors.description && (
							<div>
								{watchedFields.description.length > 30
									? "referral:error:biggest_length"
									: "referral:error:required"}{" "}
							</div>
						)}
					</div>
					<div className="flex w-full items-center justify-end gap-x-4">
						<Button
							variant="primary"
							type="submit"
							className="w-full px-4 py-3 text-sm"
							onClick={handleSubmit(onSubmit)}
							size="lg"
						>
							<p className="text-center w-full">Confirm</p>
						</Button>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default ModalCreateRefCode;
