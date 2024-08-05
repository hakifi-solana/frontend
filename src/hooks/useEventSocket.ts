import useSocketStore from "@/stores/socket.store";
import { useEffect } from "react";
import { useAccount } from "wagmi";

const useEventSocket = (
    event: string,
    callback: (data: any) => void,
) => {
    const { isConnected } = useAccount();
    const { socket, isSocketConnected } = useSocketStore();

    useEffect(() => {
        if (!isConnected) {
            return;
        }
        if (!isSocketConnected) {
            console.log("Log out disconnect");
            socket?.disconnect();
        }

        console.log('user socket', socket);

        socket?.subscribe(event, callback);
        return () => {
            socket?.unsubscribe(event, callback);
        };
    }, [callback, isConnected, isSocketConnected]);
};

export default useEventSocket;