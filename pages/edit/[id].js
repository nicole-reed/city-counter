import { collection, doc, getDoc, getDocs } from "@firebase/firestore"
import { Container, Box } from "@mui/material"
import EditCityForm from "../../components/EditCityForm"
import { db } from "../../firebase"
import Layout from "../../components/Layout";
import { useRouter } from "next/router"
import { useAuth } from "../../Auth";


const Detail = ({ cityProps }) => {
    const city = JSON.parse(cityProps)
    const router = useRouter();
    const { currentUser } = useAuth();

    if (currentUser.userID !== city.userID) {
        router.push('/')
    }

    return (
        <Layout>
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} mt={3}>
                </Box>

                <EditCityForm cityDetails={city} cityId={city.id} />

            </Container>
        </Layout >
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