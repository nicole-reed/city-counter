import { doc, getDoc } from "@firebase/firestore"
import { getDownloadURL, ref } from "@firebase/storage"
import { Avatar, Container, ImageList, ImageListItem } from "@mui/material"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "../../components/Layout"
import Loading from "../../components/Loading"
import { db, storage } from "../../firebase"

export default function Image() {
    const router = useRouter()
    const fileName = router.query.filename
    console.log('filename', fileName)
    const cityID = fileName[0]
    const file = fileName[1]
    const userID = fileName[2]
    const [image, setImage] = useState([])
    const [loading, setLoading] = useState(true)
    const [city, setCity] = useState({})
    console.log(city.userPic)
    const [user, setUser] = useState({})
    console.log('user', user)

    // TODO
    // getUser() from id in path to fetch that user's pic to user for the avatar

    useEffect(() => {
        async function getUser() {
            const userDocRef = doc(db, "users", userID)
            const docSnap = await getDoc(userDocRef)

            if (docSnap.exists()) {
                setUser(docSnap.data())
            } else {
                console.log('error fetching user')
            }

        }
        getUser()
    }, [city])

    const getCity = async () => {
        const docRef = doc(db, "cities", `${cityID}`)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            setCity(docSnap.data())
        } else {
            console.log('No doc')
        }
        setLoading(false)
    }

    useEffect(() => {
        async function getImage() {
            // const pathRef = ref(storage, `${userID}/${cityID}/${file}`)
            const pathRef = ref(storage, `${cityID}/${file}`)

            const url = await getDownloadURL(pathRef)
            setImage(url)
        }
        getImage()
        getCity()
    }, []);

    if (loading) return <Loading type="bubbles" color="lightblue" />;
    return (
        <Layout>
            <Container>
                <h2><a href={`/cities/${cityID}`}>{city.name}</a>, <a href={`/countries/${city.country}`}>{city.country}</a></h2>
                <div className='pic-info'>
                    <Avatar src={user.userPic}></Avatar>
                    <p><a href={`/users/${user.userID}`}>{user.displayName}</a></p>
                </div>
                <ImageList cols={1} gap={8}>
                    <ImageListItem >
                        <img src={image}>
                        </img>
                    </ImageListItem>
                </ImageList>
            </Container>
        </Layout>
    )
}
