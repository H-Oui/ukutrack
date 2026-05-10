import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import PageWrapper from "../components/ui/PageWrapper"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Card from "../components/ui/Card"

// Récupération de l'URL API depuis les variables d'environnement Vite
const API_URL = import.meta.env.VITE_API_URL;

interface Session {
    id: string
    dureeMinutes: number
    notes: string | null
    createdAt: string
}

const styles = {
    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginBottom: "30px"
    } as React.CSSProperties,
    statItem: {
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "20px 16px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
    } as React.CSSProperties,
    statGlow: {
        position: "absolute",
        top: -20,
        right: -20,
        width: 70,
        height: 70,
        borderRadius: "50%",
        pointerEvents: "none"
    } as React.CSSProperties,
    statValue: {
        fontWeight: 800,
        fontSize: "1.7rem",
        margin: "0 0 4px 0",
        letterSpacing: "-0.5px"
    } as React.CSSProperties,
    statLabel: {
        fontSize: "0.78rem",
        color: "var(--text-secondary)",
        margin: 0,
        fontWeight: 500
    } as React.CSSProperties,
    formCard: {
        marginBottom: "30px"
    } as React.CSSProperties,
    formGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    } as React.CSSProperties,
    textareaWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    } as React.CSSProperties,
    textareaLabel: {
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "var(--text-secondary)"
    } as React.CSSProperties,
    textarea: {
        width: "100%",
        padding: "12px 16px",
        borderRadius: "12px",
        border: "1.5px solid var(--border)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        fontSize: "0.95rem",
        outline: "none",
        resize: "vertical",
        fontFamily: "inherit",
        minHeight: "80px",
        boxSizing: "border-box",
        transition: "border-color 0.2s ease"
    } as React.CSSProperties,
    historyHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "8px"
    } as React.CSSProperties,
    historyCount: {
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
        backgroundColor: "var(--bg-secondary)",
        padding: "4px 12px",
        borderRadius: "50px",
        fontWeight: 600
    } as React.CSSProperties,
    sessionsList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    } as React.CSSProperties,
    sessionCard: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "15px"
    } as React.CSSProperties,
    sessionLeft: {
        flex: 1,
        minWidth: 0
    } as React.CSSProperties,
    sessionTopRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "6px",
        flexWrap: "wrap"
    } as React.CSSProperties,
    sessionDuree: {
        fontWeight: 800,
        fontSize: "1.05rem",
        color: "var(--text-primary)",
        margin: 0
    } as React.CSSProperties,
    dureeBadge: {
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: "50px",
        backgroundColor: "var(--accent-light)",
        color: "var(--accent)",
        fontSize: "0.78rem",
        fontWeight: 700
    } as React.CSSProperties,
    sessionDate: {
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
        margin: "0 0 8px 0",
        display: "flex",
        alignItems: "center",
        gap: "5px"
    } as React.CSSProperties,
    sessionNotes: {
        fontSize: "0.87rem",
        color: "var(--text-primary)",
        margin: 0,
        padding: "10px 14px",
        backgroundColor: "var(--bg-secondary)",
        borderRadius: "10px",
        borderLeft: "3px solid var(--accent)",
        lineHeight: 1.5
    } as React.CSSProperties,
    emptyState: {
        textAlign: "center",
        padding: "60px 20px",
        color: "var(--text-secondary)"
    } as React.CSSProperties,
    emptyEmoji: {
        fontSize: "3rem",
        marginBottom: "12px"
    } as React.CSSProperties,
    emptyText: {
        fontSize: "1rem",
        fontWeight: 600,
        margin: "0 0 6px 0",
        color: "var(--text-primary)"
    } as React.CSSProperties,
    emptySub: {
        fontSize: "0.85rem",
        margin: 0
    } as React.CSSProperties
}

const stats = [
    { label: "Sessions", color: "#7c6ff7", glow: "rgba(124,111,247,0.2)" },
    { label: "Temps total", color: "#10b981", glow: "rgba(16,185,129,0.2)" },
    { label: "Moyenne", color: "#f59e0b", glow: "rgba(245,158,11,0.2)" }
]

