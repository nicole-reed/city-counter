import { collection, doc, getDoc, getDocs } from "@firebase/firestore"
import { Grid, Typography, Container, Box, IconButton } from "@mui/material"
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import UploadImage from "../../components/UploadImage"
import { db } from "../../firebase"
import Layout from "../../components/Layout";
import { useRouter } from "next/router"
import { useAuth } from "../../Auth";

const Detail = ({ cityProps }) => {
    const { currentUser } = useAuth();
    const city = JSON.parse(cityProps)
    const router = useRouter();
    const currentCity = router.query

    return (
        <Layout>
            <Container>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ minHeight: '100vh', maxWidth: "80%", margin: "auto" }}
                >
                    <Grid item>
                        <Grid
                            container
                            spacing={0}
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Typography variant="h2" component="div">
                                {city.name}
                            </Typography>
                            {city.email == currentUser.email &&
                                <IconButton onClick={() => router.push(`/edit/${currentCity.id}`)}>
                                    <ModeEditIcon style={{ color: "#99c8f1" }} />
                                </IconButton>
                            }
                        </Grid>

                        <Typography variant="h5" className="country-title" onClick={() => router.push(`/countries/${city.country}`)}>
                            {city.country}
                        </Typography>
                        <Typography variant="h6">
                            {city.displayName ? city.displayName : city.email.split('@')[0]} visited {city.name} in {city.month} of {city.year}
                        </Typography>
                        <Typography variant="p">
                            {city.details}
                        </Typography>

                    </Grid>
                    <Grid item>
                        <UploadImage email={city.email} />
                    </Grid>
                    {/* <EditCityForm cityDetails={city} cityId={city.id} /> */}
                </Grid>

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