import { Alert, Snackbar, type AlertColor } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { getMessages } from "../services/services"
import type { Message } from "../services/model"

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

    const [messageQueue, setMessageQueue] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
    const [snackBarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const messageSub = getMessages().subscribe({
            next: (message: Message) => {
                setMessageQueue(prev => [...prev, message]);
            },
            error: (err) => {
                console.error("Error receiving messages:", err);
            }
        });

        return () => {
            messageSub.unsubscribe();
        };

    }, []);

    const handleSnackbarClose = useCallback((_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    }, [])

    useEffect(() => {
        if (messageQueue.length > 0 && !snackBarOpen) {
            const nextMessage = messageQueue[0];
            setMessageQueue(prev => prev.slice(1));
            setCurrentMessage(nextMessage);
            sendBrowserNotification(nextMessage);
            setSnackbarOpen(true);
        }
    }, [messageQueue, snackBarOpen]);


    return (
      <Snackbar open={snackBarOpen} autoHideDuration={1500} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          severity={currentMessage?.type as AlertColor}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {currentMessage?.message}
        </Alert>
      </Snackbar>
    );

}