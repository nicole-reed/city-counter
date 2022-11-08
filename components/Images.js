import { useState, useEffect } from 'react'
import { db, storage } from "../firebase"
import { getDownloadURL, listAll, ref } from "firebase/storage"
import { Container, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { useRouter } from 'next/router';
import Loading from './Loading';
import { doc, getDoc } from '@firebase/firestore';

function Images() {
    const router = useRouter();
    const [imageList, setImageList] = useState([])
    const [loading, setLoading] = useState(true)
    const [isHovering, setIsHovering] = useState(false);
    console.log('imageList', imageList)

    const handleMouseOver = () => {
        setIsHovering(true)
    }

    const handleMouseOut = () => {
        setIsHovering(false)
    }

    // TODO make sure this is working because now im saving images userid/cityid-filename
    const getCityDetails = async (urls) => {
        try {
            const imagesWithCityDetails = await Promise.all(urls.map(async (url) => {
                const regex1 = /(?<=o\/{1})(.*)(?=%2F)/
                const [, cityID] = url.match(regex1) || []
                const docRef = doc(db, "cities", `${cityID}`)
                const docSnap = await getDoc(docRef)
                const city = docSnap.data()
                // console.log('city', city)
                return {
                    url: url,
                    location: `${city.name}, ${city.country}`,
                    user: city.userID
                }
            }))
            return imagesWithCityDetails
        } catch (error) {
            console.log(error.message)
            return []
        }
    }

    useEffect(() => {
        async function getUrls() {
            // TODO figure out how to get all files
            const imageListRef = ref(storage, '/')
            const response = await listAll(imageListRef)
            const folderRefs = response.prefixes
            const folderListResponses = await Promise.all(folderRefs.map(ref => listAll(ref)))
            const imageRefs = []
            for (const res of folderListResponses) {
                imageRefs.push(...res.items)
            }
            const urls = await Promise.all(imageRefs.map(item => getDownloadURL(item)))
            console.log('urls', urls)
            const deets = await getCityDetails(urls)
            // console.log('deets', deets)
            setImageList(deets)
        }
        getUrls()
        setLoading(false)
    }, [setImageList]);

    const goToImagePage = async (url, userID) => {
        const regex1 = /o\/(.*?)%/
        const regex2 = /%2F(.*?)\?/
        const [, match1] = url.match(regex1) || []
        const [, match2] = url.match(regex2) || []
        const fileName = `${match1}/${match2}`
        router.push(`/images/${fileName}/${userID}`)
    }

    if (loading) return <Loading type="bubbles" color="lightblue" />
    if (imageList.length > 0) {
        return (
            <Container>
                <ImageList cols={3} gap={8}>

                    {imageList.map((img) => (
                        <ImageListItem key={img.url}>

                            <img
                                src={img.url}
                                alt={`${img.url}`}
                                loading="lazy"
                                onClick={() => goToImagePage(img.url, img.user)}
                                onMouseOver={handleMouseOver}
                                onMouseOut={handleMouseOut}

                            />
                            {isHovering && <ImageListItemBar
                                sx={{
                                    background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                }}
                                title={img.location}
                                position="top"
                            />}
                        </ImageListItem>
                    ))}

                </ImageList>
            </Container>
        )
    }
    return (
        <Container>
            {/* <ImageList cols={3} gap={8}>

                {imageList.map((img) => (
                    <ImageListItem key={img.url}>
                        <img
                            src={img.url}
                            // srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt={`${img.url}`}
                            loading="lazy"
                            onClick={() => goToImagePage(img.url)}
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}

                        />
                        {isHovering && <ImageListItemBar
                            sx={{
                                background:
                                    'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                            }}
                            title={img.location}
                            position="top"
                        />}
                    </ImageListItem>
                ))} */}

            {/* {urls.map((img) => (
                    <ImageListItem key={img}>
                        <img
                            src={img}
                            // srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt={`${img}`}
                            loading="lazy"
                        // onClick={() => goToImagePage(img)}
                        // onMouseOver={handleMouseOver}
                        // onMouseOut={handleMouseOut}

                        />
                    </ImageListItem>
                ))} */}

            {/* </ImageList> */}
        </Container>
    )

}

export default Images

