import { addDoc, collection, serverTimestamp } from "@firebase/firestore"
import { Button, Container, MenuItem, TextField } from "@mui/material"
import { useContext, useEffect, useRef, useState } from "react"
import { CityContext } from "../pages/CityContext"
import { db } from "../firebase"
import { useAuth } from "../Auth"
import axios from "axios"

const AddCityForm = ({ currentCountry }) => {
    const inputAreaRef = useRef();
    const { currentUser } = useAuth();
    const { showAlert } = useContext(CityContext)
    const [city, setCity] = useState({ name: '', country: currentCountry || '', month: '', year: '' })

    const countryList = [
        "Abkhazia",
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory (the)",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands",
        "Colombia",
        "Comoros",
        "Congo",
        "Cook Islands",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Democratic Republic of Congo",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands",
        "Faroe Islands",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "North Korea",
        "Northern Mariana Islands",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "North Macedonia",
        "Romania",
        "Russia",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "Somaliland",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Korea",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Svalbard",
        "Sweden",
        "Switzerland",
        "Syria",
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States Minor Outlying Islands",
        "United States of America",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela",
        "Vietnam",
        "Virgin Islands (British)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
        "Åland Islands"
    ];

    const getCoords = async () => {
        try {
            const searchCity = `${city.name},${city.country}`
            const response = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.NEXT_PUBLIC_GEO_API_KEY}&q=${searchCity}&format=json`)
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

            await addDoc(colRef, { ...city, email: currentUser.email, displayName: currentUser.displayName, userPic: currentUser.photoURL, userID: currentUser.uid, timestamp: serverTimestamp(), longitude, latitude })

            setCity({ name: '', country: '', month: '', year: '', details: '' })
            showAlert('success', `City added`)
        }
    }

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (!inputAreaRef.current.contains(e.target)) {
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
                <TextField select fullWidth label="country" margin="normal" required={true} value={city.country} onChange={e => setCity({ ...city, country: e.target.value })}>{countryList.map((country) => (
                    <MenuItem value={country}>{country}</MenuItem>
                ))}</TextField>
                <TextField fullWidth label="city" margin="normal" required={true} value={city.name} onChange={e => setCity({ ...city, name: e.target.value })} />
                <TextField fullWidth label="month" margin="normal" required={true} value={city.month} onChange={e => setCity({ ...city, month: e.target.value })} />
                <TextField fullWidth label="year" margin="normal" required={true} value={city.year} onChange={e => setCity({ ...city, year: e.target.value })} />
                <TextField fullWidth label="details" margin="normal" value={city.details} onChange={e => setCity({ ...city, details: e.target.value })} />
                <Button className="add-city-btn" onClick={onSubmit} variant="contained" sx={{ mt: 3 }} style={{ backgroundColor: "#99c8f1" }}>Submit</Button>
            </div>
        </Container>
    )
}

export default AddCityForm
