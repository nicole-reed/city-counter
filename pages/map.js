import ReactTooltip from "react-tooltip";
import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useAuth } from "../Auth"
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import Loading from "../components/Loading";
import { useRouter } from "next/router";
import Layout from "../components/Layout";


function Map() {
    const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
    const router = useRouter()
    const [content, setContent] = useState("");
    const { currentUser } = useAuth();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);

    const countries = cities.map(city => city.country)

    const citiesWithCords = cities.map((city) => {
        return {
            markerOffset: 1,
            name: `${city.name}`,
            coordinates: [city.longitude, city.latitude],
            id: city.id
        }
    })

    const markers = citiesWithCords.filter(marker => marker.coordinates[0] !== '')

    useEffect(() => {
        const cityColRef = collection(db, "cities");

        const cityQuery = query(cityColRef, where("email", "==", currentUser?.email))

        const unsubscribe = onSnapshot(cityQuery, (querySnapshot) => {
            setCities(querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })));
            setLoading(false)
        });

        return unsubscribe;
    }, [])

    if (loading) {
        return <Loading type="bubbles" color="lightblue" />
    }
    return (
        <Layout>
            <div className='map' style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <ReactTooltip>{content}</ReactTooltip>
                <div style={{ width: "80%" }}>
                    <ComposableMap data-tip="">
                        <ZoomableGroup zoom={1}>
                            {" "}
                            <Geographies geography={geoUrl}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={countries.includes(geo.properties.name) ? "#99c8f1" : "black"}
                                            stroke="#ffffff"
                                            strokeWidth="0.05"
                                            outline="none"
                                            onMouseEnter={() => {
                                                const { name } = geo.properties;
                                                setContent(`${name}`)
                                            }}
                                            onMouseLeave={() => {
                                                setContent("")
                                            }}
                                            onClick={() => router.push(`/countries/${geo.properties.name}`)}
                                            style={{
                                                hover: {
                                                    fill: "#99c8f1",
                                                    outline: "none",
                                                }
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>
                            {markers.map(({ name, coordinates, markerOffset, id }) => (
                                <Marker key={name} coordinates={coordinates}>
                                    <circle r={1.5} stroke="#99c8f1" strokeWidth={.5}
                                        onMouseEnter={() => {
                                            setContent(`${name}`)
                                        }}
                                        onMouseLeave={() => {
                                            setContent("")
                                        }}
                                        onClick={() => router.push(`/cities/${id}`)}
                                        style={{
                                            hover: {
                                                fill: "#99c8f1",
                                                outline: "none",
                                            }
                                        }} />
                                </Marker>
                            ))}
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
            </div>

        </Layout>
    )
}

export default Map

