import { useEffect, useState } from 'react';
import Link from 'next/link'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PlaceIcon from '@mui/icons-material/Place'
import { useAuth } from '../Auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from '@firebase/firestore';

const ResponsiveAppBar = () => {
    const { currentUser } = useAuth();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    // const [user, setUser] = useState({});
    // console.log('user', user)
    // useEffect(() => {
    //     async function getUser() {
    //         const userDocRef = doc(db, "users", currentUser.uid)
    //         const docSnap = await getDoc(userDocRef)

    //         if (docSnap.exists()) {
    //             setUser(docSnap.data())
    //         } else {
    //             console.log('error fetching user')
    //         }

    //     }
    //     getUser()
    // }, [])

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#99c8f1", fontFamily: "sans-serif", fontWeight: 500 }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <PlaceIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'sans-serif',
                            fontWeight: 400,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',

                        }}
                    >
                        Been There
          </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem>
                                <Link className='nav-item' href="/map">Map</Link>
                            </MenuItem>
                            <MenuItem>
                                <Link className='nav-item' href="/profile">Profile</Link>
                            </MenuItem>
                            <MenuItem>
                                <Link className='nav-item' href="/">Home</Link>
                            </MenuItem>

                        </Menu>
                    </Box>

                    <PlaceIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'sans-serif',
                            fontWeight: 400,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Been There
          </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <MenuItem>
                            <Link href="/map">Map</Link>
                        </MenuItem>
                        <MenuItem>
                            <Link href="/profile">Profile</Link>
                        </MenuItem>
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar src={currentUser.photoURL} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >

                            <MenuItem>
                                <Link href='/edit/profile'>Edit Profile</Link>
                            </MenuItem>

                            <MenuItem onClick={() => auth.signOut()}>
                                <Typography textAlign="center">Sign Out</Typography>
                            </MenuItem>

                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;


// import { Button } from '@mui/material'
// import Link from 'next/link'
// import { useRouter } from 'next/router'
// import { auth } from '../firebase'


// export default function Nav() {
//     const router = useRouter()

//     return (
//         <Nav>
//             <ul className='navItems'>
//                 <li id='logo' className='navItem'><Link href="/"><a className={router.pathname == "/" ? "active" : ""}>Home</a></Link></li>
//                 <li className='navItem'><Link href="/map"><a className={router.pathname == "/map" ? "active" : ""}>Map</a></Link></li>
//             </ul>
//             <Button onClick={() => auth.signOut()}>
//                 Sign Out
//             </Button>
//         </Nav>
//     )
// }
