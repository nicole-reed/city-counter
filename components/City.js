import { ListItem, ListItemText } from "@mui/material"

const City = ({name, country, month, year, id}) => {
    return (
       <ListItem
        sx={{mt:3, boxShadow: 3}}
        style={{backgroundColor:'#FAFAFA'}}
       >

        <ListItemText
            primary={name}
            secondary={country}
        />

       </ListItem>
    )
}

export default City
