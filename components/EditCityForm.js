import { updateDoc, doc, serverTimestamp } from "@firebase/firestore"
import { Button, Container, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import DeleteCity from "../components/DeleteCity"

import { db } from "../firebase"
import { useRouter } from "next/router"

const EditCityForm = ({ cityDetails }) => {
    const router = useRouter();
    const cityID = router.query;
    const inputAreaRef = useRef();
    const [city, setCity] = useState({ name: cityDetails.name, country: cityDetails.country, month: cityDetails.month, year: cityDetails.year, details: cityDetails.details ? cityDetails.details : '' })
    console.log('city', city)

    const onSubmit = async () => {
        // update city
        const docRef = doc(db, "cities", `${cityID.id}`)
        const update = { ...city, timestamp: serverTimestamp() }
        await updateDoc(docRef, update)
        setCity({ name: city.name, country: city.country, month: city.month, year: city.year, details: city.details })
        router.push(`/cities/${cityID.id}`)
    }

    // useEffect(() => {
    //     const checkIfClickedOutside = e => {
    //         if (!inputAreaRef.current.contains(e.target)) {
    //             console.log('outside input area');
    //             setCity({ name: '', country: '', month: '', year: '', details: '' })
    //         } else {
    //             console.log('inside input area')
    //         }
    //     }
    //     document.addEventListener("mousedown", checkIfClickedOutside)
    //     return () => {
    //         document.removeEventListener("mousedown", checkIfClickedOutside)
    //     }
    // }, [])
    return (
        <Container maxWidth="sm">
            <div className="edit-city-form" ref={inputAreaRef}>
                <div className='edit-form'> <h1>Edit City</h1>
                    <DeleteCity />
                </div>
                <TextField fullWidth label="city" margin="normal" value={city.name} onChange={e => setCity({ ...city, name: e.target.value })} />
                <TextField fullWidth label="country" margin="normal" value={city.country} onChange={e => setCity({ ...city, country: e.target.value })} />
                <TextField fullWidth label="month" margin="normal" value={city.month} onChange={e => setCity({ ...city, month: e.target.value })} />
                <TextField fullWidth label="year" margin="normal" value={city.year} onChange={e => setCity({ ...city, year: e.target.value })} />
                <TextField fullWidth label="details" margin="normal" value={city.details} onChange={e => setCity({ ...city, details: e.target.value })} />
                <Button onClick={onSubmit} variant="contained" sx={{ mt: 3 }} style={{ backgroundColor: "#99c8f1" }}>Submit</Button>
            </div>
        </Container>
    )
}

export default EditCityForm
