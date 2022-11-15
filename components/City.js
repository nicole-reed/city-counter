import { Card, Typography } from "@mui/material"
import { useRouter } from "next/router"

const City = ({ name, id }) => {
    const router = useRouter()
    return (

        <Card className="card" onClick={() => router.push(`/cities/${id}`)} minwidth={"40%"}>
            <Typography>{name}</Typography>
        </Card>

    )
}

export default City
