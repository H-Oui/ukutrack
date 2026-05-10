import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import ErrorMessage from "../components/ui/ErrorMessage"
import * as React from "react";

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        position: "relative",
        overflow: "hidden"
    } as React.CSSProperties,
    circle1: {
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,111,247,0.15) 0%, transparent 70%)",
        top: -100,
        right: -100,
        pointerEvents: "none"
    } as React.CSSProperties,
    circle2: {
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,111,247,0.1) 0%, transparent 70%)",
        bottom: -50,
        left: -50,
        pointerEvents: "none"
    } as React.CSSProperties,
    card: {
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: "40px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "var(--shadow)",
        position: "relative",
        zIndex: 1
    } as React.CSSProperties,
    logoWrapper: {
        textAlign: "center",
        marginBottom: "30px"
    } as React.CSSProperties,
    logoEmoji: {
        fontSize: "3rem",
        marginBottom: "8px"
    } as React.CSSProperties,
    logoTitle: {
        fontSize: "1.8rem",
        fontWeight: 800,
        color: "var(--accent)",
        margin: 0
    } as React.CSSProperties,
    logoSubtitle: {
        color: "var(--text-secondary)",
        fontSize: "0.9rem",
        marginTop: "6px"
    } as React.CSSProperties,
    formTitle: {
        fontSize: "1.3rem",
        fontWeight: 700,
        marginBottom: "24px",
        color: "var(--text-primary)"
    } as React.CSSProperties,
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    } as React.CSSProperties,
    footer: {
        textAlign: "center",
        marginTop: "24px",
        fontSize: "0.9rem",
        color: "var(--text-secondary)"
    } as React.CSSProperties,
    link: {
        color: "var(--accent)",
        fontWeight: 600,
        textDecoration: "none"
    } as React.CSSProperties
}

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        const res = await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()
        setLoading(false)

        if (!res.ok) {
            setError(data.error)
            return
        }

        login(data.token, data.user)
        navigate("/dashboard")
    }

    return (
        <div style={styles.page}>
            {/* Cercles décoratifs */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                style={styles.circle1}
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={styles.circle2}
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={styles.card}
            >
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    style={styles.logoWrapper}
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                        style={styles.logoEmoji}
                    >
                        🎸
                    </motion.div>
                    <h1 style={styles.logoTitle}>UkuTrack</h1>
                    <p style={styles.logoSubtitle}>Suis ta progression au ukulélé 🌺</p>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    style={styles.formTitle}
                >
                    Connexion
                </motion.h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="ton@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        delay={0.3}
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        delay={0.4}
                    />

                    <ErrorMessage message={error} />

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        disabled={loading}
                        delay={0.5}
                        style={{ padding: "14px", fontSize: "1rem" }}
                    >
                        {loading ? "Connexion..." : "Se connecter →"}
                    </Button>
                </form>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={styles.footer}
                >
                    Pas encore de compte ?{" "}
                    <Link to="/register" style={styles.link}>
                        S'inscrire
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    )
}