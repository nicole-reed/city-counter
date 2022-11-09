import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from '@mui/icons-material/Email';
import PlaceIcon from '@mui/icons-material/Place';
import { Button, Container, Grid, TextField } from "@mui/material";
import styles from "../styles/Home.module.css";
import {
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "@firebase/auth";
import { auth, db, provider } from "../firebase";
import { useState } from "react";
import { addDoc, collection, doc, query, runTransaction, setDoc, where } from "@firebase/firestore";
import Layout from "./Layout";

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
        // window.location.href = '/'
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
            // window.location.href = '/'
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Layout>

            <div className="landing">
                {/* <div className="sect-1">
                    <h1>Welcome to Been There</h1>
                    <p>A place where we can easily keep track of all the cities we have traveled to.</p>
                </div> */}
                <div className="sect-a">
                    <div className="overlay">
                        <div className="sect-a-inner">
                            <h2>Where in the world will you go?</h2>

                        </div>
                    </div>
                </div>
                <div className="sect-b">
                    <div className="login">
                        <div className="login-tile">
                            <label>Sign In With Email</label>
                            <TextField fullWidth label="Email" margin="normal" onChange={e => setLoginEmail(e.target.value)} />
                            <TextField fullWidth label="Password" margin="normal" onChange={e => setLoginPassword(e.target.value)} />
                            {/* <Button onClick={signIn} variant="contained" startIcon={<EmailIcon/>} sx={{ mt: 3 }}>Sign In With Email</Button> */}

                            <Button onClick={signIn} variant="contained" startIcon={<EmailIcon />} sx={{ mt: 3 }} style={{ backgroundColor: "#99c8f1" }}>Sign In With Email</Button>
                        </div>
                        <div className="login-tile">
                            <label>Sign Up/In With Google</label>
                            <Button variant="contained" startIcon={<GoogleIcon />} sx={{ mt: 3 }} style={{ backgroundColor: "#99c8f1" }} onClick={loginWithGoogle}>Google</Button>
                        </div>


                        <form className="login-tile">
                            <label>Sign Up With Email</label>
                            <TextField fullWidth label="Email" margin="normal" onChange={e => setSignupEmail(e.target.value)} />
                            <TextField fullWidth label="Password" margin="normal" onChange={e => setSignupPassword(e.target.value)} />
                            <Button onClick={signUp} variant="contained" startIcon={<EmailIcon />} sx={{ mt: 3 }} style={{ backgroundColor: "#99c8f1" }} >Sign Up With Email</Button>
                        </form>
                    </div>
                </div>
            </div>

        </Layout>

    )
}


