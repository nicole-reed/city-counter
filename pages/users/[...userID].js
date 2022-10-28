import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import Map from "../../components/Map";
import Layout from "../../components/Layout";
import { Avatar, Card, Container, Grid, Typography } from "@mui/material";

export default function UserProfile({ }) {
    const router = useRouter()
    const userID = router.query.userID[0]
    console.log('userID', userID)
    const [cities, setCities] = useState([])
    console.log('cities', cities)
    const displayName = router.query.userID[1]

    // TODO
    // get userID from query and then get the user and all their info from db to display the things we want on the user tile
    // const getUser = async () => {
    // 
    // }

    // TODO
    // get images with users id so we canhavea little gallery of the images that belong to this user

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
                <div className='profile-items'>
                    <div className="user-tile">
                        {/* <Avatar sx={{ width: 96, height: 96 }} src={cities[0].userPic}></Avatar> */}
                        <Typography variant="h4" component="div">{displayName}</Typography>
                        <Typography variant="p" component="div">{cities.length} cities visited</Typography>

                    </div>
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
                </div>
            </Container>
        </Layout >
    )
}