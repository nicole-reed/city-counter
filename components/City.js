import { Card, ListItem, ListItemText, Typography } from "@mui/material"
import { useRouter } from "next/router"

const City = ({ name, id, month, year, details }) => {
    const router = useRouter()
    return (

        <Card className="card" onClick={() => router.push(`/cities/${id}`)} minwidth={"40%"}>
            <Typography>{name}</Typography>
            {/* <p>{month} of {year}</p> */}
        </Card>

    )
}

export default City
