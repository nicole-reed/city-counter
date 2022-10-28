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
    const cityID = fileName[0]
    const file = fileName[1]
    const [image, setImage] = useState([])
    const [loading, setLoading] = useState(true)
    const [city, setCity] = useState({})
    console.log(city.userPic)

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
            const pathRef = ref(storage, `${cityID}/${file}`)
            const url = await getDownloadURL(pathRef)
            setImage(url)
        }
        getImage()
        getCity()
    }, []);

    if (loading) return <Loading />;
    return (
        <Layout>
            <Container>
                <h2><a href={`/cities/${cityID}`}>{city.name}</a>, <a href={`/countries/${city.country}`}>{city.country}</a></h2>
                <div className='pic-info'>
                    <Avatar src={city.userPic}></Avatar>
                    <p><a href={`/users/${city.userID}/${city.displayName ? city.displayName : city.email.split("@")[0]}`}>{city.displayName}</a></p>
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
