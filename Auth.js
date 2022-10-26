import { createContext, useEffect, useState, useContext } from "react";
import { getAuth } from "@firebase/auth";
import Loading from "./components/Loading";
import LogIn from "./components/LogIn";
const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const auth = getAuth()
        return auth.onIdTokenChanged(async (user) => {
            if (!user) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }
            const token = await user.getIdToken();
            setCurrentUser(user);
            setLoading(false);
        })
    }, [])

    if (loading) {
        return <Loading type="bubbles" color="lightblue" />
    }

    if (!currentUser) {
        return <LogIn />
    } else {
        return (
            <AuthContext.Provider value={{ currentUser }}>
                {children}
            </AuthContext.Provider>
        )
    }
}

export const useAuth = () => useContext(AuthContext)
