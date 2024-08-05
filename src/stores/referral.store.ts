import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
type Store = {
	openModalEdit: boolean;
	infoFriend: any;
	setOpenModalEdit: (isOpen: boolean) => void;
	errorCreateCode: string;
	setErrorCreateCode: (error: string) => void;
	setOpenModalEditInfo: (isOpen: boolean, friendInfo: any) => void;
	openModalEditInfo: boolean;
	openModalInfo: boolean;
	setOpenModalInfo: (isOpen: boolean) => void;
	setOpenWalletFriend: (open: boolean, wallet: any) => void;
	openWalletFriend: boolean;

};

const useReferralStore = create<Store>()(
	immer((set) => ({
		openModalEdit: false,
		infoFriend: {},
		openModalEditInfo: false,
		openModalInfo: false,
		openWalletFriend: false,
		setOpenModalEdit: (isOpen: boolean) => {
			set((state) => {
				state.openModalEdit = isOpen;
			});
		},
		errorCreateCode: "",
		setErrorCreateCode: (error: string) => {
			set((state) => {
				state.errorCreateCode = error;
			});
		},
		setOpenModalEditInfo: (isOpen: boolean, friend: any) => {
			set((state) => {
				state.openModalEditInfo = isOpen;
				state.infoFriend = friend;
			});
		},
		setOpenModalInfo: (isOpen: boolean) => {
			set((state) => {
				state.openModalInfo = isOpen;
			});
		},
		setOpenWalletFriend: (open: boolean, wallet: any) => {
			set((state) => {
				state.openWalletFriend = open;
				state.infoFriend = wallet;
			});
		},
	}))
);

export default useReferralStore;
