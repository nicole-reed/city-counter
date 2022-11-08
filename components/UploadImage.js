import { useState, useEffect } from 'react'
import { storage } from "../firebase"
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage"
import { useAuth } from '../Auth';
import { Button, Card, CardContent, Container, ImageList, ImageListItem, Input } from '@mui/material';
import { useRouter } from 'next/router';
import Loading from './Loading';
import DeleteImage from './DeleteImage';
import LinearIndeterminate from './LinearIndeterminate';

// TODO
// change filename when uploading so that it includes the userID as well so that we can
// organize images by user and not necessarily by cityID only

function UploadImage({ userID }) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const city = router.query;
    const [imageUpload, setImageUpload] = useState(null)
    console.log('imageUpload', imageUpload)
    console.log('imagelist', imageList)
    const [imageList, setImageList] = useState([])
    const [loading, setLoading] = useState(true)
    const [showProgressBar, setShowProgressBar] = useState(false)

    const uploadImage = async () => {
        try {
            if (imageUpload == null) return;
            setShowProgressBar(true)
            // TODO put uid as first part of filename and change all code accordingly
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

    // TODO make sure we are doing this correctly now
    // const goToImagePage = async (url) => {
    //     const regex = /%2F(.*?)\?/
    //     const [, match] = url.match(regex) || []
    //     // TODO make sure we are doing this right now
    //     const fileName = `${currentUser.uid}/${city.id}/${match}`
    //     router.push(`/images/${fileName}`)
    // }

    useEffect(() => {
        async function getUrls() {
            // TODO make sure we are doing this correctly now
            const imageListRef = ref(storage, `${city.id}/`)
            const response = await listAll(imageListRef)
            const urls = await Promise.all(response.items.map(item => getDownloadURL(item)))
            setImageList(urls)
        }
        getUrls()
        setLoading(false)
    }, []);


    if (loading) { return <Loading type="bubbles" color="lightblue" /> }

    return (
        <Container>

            {!showProgressBar ?
                <ImageList cols={1} gap={8}>
                    {imageList.map((url) => (

                        <ImageListItem key={url}>
                            <img
                                src={url}
                                // srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                alt={`${url}`}
                                loading="lazy"
                                onClick={() => goToImagePage(url)}
                            />
                            {userID == currentUser.uid && <DeleteImage userID={currentUser.uid} cityid={city.id} url={url} />
                            }
                        </ImageListItem>
                    ))}
                </ImageList>
                :
                <LinearIndeterminate color="#99c8f1" />
            }

            <div>
                {userID === currentUser.uid &&
                    <Card sx={{ boxShadow: 3, mt: 2, mb: 2 }}
                        style={{ backgroundColor: '#fafafa' }}>
                        <CardContent>
                            <h2>Add a photo:</h2>
                            <Input type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }} ></Input>
                            <Button onClick={uploadImage} style={{ color: "#99c8f1" }}>upload image</Button>
                        </CardContent>
                    </Card>}
            </div>
        </Container>
    )
}

export default UploadImage
