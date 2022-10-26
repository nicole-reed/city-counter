import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { storage } from "../firebase";
import { deleteObject, ref } from '@firebase/storage';

export default function DeleteImage({ cityid, url }) {
    const [open, setOpen] = React.useState(false);
    const regex = /%2F(.*?)\?/
    const [, match] = url.match(regex) || []

    const deleteImage = async () => {
        const fileName = `${cityid}/${match}`
        const deleteRef = ref(storage, `${fileName}`)
        await deleteObject(deleteRef)
        handleClose()
        location.reload();
        // return false;
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton style={{ color: "#99c8f1" }} variant="outlined" onClick={handleClickOpen}>
                <DeleteIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Permanently delete photo?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This cannot be undone.
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={deleteImage} autoFocus>
                        Delete
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
