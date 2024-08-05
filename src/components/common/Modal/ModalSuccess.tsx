import React from "react";
import Modal from ".";
import SuccessIcon from "../Icons/SuccessIcon";

interface ModalSuccessProps {
	successMessage: JSX.Element | string;
	open: boolean;
	handleClose: any;
	title?: JSX.Element | string;
	footer: JSX.Element;
}

const ModalSuccess: React.FC<ModalSuccessProps> = ({
	successMessage,
	open,
	handleClose,
	title,
	footer,
}) => {
	return (
		<Modal isOpen={open} onRequestClose={handleClose} title={title}>
			<div className="flex flex-col items-center gap-y-5">
				<SuccessIcon />
				<div>{successMessage}</div>
				{footer}
			</div>
		</Modal>
	);
};

export default ModalSuccess;
