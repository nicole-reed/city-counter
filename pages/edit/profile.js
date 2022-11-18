import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth";
import { db, storage } from "../../firebase";
import Layout from "../../components/Layout"
import { Button, Container, Input, TextField, Typography } from "@mui/material";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function Profile() {
    const { currentUser } = useAuth();
    const [imageUpload, setImageUpload] = useState(null)
    const [about, setAbout] = useState('')
    const [newDisplayName, setNewDisplayName] = useState('')
    const [user, setUser] = useState({});

    const [expandedName, setExpandedName] = useState(false);
    const [expandedPic, setExpandedPic] = useState(false);
    const [expandedBio, setExpandedBio] = useState(false);

    const handleBioClick = () => {
        setExpandedBio(!expandedBio);
    };
    const handlePicClick = () => {
        setExpandedPic(!expandedPic);
    };
    const handleNameClick = () => {
        setExpandedName(!expandedName);
    };

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
    }, [currentUser.uid])



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
            const imageRef = ref(storage, `/userPics/${currentUser.uid}/${imageUpload.name}`)
            const snapshot = await uploadBytes(imageRef, imageUpload)
            const url = await getDownloadURL(snapshot.ref)
            await updateProfile(currentUser, { photoURL: url })
            await updateUserPic(url)
            location.reload();
        } catch (error) {
            console.log('error uploading img')
        }
    }

    return (
        <Layout>
            <Container>
                <h1 className="title-sm">{user.displayName} </h1>
                <div className="profile-img-cont">
                    <img className="profile-img" src={user.userPic} alt={'profile pic'} />
                </div>

                <Card className="about-me">
                    <CardHeader
                        title="Change Your Profile Photo"
                    />
                    <CardActions disableSpacing>
                        <ExpandMore
                            expand={expandedPic}
                            onClick={handlePicClick}
                            aria-expanded={expandedPic}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expandedPic} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Input type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }} ></Input>
                            <Button onClick={uploadImage} style={{ color: "#99c8f1" }}>upload image</Button>

                        </CardContent>
                    </Collapse>
                </Card>

                <Card className="about-me">
                    <CardHeader
                        title="Change Your Username"
                    />
                    <CardActions disableSpacing>
                        <ExpandMore
                            expand={expandedName}
                            onClick={handleNameClick}
                            aria-expanded={expandedName}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expandedName} timeout="auto" unmountOnExit>
                        <CardContent>
                            <TextField fullWidth label={`${user.displayName}`} margin="normal" sx={{ mt: 0 }} value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)}></TextField>
                            <Button style={{ color: "#99c8f1" }} onClick={updateDisplayName}>Change</Button>

                        </CardContent>
                    </Collapse>
                </Card>

                <Card className="about-me">
                    <CardHeader
                        title="Edit Bio"
                        subheader={user.aboutMe && `"${user.aboutMe}"`}
                    />
                    <CardActions disableSpacing>
                        <ExpandMore
                            expand={expandedBio}
                            onClick={handleBioClick}
                            aria-expanded={expandedBio}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expandedBio} timeout="auto" unmountOnExit>
                        <CardContent>
                            <TextField multiline maxRows={4} fullWidth label="Write something about yourself..." margin="normal" sx={{ mt: 0 }} value={about} onChange={e => setAbout(e.target.value)} />
                            <Button onClick={updateAbout} style={{ color: "#99c8f1" }}>Submit</Button>
                        </CardContent>
                    </Collapse>
                </Card>

                {/* <div className="about-me">
                    <h2>Change Profile Photo</h2>
                    <Input type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }} ></Input>
                    <Button onClick={uploadImage} style={{ color: "#99c8f1" }}>upload image</Button>
                </div>

                <div className="about-me">
                    {user.aboutMe ? <h2>Change Your Bio</h2> : <h2>Add a Bio</h2>}
                    {user.aboutMe && <Typography className="about-me" variant="p" component="div">"{user.aboutMe}"</Typography>}
                    <TextField multiline maxRows={4} fullWidth label="Write something about yourself..." margin="normal" sx={{ mt: 0 }} value={about} onChange={e => setAbout(e.target.value)} />
                    <Button onClick={updateAbout} style={{ color: "#99c8f1" }}>Submit</Button>

                </div>

                <div className="about-me">
                    <h2>Change Your Name</h2>
                    <TextField fullWidth label={`${user.displayName}`} margin="normal" sx={{ mt: 0 }} value={newDisplayName} onChange={e => setNewDisplayName(e.target.value)}></TextField>
                    <Button style={{ color: "#99c8f1" }} onClick={updateDisplayName}>Change</Button>
                </div> */}

            </Container>
        </Layout>
    )
}