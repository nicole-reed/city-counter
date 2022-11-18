import { collection, onSnapshot, query, where } from '@firebase/firestore';
import { Card, Container, Typography, Grid, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '../../Auth';
import AddCityForm from '../../components/AddCityForm';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import { db } from '../../firebase';
import { CityContext } from '../components/CityContext';


const Country = () => {
    const router = useRouter();
    const { currentUser } = useAuth();
    const country = router.query
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    // const [city, setCity] = useState({ name: '', country: '', month: '', year: '' })

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

        const cityQuery = query(cityColRef, where("country", "==", country.country), where("userID", "==", currentUser.uid))

        const unsubscribe = onSnapshot(cityQuery, (querySnapshot) => {
            setCities(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })));
            setLoading(false)
        });

        return unsubscribe;
    }, [country.country, currentUser.uid])

    if (loading) return <Loading type="bubbles" color="lightblue" />;
    return (
        <Layout>
            <CityContext.Provider value={{ showAlert }}>
                <Container>
                    <h1 className="title">{country.country}</h1>

                    <Grid container spacing={{ xs: 1 }} columns={{ xs: 2, s: 4, md: 12 }} mb={2}>

                        <Grid item xs={6} >
                            <h1>Cities you have visited in {country.country}:</h1>
                            {cities.length == 0 && <p>None yet!</p>}
                            {cities.map(city =>
                                <Card key={city.id} className="card" onClick={() => router.push(`/cities/${city.id}`)}>
                                    <Typography>{city.name}</Typography>
                                    <p>{city.month} of {city.year}</p>
                                </Card>
                            )}
                        </Grid>

                        <Grid item xs={6} mt={5}>
                            <AddCityForm currentCountry={country.country} />
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

export default Country
