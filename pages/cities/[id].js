import { collection, doc, getDoc, getDocs } from "@firebase/firestore"
import { Grid, Typography, Container, Box, IconButton, Avatar, Tooltip } from "@mui/material"
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import UploadImage from "../../components/UploadImage"
import { db } from "../../firebase"
import Layout from "../../components/Layout";
import { useRouter } from "next/router"
import { useAuth } from "../../Auth";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";

const Detail = ({ cityProps }) => {
    const { currentUser } = useAuth();
    const city = JSON.parse(cityProps)
    const router = useRouter();
    const currentCity = router.query
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getUser() {
            const userDocRef = doc(db, "users", city.userID)
            const docSnap = await getDoc(userDocRef)

            if (docSnap.exists()) {
                setUser(docSnap.data())
            } else {
                console.log('error fetching user')
            }
        }
        getUser()
        setLoading(false)
    }, [])

    if (loading) { return <Loading type="bubbles" color="lightblue" /> }
    return (
        <Layout>
            <Container>

                <div className='profile-items'>
                    <div className="user-tile">
                        {city.userID == currentUser.uid &&
                            <IconButton onClick={() => router.push(`/edit/${currentCity.id}`)}>
                                <ModeEditIcon style={{ color: "#99c8f1" }} />
                            </IconButton>
                        }
                        <Avatar sx={{ width: 96, height: 96 }} src={user.userPic}></Avatar>
                        <Typography variant="p" component="div"><a href={`/users/${user.userID}`}>{user.displayName}</a></Typography>
                        <Typography variant="h4" component="div">{city.name}</Typography>
                        <Typography variant="p" component="div">{city.country}</Typography>
                        <Typography variant="p" component="div">{city.month} {city.year}</Typography>
                        {city.details && <Typography variant="h6" component="div">"{city.details}"</Typography>}

                    </div>
                    {/* <UploadImage userID={user.userID} mt={3} /> */}
                </div>
                <UploadImage userID={user.userID} mt={3} />

            </Container>
        </Layout>
    )
}

export default Detail

export const getStaticPaths = async () => {
    // get all the ids of the cities in the collection
    const snapshot = await getDocs(collection(db, "cities"));
    const paths = snapshot.docs.map(doc => {
        return {
            params: { id: doc.id.toString() }
        }
    })

    return {
        paths,
        fallback: true
    }
}

// will run when page loads
export const getStaticProps = async (context) => {
    const id = context.params.id;

    // get specific doc and stringify the data
    const docRef = doc(db, "cities", id);
    const docSnap = await getDoc(docRef);

    // give to component as props
    return {
        props: { cityProps: JSON.stringify(docSnap.data()) || null }
    }

}