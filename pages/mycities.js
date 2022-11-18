import { collection, doc, getDoc, onSnapshot, query, where } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { db } from "../firebase";
import Loading from "../components/Loading";
import Layout from "../components/Layout"
import { Alert, Container, Grid, Snackbar } from "@mui/material";
import Cities from "../components/Cities";
import AddCityForm from "../components/AddCityForm";
import { CityContext } from "./CityContext";

export default function MyCities() {
    const { currentUser } = useAuth();
    const [cities, setCities] = useState([])
    const cityCount = cities.length
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [user, setUser] = useState({})

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

    const showAlert = (type, msg) => {
        setAlertMessage(msg);
        setAlertType(type);
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false)
    };

    useEffect(() => {
        const cityColRef = collection(db, "cities");

        const cityQuery = query(cityColRef, where("userID", "==", currentUser.uid))

        const unsubscribe = onSnapshot(cityQuery, (querySnapshot) => {
            setCities(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })));
            setLoading(false)
        });

        return unsubscribe;
    }, [currentUser.uid])

    if (loading) {
        return <Loading type="bubbles" color="lightblue" />
    }

    return (

        <Layout>
            <CityContext.Provider value={{ showAlert }}>
                <Container>
                    <div className="profile">
                        <h1 className="title-sm">Hey {user.displayName} </h1>
                        <h2 className="title-xs">You have been to {cityCount == 1 ? '1 city!' : `${cityCount} cities!`}</h2>
                    </div>

                    <Grid container spacing={{ xs: 1 }} columns={{ xs: 2, s: 4, md: 12 }} mb={2}>

                        <Grid item xs={6} >
                            {cities.length > 0 ? <Cities user={user} /> : ''}
                        </Grid>

                        <Grid item xs={6} >
                            <AddCityForm />
                        </Grid>

                    </Grid>

                    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                            {alertMessage}
                        </Alert>
                    </Snackbar>
                </Container>
            </CityContext.Provider>
        </Layout>

    )
}
