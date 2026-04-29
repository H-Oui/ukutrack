import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError("")

        const res = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.error)
            return
        }

        login(data.token, data.user)
        navigate("/dashboard")
    }

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Se connecter</button>
            </form>
            <p>Pas de compte ? <Link to="/register">S'inscrire</Link></p>
        </div>
    )
}