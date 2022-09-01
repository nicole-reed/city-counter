import { addDoc, collection } from "@firebase/firestore"
import { Button, TextField } from "@mui/material"
import { useState } from "react"
import { db } from "../firebase"

const AddCityForm = () => {
    const [city, setCity] = useState({ name: '', country: '', month: '', year: ''})

    const onSubmit = async () => {
        const colRef = collection(db, "cities")
        const docRef = await addDoc(colRef, {...city})
        alert(`City with id ${docRef.id} added`)
        setCity({ name: '', country: '', month: '', year: '' })
    }
    return (
        <div className="add-city-form">
            <TextField fullWidth label="name" margin="normal" value={city.name} onChange={e => setCity({...city,name:e.target.value})}/>
            <TextField fullWidth label="country" margin="normal" value={city.country} onChange={e => setCity({ ...city, country: e.target.value })}/>
            <TextField fullWidth label="month" margin="normal" value={city.month} onChange={e => setCity({ ...city, month: e.target.value })}/>
            <TextField fullWidth label="year" margin="normal" value={city.year} onChange={e => setCity({ ...city, year: e.target.value })}/>
            <Button onClick={onSubmit} variant="contained" sx={{ mt: 3 }}>Add City</Button>
        </div>
    )
}

export default AddCityForm
