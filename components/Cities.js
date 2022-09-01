import { collection, onSnapshot, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import City from "../components/City";

const Cities = () => {
    const [cities, setCities] = useState([]);
    useEffect(() => {
        const cityColRef = collection(db, "cities");

        const cityQuery = query(cityColRef)

        const unsubscribe = onSnapshot(cityQuery, (querySnapshot) => {
            setCities(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })));
        });
        
        return unsubscribe;
    }, [])
    return (
        <div>
            {cities.map(city => <City key={city.id}
                name={city.name}
                country={city.country}
                month={city.month} 
                year={city.year}
            />)}
        </div>
    )
}

export default Cities;
