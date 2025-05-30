import { Alert, Snackbar, type AlertColor } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { getMessages } from "../services/services"
import type { Message } from "../services/model"

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