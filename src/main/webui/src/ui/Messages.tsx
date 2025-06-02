import { useEffect } from "react"
import { getMessages } from "../services/services"
import type { Message } from "../services/model"
import { SnackbarProvider, enqueueSnackbar, type BaseVariant } from 'notistack';

const displayNotification = (message: Message) => {
    console.log("Displaying notification:", message);
    new Notification(message.message, { icon: `/${message.type}.png` });
}

const sendBrowserNotification = (message: Message) => {
    console.log("Sending browser notification:", message);
    console.log("Notification permission status:", Notification.permission);
    if (!("Notification" in window)) {
        console.error("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        displayNotification(message);
    } else if (Notification.permission !== "denied") {
        console.log("Requesting notification permission");
        Notification.requestPermission().then((permission) => {
            console.log("Notification permission:", permission);
            if (permission === "granted") {
                displayNotification(message);
            }
        });
    }
}

export default function Messages() {

    useEffect(() => {
        const messageSub = getMessages().subscribe({
            next: (message: Message) => {
                enqueueSnackbar(message.message, { variant: message.type as BaseVariant })
                sendBrowserNotification(message);
            },
            error: (err) => {
                console.error("Error receiving messages:", err);
            }
        });

        return () => {
            messageSub.unsubscribe();
        };

    }, []);

    return (
        <SnackbarProvider autoHideDuration={5000} maxSnack={5} anchorOrigin={{ horizontal: "right", vertical: "top" }} variant={'default'}/>
    );

}