import Nav from './Nav'
import FlightTakeoffSharpIcon from '@mui/icons-material/FlightTakeoffSharp';
import DirectionsSubwaySharpIcon from '@mui/icons-material/DirectionsSubwaySharp';
import DirectionsCarSharpIcon from '@mui/icons-material/DirectionsCarSharp';
import DirectionsBoatFilledSharpIcon from '@mui/icons-material/DirectionsBoatFilledSharp';

export default function Layout({ children }) {
    return (
        <div className='layout'>
            <Nav />
            <main>
                {children}
            </main>
            <footer> <p><FlightTakeoffSharpIcon sx={{ color: "#99c8f1" }} /> <DirectionsBoatFilledSharpIcon sx={{ color: "#99c8f1" }} /> <DirectionsCarSharpIcon sx={{ color: "#99c8f1" }} /> <DirectionsSubwaySharpIcon sx={{ color: "#99c8f1" }} /></p></footer>
        </div>
    )
}