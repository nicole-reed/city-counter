import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import City from "./City";
import { useAuth } from "../Auth";
import Loading from "./Loading";
import { Container } from "@mui/material";

const Cities = ({ user }) => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();


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
    } else {
        return (
            <Container>
                {cities.map(city =>
                    <City key={city.id}
                        id={city.id}
                        name={city.name}
                        country={city.country}
                        month={city.month}
                        year={city.year}
                        details={city.details}
                    />)}
            </Container>

        )
    }
}

export default Cities;
