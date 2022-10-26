import Nav from './Nav'

export default function Layout({ children }) {
    return (
        <div className='layout'>
            <Nav />
            <main>
                {children}
            </main>
            <footer> <p>Made by N.Reed</p></footer>
        </div>
    )
}