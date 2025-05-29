import { Alert, Snackbar } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { getMessages } from "../services/services"

export default function Messages() {

    const [messageQueue, setMessageQueue] = useState<string[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string | null>(null);
    const [snackBarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        const messageSub = getMessages().subscribe({
            next: (message: string) => {
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
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {currentMessage}
        </Alert>
      </Snackbar>
    );

}