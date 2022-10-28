import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import { Button, Grid, TextField } from "@mui/material";
import styles from "../styles/Home.module.css";
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "@firebase/auth";
import { auth, db, provider } from "../firebase";
import { useState } from "react";
import { addDoc, collection, doc, query, runTransaction, setDoc, where } from "@firebase/firestore";

export default function LogIn() {
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [user, setUser] = useState({});
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");



    const loginWithGoogle = async () => {
        const { user } = await signInWithPopup(auth, provider)
        console.log('user', user)
        const userDocRef = doc(db, "users", user.uid);

        // make sure user doesnt already exist before saving to users collection
        await runTransaction(db, async (transaction) => {

            const existingUser = await transaction.get(userDocRef);
            console.log('existing user', existingUser)

            if (existingUser.exists()) {
                return;
            }

            return transaction.set(userDocRef, { displayName: user.displayName, userPic: user.photoURL, email: user.email, userID: user.uid });
        });
        window.location.href = '/'
    }

    const signUp = async () => {
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                signupEmail,
                signupPassword
            );
            console.log(user);

            // make sure user doesnt already exist before saving to users collection
            const userDocRef = doc(db, "users", user.uid);
            await runTransaction(db, async (transaction) => {

                const existingUser = await transaction.get(userDocRef);
                console.log('existing user', existingUser)

                if (existingUser.exists()) {
                    return;
                }
                const placeholderName = user.email.split("@")[0]
                return transaction.set(userDocRef, { displayName: placeholderName, userPic: 'https://user-images.githubusercontent.com/11250/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e.jpg', email: user.email, userID: user.uid });
            });

        } catch (error) {
            console.log(error.message);
        }
    };

    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                loginEmail,
                loginPassword
            );
            window.location.href = '/'
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >

            <h1 className={styles.title}>
                Been There <PlaceIcon sx={{ fontSize: 40 }} />
            </h1>

            <p className={styles.description}>
                A Place To Track Where In The World You Have Been
        </p>

            <div>
                <TextField fullWidth label="Email" margin="normal" onChange={e => setLoginEmail(e.target.value)} />
                <TextField fullWidth label="Password" margin="normal" onChange={e => setLoginPassword(e.target.value)} />
                {/* <Button onClick={signIn} variant="contained" startIcon={<EmailIcon/>} sx={{ mt: 3 }}>Sign In With Email</Button> */}
            </div>
            <Button onClick={signIn} variant="contained" startIcon={<EmailIcon />} sx={{ mt: 3 }}>Sign In With Email</Button>

            <Button variant="contained" startIcon={<GoogleIcon />} sx={{ mt: 3 }} onClick={loginWithGoogle}>
                Sign In With Google
        </Button>

            <form>
                <label>Sign Up</label>
                <TextField fullWidth label="Email" margin="normal" onChange={e => setSignupEmail(e.target.value)} />
                <TextField fullWidth label="Password" margin="normal" onChange={e => setSignupPassword(e.target.value)} />
                <Button onClick={signUp} variant="contained" startIcon={<EmailIcon />} sx={{ mt: 3 }}>Sign Up With Email</Button>
            </form>
        </Grid>
    )
}


