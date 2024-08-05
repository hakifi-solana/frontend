import UserSocket from "@/socket/user.socket";
import useSocketStore from "@/stores/socket.store";
import useWalletStore from "@/stores/wallet.store";
import { useEffect, useRef } from "react";

const useUserSocket = (
) => {
    const token = useWalletStore(state => state.accessToken);
    const socket = useRef<UserSocket | null>(null);

    const { setSocket, setIsSocketConnected } = useSocketStore();
    const onConnect = () => {
        setIsSocketConnected(true);
    };
    const onDisconnect = () => {
        setIsSocketConnected(false);
    };

    useEffect(() => {
        if (token) {
            socket.current = UserSocket.getInstance(token as string);

            setSocket(socket.current);
        }

        socket.current?.on('connect', onConnect);
        socket.current?.on('disconnect', onDisconnect);
        return () => {
            socket.current?.off('connect', onConnect);
            socket.current?.off('disconnect', onDisconnect);
        };
    }, [token]);
};

export default useUserSocket;