export default function Sessions() {
    const { token } = useAuth()
    const [sessions, setSessions] = useState<Session[]>([])
    const [duree, setDuree] = useState("")
    const [notes, setNotes] = useState("")
    const [loading, setLoading] = useState(false)

    const fetchSessions = async () => {
        try {
            const res = await fetch(`${API_URL}/sessions`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Erreur lors de la récupération");
            const data = await res.json()
            setSessions(data)
        } catch (err) {
            console.error("Fetch sessions error:", err)
        }
    }

    useEffect(() => {
        if (token) fetchSessions().catch(console.error)
    }, [token])

    const addSession = async () => {
        if (!duree) return
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/sessions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    dureeMinutes: Number(duree),
                    notes
                })
            })

            if (res.ok) {
                setDuree("")
                setNotes("")
                await fetchSessions()
            }
        } catch (err) {
            console.error("Add session error:", err)
        } finally {
            setLoading(false)
        }
    }

    const deleteSession = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/sessions/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                await fetchSessions()
            }
        } catch (err) {
            console.error("Delete session error:", err)
        }
    }

    const totalMinutes = sessions.reduce((acc, s) => acc + s.dureeMinutes, 0)
    const totalHeures = Math.floor(totalMinutes / 60)
    const restMinutes = totalMinutes % 60
    const moyenneMinutes = sessions.length > 0
        ? Math.round(totalMinutes / sessions.length)
        : 0

    const formatDuree = (minutes: number) => {
        if (minutes >= 60) {
            const h = Math.floor(minutes / 60)
            const m = minutes % 60
            return m > 0 ? `${h}h${m}min` : `${h}h`
        }
        return `${minutes}min`
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    const statValues = [
        sessions.length,
        `${totalHeures}h ${restMinutes}min`,
        `${moyenneMinutes} min`
    ]

    return (
        <PageWrapper
            title="️ Sessions de pratique"
            subtitle="Enregistre et suis tes sessions d'entraînement"
        >
            {/* Stats */}
            <div style={styles.statsRow}>
                {stats.map((stat, i) => {
                    const statItemStyle: React.CSSProperties = {
                        ...styles.statItem
                    }
                    const glowStyle: React.CSSProperties = {
                        ...styles.statGlow,
                        background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`
                    }
                    const valueStyle: React.CSSProperties = {
                        ...styles.statValue,
                        color: stat.color
                    }
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -4 }}
                            style={statItemStyle}
                        >
                            <div style={glowStyle} />
                            <p style={valueStyle}>{statValues[i]}</p>
                            <p style={styles.statLabel}>{stat.label}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Formulaire */}
            <Card style={styles.formCard} hoverable={false}>
                <h2 style={{ marginBottom: "16px" }}>➕ Nouvelle session</h2>
                <div style={styles.formGrid}>
                    <Input
                        label="Durée (en minutes)"
                        type="number"
                        placeholder="ex: 30"
                        value={duree}
                        onChange={(e) => setDuree(e.target.value)}
                    />
                    <div style={styles.textareaWrapper}>
                        <label style={styles.textareaLabel}>
                            Notes (optionnel)
                        </label>
                        <textarea
                            placeholder="ex: Travaillé Do et Sol, presque maîtrisé..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            style={styles.textarea}
                        />
                    </div>
                    <Button
                        onClick={addSession}
                        disabled={loading || !duree}
                        variant="primary"
                        style={{ alignSelf: "flex-start" } as React.CSSProperties}
                        fullWidth
                    >
                        {loading ? "Enregistrement..." : " Enregistrer"}
                    </Button>
                </div>
            </Card>

            {/* Historique */}
            <div style={styles.historyHeader}>
                <h2>Historique</h2>
                <span style={styles.historyCount}>
                    {sessions.length} session{sessions.length > 1 ? "s" : ""}
                </span>
            </div>

            {sessions.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.emptyState}
                >
                    <p style={styles.emptyEmoji}>️</p>
                    <p style={styles.emptyText}>
                        Aucune session enregistrée
                    </p>
                    <p style={styles.emptySub}>
                        Commence par ajouter ta première session !
                    </p>
                </motion.div>
            ) : (
                <div style={styles.sessionsList}>
                    <AnimatePresence>
                        {sessions.map((session, i) => (
                            <Card key={session.id} delay={i * 0.05}>
                                <div style={styles.sessionCard}>
                                    <div style={styles.sessionLeft}>
                                        <div style={styles.sessionTopRow}>
                                            <p style={styles.sessionDuree}>
                                                🎵 {session.dureeMinutes} minutes
                                            </p>
                                            <span style={styles.dureeBadge}>
                                                {formatDuree(session.dureeMinutes)}
                                            </span>
                                        </div>

                                        <p style={styles.sessionDate}>
                                             {formatDate(session.createdAt)}
                                        </p>

                                        {session.notes && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                style={styles.sessionNotes}
                                            >
                                                💬 {session.notes}
                                            </motion.p>
                                        )}
                                    </div>

                                    <Button
                                        variant="danger"
                                        onClick={() => deleteSession(session.id)}
                                        style={{
                                            flexShrink: 0,
                                            padding: "8px 12px"
                                        } as React.CSSProperties}
                                    >
                                        🗑
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </PageWrapper>
    )
}