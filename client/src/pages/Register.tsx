import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Register() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const res = await fetch("http://localhost:3001/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, username })
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.error)
            return
        }

        navigate("/login")
    }

    return (
        <div>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">S'inscrire</button>
            </form>
            <p>Déjà un compte ? <a href="/login">Se connecter</a></p>
        </div>
    )
}