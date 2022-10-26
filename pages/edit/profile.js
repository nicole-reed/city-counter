import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth";
import { storage } from "../../firebase";
import Loading from "../../components/Loading";
import Layout from "../../components/Layout"
import { Alert, Button, Container, Grid, Input, Snackbar, Typography } from "@mui/material";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "@firebase/storage";
import LinearIndeterminate from '../../components/LinearIndeterminate';

export default function profile() {
    const { currentUser } = useAuth();
    const [newDisplayName, setNewDisplayName] = useState(currentUser.displayName)
    const [imageUpload, setImageUpload] = useState(null)
    const [profilePic, setProfilePic] = useState(currentUser.photoURL)
    const [showProgressBar, setShowProgressBar] = useState(false)

    const uploadImage = async () => {
        try {
            if (imageUpload == null) return;
            setShowProgressBar(true)
            const imageRef = ref(storage, `/userPics/${currentUser.displayName}/${imageUpload.name}`)
            const snapshot = await uploadBytes(imageRef, imageUpload)
            const url = await getDownloadURL(snapshot.ref)
            await updateProfile(currentUser, { photoURL: url })
            setProfilePic(url)
            setShowProgressBar(false)
            console.log('profile pic set')
        } catch (error) {
            console.log('error uploading img')
        }
    }

    const changeDisplayName = async () => {
        await updateProfile(currentUser, { displayName: newDisplayName })
        console.log('display name changed')
        location.reload();
    }

    // useEffect(() => {
    //     async function getUrls() {
    //         const imageListRef = ref(storage, `/userPics/${currentUser.displayName}`)
    //         const response = await listAll(imageListRef)
    //         const urls = await Promise.all(response.items.map(item => getDownloadURL(item)))
    //         setImageList(urls)
    //     }
    //     getUrls()
    // }, [])

    return (

        <Layout>

            <Container>
                <h1 className="title-sm">Hey {currentUser.displayName ? currentUser.displayName : currentUser.email.split('@')[0]} </h1>
                {!showProgressBar && profilePic ?
                    <img className="profile-img" src={profilePic} /> :
                    <LinearIndeterminate />
                }


                <Grid container spacing={{ xs: 1 }} columns={{ xs: 2, s: 4, md: 12 }} mb={2}>
                    <Grid item xs={6}>

                        <h2>Change Profile Photo</h2>

                        <Input type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }} ></Input>
                        <Button onClick={uploadImage} style={{ color: "#99c8f1" }}>upload image</Button>
                    </Grid>
                    {/* <Grid item xs={6}>

                        <h2>Change Display Name</h2>

                        <Input type="text" placeholder={currentUser.displayName} onChange={e => setNewDisplayName(e.target.value)}></Input>
                        <Button style={{ color: "#99c8f1" }} onClick={changeDisplayName}>Change</Button>
                    </Grid> */}
                </Grid>



            </Container>

        </Layout >

    )
}