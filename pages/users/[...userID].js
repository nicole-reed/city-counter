import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "@firebase/firestore";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase";
// import Map from "../../components/Map";
import Layout from "../../components/Layout";
import { Avatar, Button, Container, ImageList, ImageListItem, Typography } from "@mui/material";
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getDownloadURL, listAll, ref } from "@firebase/storage";
import Loading from "../../components/Loading";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAuth } from "../../Auth";

export default function UserProfile({ }) {
    const { currentUser } = useAuth();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('sm'));
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const userID = router.query.userID[0]
    const [cities, setCities] = useState([])
    const shortCityList = cities.slice(0, 9)
    const [cityList, setCityList] = useState(shortCityList)
    const [showAllCities, setShowAllCities] = useState(false)
    const [user, setUser] = useState({})
    const [imageList, setImageList] = useState([])
    const filteredImageList = imageList.flat()
    const [follows, setFollows] = useState(false)


    const handleFollowClick = async (userID) => {
        const userDocRef = doc(db, "users", currentUser.uid)
        const profileUserRef = doc(db, "users", userID)

        await updateDoc(userDocRef, {
            follows: arrayUnion(userID)
        })

        await updateDoc(profileUserRef, {
            followers: arrayUnion(currentUser.uid)
        })
        setFollows(true)
    }

    const handleUnfollowClick = async (userID) => {
        const userDocRef = doc(db, "users", currentUser.uid)
        const profileUserRef = doc(db, "users", userID)

        await updateDoc(userDocRef, {
            follows: arrayRemove(userID)
        })

        await updateDoc(profileUserRef, {
            followers: arrayRemove(currentUser.uid)
        })
        setFollows(false)
    }

    const getFollowers = async () => {
        const userRef = collection(db, "users");
        const userQ = query(userRef, where("userID", "==", userID));

        const querySnapshot = await getDocs(userQ);
        querySnapshot.forEach((doc) => {
            const userDoc = doc.data()
            if (userDoc.followers.includes(`${currentUser.uid}`)) {
                setFollows(true)
            }
        });
    }

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
        getFollowers()
        setLoading(false)
    }, [userID])

    useEffect(() => {
        async function getUrls() {
            const cityIDs = cities.map(city => city.id)
            const imageListRefs = cityIDs.map(async (id) => {
                const imageListRef = ref(storage, `${id}/`)
                const response = await listAll(imageListRef)
                const urls = await Promise.all(response.items.map(item => getDownloadURL(item)))
                setImageList((prev) => [...prev, urls])
            })
        }
        getUrls()
    }, [cities]);


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
    }, [userID])

    const goToCityPage = async (url, userID) => {
        const regex = /o\/(.*?)%/
        const [, match] = url.match(regex) || []
        const cityID = `${match}`
        router.push(`/cities/${cityID}`)
    }

    const toggleCityList = async () => {
        if (showAllCities == true) {
            setCityList(cities)
        } else {
            setCityList(shortCityList)
        }
        setShowAllCities(!showAllCities)
    }

    if (loading) return <Loading type="bubbles" color="lightblue" />;
    return (
        <Layout>
            <Container>
                <div className='profile-items'>
                    <div className="user-tile">
                        <Avatar sx={{ width: 150, height: 150 }} src={user.userPic}></Avatar>
                        <Typography variant="h4" component="div">{user.displayName}</Typography>
                        {user.userID !== currentUser.uid && <>
                            {follows ? <Button style={{ color: "#99c8f1" }} onClick={() => handleUnfollowClick(user.userID)}>Unfollow</Button> : <Button style={{ color: "#99c8f1" }} onClick={() => handleFollowClick(user.userID)}>Follow</Button>}
                        </>}
                        {user.aboutMe && <Typography variant="p" component="div">{user.aboutMe}</Typography>}
                        <LocationCityOutlinedIcon sx={{ color: "#99c8f1" }} fontSize="large" />
                        <Typography variant="p" component="div" style={{ fontWeight: "bolder" }}>{cities.length} cities visited</Typography>
                        {showAllCities == false ?
                            <>
                                {shortCityList.map(city =>
                                    <li className="user-cities-list-item" key={city.id}><a href={`/cities/${city.id}`}>{city.name}</a></li>
                                )}
                                {cities.length > 10 && <button className="btn" onClick={toggleCityList}><ExpandMoreIcon fontSize="small" /></button>}

                            </>
                            :
                            <>
                                {cities.map(city =>
                                    <li className="user-cities-list-item" key={city.id}><a href={`/cities/${city.id}`}>{city.name}</a></li>
                                )}
                                <button className="btn" onClick={toggleCityList}><ExpandLessIcon fontSize="small" /></button>
                            </>}
                    </div>
                    {/* <Map cities={cities} /> */}

                </div>
                <ImageList cols={matches ? 3 : 1} gap={8}>

                    {filteredImageList.map((img) => (
                        <ImageListItem key={img}>
                            <img
                                src={img}
                                alt={`${img}`}
                                loading="lazy"
                                onClick={() => goToCityPage(img)}

                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Container>
        </Layout >
    )
}