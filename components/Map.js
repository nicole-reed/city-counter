import ReactTooltip from "react-tooltip";
import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { db } from "../firebase";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import Loading from "../components/Loading";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

function Map({ cities }) {
    const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";
    const router = useRouter()
    const [content, setContent] = useState("");
    // const currentUser = user;
    // console.log('curentUser', currentUser)
    // const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const countries = cities.map(city => city.country)
    console.log('countries', countries)

    const citiesWithCords = cities.map((city) => {
        return {
            markerOffset: 1,
            name: `${city.name}`,
            coordinates: [city.longitude, city.latitude],
            id: city.id
        }
    })

    const markers = citiesWithCords.filter(marker => marker.coordinates[0] !== '')
    console.log('markers', markers)

    return (

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
                                <circle r={1.5} stroke="#99c8f1" strokeWidth={1}
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
                                {/* <text textAnchor="middle" y={markerOffset} style={{ fontFamily: "system-ui", fontSize: "5px", fill: "#5D5A6D" }}>
                                    {name}
                                </text> */}
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>
            </div>
        </div>


    )
}

export default Map
