import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Select from "../components/ui/Select"
import PageWrapper from "../components/ui/PageWrapper"
import Card from "../components/ui/Card"
import * as React from "react"

// Récupération de l'URL API depuis les variables d'environnement Vite
const API_URL = import.meta.env.VITE_API_URL;

interface UserProfile {
    id: string
    email: string
    username: string
    niveau: string
    createdAt: string
}

const niveauColors: Record<string, { bg: string, color: string, emoji: string }> = {
    "débutant": { bg: "rgba(16,185,129,0.1)", color: "#10b981", emoji: "🌱" },
    "intermédiaire": { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", emoji: "🎯" },
    "avancé": { bg: "rgba(124,111,247,0.1)", color: "var(--accent)", emoji: "🔥" }
}

const styles = {
    avatarWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "30px",
        position: "relative"
    } as React.CSSProperties,
    avatar: {
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        backgroundColor: "var(--accent-light)",
        border: "3px solid var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2.5rem",
        marginBottom: "12px",
        boxShadow: "0 0 0 6px rgba(124,111,247,0.1)"
    } as React.CSSProperties,
    username: {
        fontWeight: 800,
        fontSize: "1.4rem",
        color: "var(--text-primary)",
        margin: "0 0 4px 0"
    } as React.CSSProperties,
    email: {
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
        margin: 0
    } as React.CSSProperties,
    niveauBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 14px",
        borderRadius: "50px",
        fontSize: "0.82rem",
        fontWeight: 700,
        marginTop: "10px"
    } as React.CSSProperties,
    infoCard: {
        marginBottom: "24px"
    } as React.CSSProperties,
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px"
    } as React.CSSProperties,
    infoItem: {
        backgroundColor: "var(--bg-secondary)",
        borderRadius: "12px",
        padding: "14px 16px"
    } as React.CSSProperties,
    infoLabel: {
        fontSize: "0.75rem",
        color: "var(--text-secondary)",
        fontWeight: 600,
        margin: "0 0 4px 0",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
    } as React.CSSProperties,
    infoValue: {
        fontSize: "0.95rem",
        fontWeight: 700,
        color: "var(--text-primary)",
        margin: 0
    } as React.CSSProperties,
    divider: {
        height: "1px",
        backgroundColor: "var(--border)",
        margin: "24px 0"
    } as React.CSSProperties,
    sectionTitle: {
        fontSize: "1rem",
        fontWeight: 700,
        color: "var(--text-primary)",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    } as React.CSSProperties,
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    } as React.CSSProperties,
    successMsg: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 14px",
        borderRadius: "10px",
        backgroundColor: "rgba(16,185,129,0.1)",
        color: "#10b981",
        fontSize: "0.85rem",
        fontWeight: 600
    } as React.CSSProperties,
    buttonsRow: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "8px"
    } as React.CSSProperties
}

export default function Profile() {
    const { token, logout } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [username, setUsername] = useState("")
    const [niveau, setNiveau] = useState("")
    const [password, setPassword] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            setProfile(data)
            setUsername(data.username)
            setNiveau(data.niveau)
            setEmail(data.email)
        } catch (err) {
            console.error("Erreur lors de la récupération du profil:", err)
        }
    }

    useEffect(() => {
        if (token) fetchProfile()
    }, [token])

    const handleUpdate = async () => {
        setLoading(true)
        setSuccess("")

        const body: Record<string, string> = { username, niveau, email }
        if (password) body.password = password

        try {
            const res = await fetch(`${API_URL}/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })

            if (res.ok) {
                setSuccess("Profil mis à jour avec succès !")
                setPassword("")
                fetchProfile()
                setTimeout(() => setSuccess(""), 3000)
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour:", err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })

    if (!profile) return null

    const niveauStyle = niveauColors[niveau] || niveauColors["débutant"]

    return (
        <PageWrapper
            title="👤 Mon Profil"
            subtitle="Gère tes informations personnelles"
        >
            {/* Avatar & infos principales */}
            <Card style={styles.infoCard} hoverable={false}>
                <div style={styles.avatarWrapper}>
                    {/* Avatar avec initiale */}
                    <div style={styles.avatar}>
                        {profile.username.charAt(0).toUpperCase()}
                    </div>

                    <h2 style={styles.username}>{profile.username}</h2>
                    <p style={styles.email}>{profile.email}</p>

                    {/* Badge niveau */}
                    <span style={{
                        ...styles.niveauBadge,
                        backgroundColor: niveauStyle.bg,
                        color: niveauStyle.color
                    }}>
                        {niveauStyle.emoji} {niveau}
                    </span>
                </div>

                {/* Infos rapides */}
                <div style={styles.infoGrid}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={styles.infoItem}
                    >
                        <p style={styles.infoLabel}>Membre depuis</p>
                        <p style={styles.infoValue}>{formatDate(profile.createdAt)}</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        style={styles.infoItem}
                    >
                        <p style={styles.infoLabel}>Niveau actuel</p>
                        <p style={{ ...styles.infoValue, color: niveauStyle.color }}>
                            {niveauStyle.emoji} {niveau}
                        </p>
                    </motion.div>
                </div>
            </Card>

            {/* Formulaire de modification */}
            <Card hoverable={false}>
                <p style={styles.sectionTitle}>✏️ Modifier mes informations</p>

                <div style={styles.form}>
                    <Input
                        label="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        delay={0.1}
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        delay={0.15}
                    />
                    <Select
                        label="Niveau"
                        value={niveau}
                        onChange={(e) => setNiveau(e.target.value)}
                        delay={0.2}
                        options={[
                            { value: "débutant", label: "🌱 Débutant" },
                            { value: "intermédiaire", label: "🎯 Intermédiaire" },
                            { value: "avancé", label: "🔥 Avancé" }
                        ]}
                    />
                    <Input
                        label="Nouveau mot de passe"
                        type="password"
                        placeholder="Laisser vide pour ne pas changer"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        delay={0.25}
                    />

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={styles.successMsg}
                        >
                            ✅ {success}
                        </motion.div>
                    )}
                </div>

                <div style={styles.divider} />

                <div style={styles.buttonsRow}>
                    <Button
                        onClick={handleUpdate}
                        variant="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? "Mise à jour..." : "💾 Sauvegarder les modifications"}
                    </Button>
                    <Button
                        onClick={() => {
                            logout()
                            window.location.href = "/login"
                        }}
                        variant="danger"
                        fullWidth
                    >
                        🚪 Se déconnecter
                    </Button>
                </div>
            </Card>
        </PageWrapper>
    )
}