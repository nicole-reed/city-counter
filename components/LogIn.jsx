import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import { signInWithPopup } from "@firebase/auth";
import { auth, db, provider } from "../firebase";
import { doc, runTransaction } from "@firebase/firestore";
import Layout from "./Layout";

export default function LogIn() {

    const loginWithGoogle = async () => {
        const { user } = await signInWithPopup(auth, provider)
        const userDocRef = doc(db, "users", user.uid);

        // make sure user doesnt already exist before saving to users collection
        await runTransaction(db, async (transaction) => {

            const existingUser = await transaction.get(userDocRef);

            if (existingUser.exists()) {
                return;
            }

            return transaction.set(userDocRef, { displayName: user.displayName, userPic: user.photoURL, email: user.email, userID: user.uid });
        });
    }

    return (
        <Layout>

            <div className="landing">
                <div className="sect-a">
                    <div className="overlay">
                        <div className="sect-a-inner">
                            <h2>Where in the world will you go?</h2>

                        </div>
                    </div>
                </div>
                <div className="sect-b">
                    <div className="login" id="login">
                        <div className="login-tile">
                            <label>Sign Up With Google</label>
                            <Button variant="contained" startIcon={<GoogleIcon />} sx={{ mt: 3 }} style={{ backgroundColor: "#99c8f1" }} onClick={loginWithGoogle}>Sign Up With Google</Button>
                        </div>

                        <div className="login-tile">
                            <label>Already Have An Account?</label>
                            <Button variant="contained" startIcon={<GoogleIcon />} sx={{ mt: 3 }} style={{ backgroundColor: "#99c8f1" }} onClick={loginWithGoogle}>Log in With Google</Button>
                        </div>

                    </div>
                </div>
            </div>

        </Layout>

    )
}


