import { useState, useEffect } from 'react'
import { storage } from "../firebase"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { useAuth } from '../Auth';
import { Button, Card, CardContent, Container, ImageList, ImageListItem, Input } from '@mui/material';
import { useRouter } from 'next/router';
import Loading from './Loading';
import DeleteImage from './DeleteImage';
import LinearIndeterminate from './LinearIndeterminate';

function UploadImage({ email }) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const city = router.query;
    const [imageUpload, setImageUpload] = useState(null)
    console.log('imageUpload', imageUpload)
    const [imageList, setImageList] = useState([])
    const [loading, setLoading] = useState(true)
    const [showProgressBar, setShowProgressBar] = useState(false)

    const uploadImage = async () => {
        try {
            if (imageUpload == null) return;
            setShowProgressBar(true)
            const imageRef = ref(storage, `${city.id}/${imageUpload.name}`)
            const snapshot = await uploadBytes(imageRef, imageUpload)
            const url = await getDownloadURL(snapshot.ref)
            console.log('url', url)

            setImageList((prev) => [...prev, url])
            setShowProgressBar(false)
        } catch (error) {
            console.log('error')
        }
    }

    const goToImagePage = async (url) => {
        const regex = /%2F(.*?)\?/
        const [, match] = url.match(regex) || []
        const fileName = `${city.id}/${match}`
        router.push(`/images/${fileName}`)
    }

    useEffect(() => {
        async function getUrls() {
            const imageListRef = ref(storage, `${city.id}`)
            const response = await listAll(imageListRef)
            const urls = await Promise.all(response.items.map(item => getDownloadURL(item)))
            setImageList(urls)
        }
        getUrls()
        setLoading(false)
    }, []);


    if (loading) { return <Loading /> }
    return (
        <Container>

            {!showProgressBar ?
                <ImageList cols={3} gap={8}>
                    {imageList.map((url) => (

                        <ImageListItem key={url}>
                            <img
                                src={url}
                                // srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                alt={`${url}`}
                                loading="lazy"
                                onClick={() => goToImagePage(url)}
                            />
                            {email == currentUser.email && <DeleteImage cityid={city.id} url={url} />
                            }
                        </ImageListItem>
                    ))}
                </ImageList>
                :
                <LinearIndeterminate color="#99c8f1" />
            }

            {email === currentUser.email &&
                <Card sx={{ boxShadow: 3, mt: 2, mb: 2 }}
                    style={{ backgroundColor: '#fafafa' }}>
                    <CardContent>
                        <h2>Add a photo:</h2>
                        <Input type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }} ></Input>
                        <Button onClick={uploadImage} style={{ color: "#99c8f1" }}>upload image</Button>
                    </CardContent>
                </Card>}
        </Container>
    )
}

export default UploadImage
