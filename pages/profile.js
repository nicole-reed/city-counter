import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../Auth";
import { db, storage } from "../firebase";
import Loading from "../components/Loading";
import Layout from "../components/Layout"
import { Alert, Container, Grid, Snackbar } from "@mui/material";
import Cities from "../components/Cities";
import AddCityForm from "../components/AddCityForm";
import { CityContext } from "./CityContext";

// TODO
// get userID from query and then get the user and all their info from db to display the things we want on the profile


export default function profile() {
    const { currentUser } = useAuth();
    const [cities, setCities] = useState([])
    console.log('cities', cities)
    const cityCount = cities.length
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [city, setCity] = useState({ name: '', country: '', month: '', year: '' })

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

        const cityQuery = query(cityColRef, where("email", "==", currentUser?.email))

        const unsubscribe = onSnapshot(cityQuery, (querySnapshot) => {
            setCities(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })));
            setLoading(false)
        });

        return unsubscribe;
    }, [])

    if (loading) {
        return <Loading type="bubbles" color="lightblue" />
    }

    return (

        <Layout>
            <CityContext.Provider value={{ showAlert }}>
                <Container>
                    <div className="profile">
                        <h1 className="title-sm">Hey {currentUser.displayName} </h1>
                        <h2 className="title-xs">You have been to {cityCount == 1 ? '1 city!' : `${cityCount} cities!`}</h2>
                        {/* <img src={currentUser.photoURL} /> */}
                    </div>

                    <Grid container spacing={{ xs: 1 }} columns={{ xs: 2, s: 4, md: 12 }} mb={2}>

                        <Grid item xs={6} >

                            <Cities />

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

