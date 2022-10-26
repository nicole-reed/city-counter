import { Container } from "@mui/material"
import Images from "../components/Images"
import Layout from "../components/Layout"

export default function Image() {
    return (
        <Layout>
            <Container>
                {/* <h2><a href={`/cities/${cityID}`}>{city.name}</a>, <a href={`/countries/${city.country}`}>{city.country}</a></h2> */}
                <Images />
            </Container>
        </Layout>
    )
}
