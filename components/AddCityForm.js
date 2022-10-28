import { addDoc, collection, serverTimestamp } from "@firebase/firestore"
import { Button, Container, TextField } from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react"
import { CityContext } from "../pages/CityContext"
import { db } from "../firebase"
import { useAuth } from "../Auth"
import axios from "axios"

const AddCityForm = ({ currentCountry }) => {
    const inputAreaRef = useRef();
    const { currentUser } = useAuth();
    console.log('currentUser', currentUser)
    const { showAlert } = useContext(CityContext)
    const [city, setCity] = useState({ name: '', country: currentCountry || '', month: '', year: '' })
    console.log('city', city)

    const getCoords = async () => {
        try {
            const searchCity = `${city.name},${city.country}`
            const response = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.NEXT_PUBLIC_GEO_API_KEY}&q=${searchCity}&format=json`)
            console.log('response', response.data)
            const longitude = response.data[0].lon
            const latitude = response.data[0].lat
            return { longitude, latitude }
        } catch (error) {
            console.log(error.message)
            return { longitude: "", latitude: "" }
        }
    }

    const onSubmit = async () => {

        if (city.name == "" || city.country == "" || city.month == "" || city.year == "") {
            showAlert('error', 'All required fields must be filled out')
        } else {
            // add city
            const colRef = collection(db, "cities")
            const { longitude, latitude } = await getCoords()

            // TODO
            // consider rethinking how we are saving the pic, might not need all the user info besides userID
            await addDoc(colRef, { ...city, email: currentUser.email, displayName: currentUser.displayName ? currentUser.displayName : currentUser.email.split("@")[0], userPic: currentUser.photoURL, userID: currentUser.uid, timestamp: serverTimestamp(), longitude, latitude })


            setCity({ name: '', country: '', month: '', year: '', details: '' })
            showAlert('success', `City added`)
        }
    }

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (!inputAreaRef.current.contains(e.target)) {
                console.log('outside input area');
                setCity({ name: '', country: '', month: '', year: '', details: '' })
            } else {
                console.log('inside input area')
            }
        }
        document.addEventListener("mousedown", checkIfClickedOutside)
        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside)
        }

    }, [])

    return (
        <Container>
            <div className="add-city-form" ref={inputAreaRef}>
                <h1>Add A City</h1>
                <TextField fullWidth label="city" margin="normal" required={true} value={city.name} onChange={e => setCity({ ...city, name: e.target.value })} />
                <TextField fullWidth label="country" margin="normal" required={true} value={city.country} onChange={e => setCity({ ...city, country: e.target.value })} />
                <TextField fullWidth label="month" margin="normal" required={true} value={city.month} onChange={e => setCity({ ...city, month: e.target.value })} />
                <TextField fullWidth label="year" margin="normal" required={true} value={city.year} onChange={e => setCity({ ...city, year: e.target.value })} />
                <TextField fullWidth label="details" margin="normal" value={city.details} onChange={e => setCity({ ...city, details: e.target.value })} />
                <Button className="add-city-btn" onClick={onSubmit} variant="contained" sx={{ mt: 3 }} style={{ backgroundColor: "#99c8f1" }}>Submit</Button>
            </div>
        </Container>
    )
}

export default AddCityForm
