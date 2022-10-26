import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import Map from "../../components/Map";
import Layout from "../../components/Layout";
import { Card, Container, Grid, Typography } from "@mui/material";

// import City from "../../components/City";
// import Images from "../../components/Images";

export default function UserProfile({ }) {
    const router = useRouter()
    const userID = router.query.userID[0]
    console.log('userID', userID)
    const [cities, setCities] = useState([])
    console.log('cities', cities)
    const displayName = router.query.userID[1]

    useEffect(() => {
        const cityColRef = collection(db, "cities");

        const cityQuery = query(cityColRef, where("userID", "==", `${userID}`))

        const unsubscribe = onSnapshot(cityQuery, (querySnapshot) => {
            setCities(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })));
        });

        return unsubscribe;
    }, [])

    return (
        <Layout>
            <Container>
                <h2 className="title">{displayName}'s cities</h2>
                <Card className="user-tile" minwidth={"40%"}>
                    <Typography variant="h2" component="div">{displayName}</Typography>
                    <Typography variant="p" component="div">{cities.length} cities visited</Typography>
                    {/* <img src={userPic}></img> */}
                </Card>
                {/* {cities.map(city =>
                    <City key={city.id}
                        id={city.id}
                        name={city.name}
                        country={city.country}
                        month={city.month}
                        year={city.year}
                        details={city.details}
                    />)} */}


                {/* <Images currentUser={userID} /> */}
                <Map cities={cities} />
            </Container>
        </Layout >
    )
}