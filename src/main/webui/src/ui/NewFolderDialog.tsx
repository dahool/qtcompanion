
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useState } from "react"

export function NewFolderDialog({open, onClose, parent}: {open: boolean, onClose: (value: string | null) => void, parent: string}) {

    const [folderName, setFolderName] = useState("");

    const handleButton = () => {
        onClose(folderName);
        setFolderName("");
    }

    return (
        <Dialog open={open} onClose={() => onClose(null)}>
            <DialogTitle>Create Folder in {parent}</DialogTitle>
            <DialogContent>
                <TextField id="standard-basic" label="New Folder" variant="standard" value={folderName} onChange={(event) => { setFolderName(event.target.value.trim())}}  />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleButton} className="mt-2">
                    <SaveAsIcon/>
                </Button>
            </DialogActions>
        </Dialog>
    );

}