import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth";
import { db, storage } from "../../firebase";
import Loading from "../../components/Loading";
import Layout from "../../components/Layout"
import { Alert, Button, Container, Grid, Input, Snackbar, TextField, Typography } from "@mui/material";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "@firebase/storage";
import LinearIndeterminate from '../../components/LinearIndeterminate';
import { doc, getDoc, updateDoc } from "@firebase/firestore";

export default function profile() {
    const { currentUser } = useAuth();
    const [imageUpload, setImageUpload] = useState(null)
    const [about, setAbout] = useState('')
    const [newDisplayName, setNewDisplayName] = useState('')
    const [user, setUser] = useState({});
    console.log('user', user)


    // TODO
    // make sure we are updating the user doc in the user's collection when uploading img
    // deide if i want them to be able to chnge their displayName
    // add forms to write 'about me' section 

    useEffect(() => {
        async function getUser() {
            const userDocRef = doc(db, "users", currentUser.uid)
            const docSnap = await getDoc(userDocRef)

            if (docSnap.exists()) {
                setUser(docSnap.data())
            } else {
                console.log('error fetching user')
            }

        }
        getUser()
    }, [])



    const updateUserPic = async (url) => {
        const userDocRef = doc(db, "users", currentUser.uid)
        await updateDoc(userDocRef, {
            userPic: url
        })
        location.reload();
    }

    const updateDisplayName = async () => {
        const userDocRef = doc(db, "users", currentUser.uid)
        await updateDoc(userDocRef, {
            displayName: newDisplayName
        })
        location.reload();
    }

    const updateAbout = async () => {
        const userDocRef = doc(db, "users", currentUser.uid)
        await updateDoc(userDocRef, {
            aboutMe: about
        })
        location.reload();
    }


    const uploadImage = async () => {
        try {
            if (imageUpload == null) return;
            setShowProgressBar(true)
            const imageRef = ref(storage, `/userPics/${currentUser.uid}/${imageUpload.name}`)
            const snapshot = await uploadBytes(imageRef, imageUpload)
            const url = await getDownloadURL(snapshot.ref)
            await updateProfile(currentUser, { photoURL: url })
            await updateUserPic(url)
            setShowProgressBar(false)
            location.reload();
            console.log('profile pic set')
        } catch (error) {
            console.log('error uploading img')
        }
    }

    return (

        <Layout>

            <Container>
                <h1 className="title-sm">Hey {user.displayName} </h1>

                <img className="profile-img" src={user.userPic} />

                <div className="about-me">
                    <h2>Change Profile Photo</h2>
                    <Input type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }} ></Input>
                    <Button onClick={uploadImage} style={{ color: "#99c8f1" }}>upload image</Button>
                </div>

                <div className="about-me">
                    {user.aboutMe ? <h2>Change Your Bio</h2> : <h2>Add a Bio</h2>}
                    {user.aboutMe && <Typography className="about-me" variant="p" component="div">"{user.aboutMe}"</Typography>}
                    <TextField fullWidth label="Write something about yourself..." margin="normal" sx={{ mt: 0 }} value={about} onChange={e => setAbout(e.target.value)} />
                    <Button onClick={updateAbout} style={{ color: "#99c8f1" }}>Submit</Button>
                </div>

                <div className="about-me">
                    <h2>Change Your Name</h2>
                    <TextField fullWidth label={`${user.displayName}`} margin="normal" sx={{ mt: 0 }} value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)}></TextField>
                    <Button style={{ color: "#99c8f1" }} onClick={updateDisplayName}>Change</Button>
                </div>

            </Container>
        </Layout>
    )
}