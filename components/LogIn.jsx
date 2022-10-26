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
import { auth, provider } from "../firebase";
import { useState } from "react";

export default function LogIn() {
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [user, setUser] = useState({});
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const loginWithGoogle = () => {
        signInWithPopup(auth, provider)
    }

    const signUp = async () => {
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                signupEmail,
                signupPassword
            );
            console.log(user);
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


