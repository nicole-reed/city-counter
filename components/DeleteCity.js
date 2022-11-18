import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { deleteDoc, doc } from '@firebase/firestore';
import { db } from "../firebase";

export default function DeleteCity() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const cityID = router.query;

    const deleteCity = async (event) => {
        try {
            // to stop the other function from firing
            event.stopPropagation();
            const docRef = doc(db, "cities", `${cityID.id}`);
            await deleteDoc(docRef)
            router.push('/')
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton variant="outlined" onClick={handleClickOpen}>
                <DeleteIcon style={{ color: "#99c8f1" }} />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Permanently delete city?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This cannot be undone.
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={deleteCity} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
