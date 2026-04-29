import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from "recharts"

interface Session {
    id: string
    dureeMinutes: number
    createdAt: string
}

interface Song {
    id: string
    statut: string
    createdAt: string
}

interface UserChord {
    id: string
    statut: string
}

export default function Dashboard() {
    const { token } = useAuth()
    const [sessions, setSessions] = useState<Session[]>([])
    const [songs, setSongs] = useState<Song[]>([])
    const [userChords, setUserChords] = useState<UserChord[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` }

                const [sessionsRes, songsRes, chordsRes] = await Promise.all([
                    fetch("http://localhost:3001/sessions", { headers }),
                    fetch("http://localhost:3001/songs", { headers }),
                    fetch("http://localhost:3001/chords/user", { headers })
                ])

                const [sessionsData, songsData, chordsData] = await Promise.all([
                    sessionsRes.json(),
                    songsRes.json(),
                    chordsRes.json()
                ])

                setSessions(sessionsData)
                setSongs(songsData)
                setUserChords(chordsData)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        void fetchAll()
    }, [token])

    // Stats sessions
    const totalMinutes = sessions.reduce((acc, s) => acc + s.dureeMinutes, 0)
    const totalHeures = Math.floor(totalMinutes / 60)
    const restMinutes = totalMinutes % 60

    // Streak
    const calculateStreak = () => {
        if (sessions.length === 0) return 0
        const dates = sessions.map(s =>
            new Date(s.createdAt).toLocaleDateString("fr-FR")
        )
        const uniqueDates = [...new Set(dates)].sort((a, b) =>
            new Date(b.split("/").reverse().join("-")).getTime() -
            new Date(a.split("/").reverse().join("-")).getTime()
        )

        let streak = 0
        let current = new Date()
        current.setHours(0, 0, 0, 0)

        for (const dateStr of uniqueDates) {
            const [day, month, year] = dateStr.split("/")
            const date = new Date(`${year}-${month}-${day}`)
            const diff = Math.floor((current.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
            if (diff <= 1) {
                streak++
                current = date
            } else break
        }
        return streak
    }

    // Graphique sessions par semaine
    const getWeeklyData = () => {
        const weeks: { [key: string]: number } = {}
        sessions.forEach(s => {
            const date = new Date(s.createdAt)
            const weekStart = new Date(date)
            weekStart.setDate(date.getDate() - date.getDay())
            const key = weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
            weeks[key] = (weeks[key] || 0) + s.dureeMinutes
        })
        return Object.entries(weeks)
            .slice(-6)
            .map(([semaine, minutes]) => ({ semaine, minutes }))
    }

    // Stats chansons
    const songsStats = {
        aApprendre: songs.filter(s => s.statut === "à apprendre").length,
        enCours: songs.filter(s => s.statut === "en cours").length,
        maitrisee: songs.filter(s => s.statut === "maîtrisée").length
    }

    // Stats accords
    const chordsStats = {
        enApprentissage: userChords.filter(c => c.statut === "en apprentissage").length,
        maitrise: userChords.filter(c => c.statut === "maîtrisé").length
    }

    if (loading) return <p style={{ padding: 20 }}>Chargement...</p>

    return (
        <div style={{ padding: 20 }}>
            <h1>📊 Dashboard</h1>

            {/* Stats globales */}
            <div style={{ display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 30 }}>
                <StatCard emoji="⏱️" label="Temps total" value={`${totalHeures}h ${restMinutes}min`} />
                <StatCard emoji="🔥" label="Streak" value={`${calculateStreak()} jours`} />
                <StatCard emoji="🎵" label="Chansons maîtrisées" value={songsStats.maitrisee} />
                <StatCard emoji="🎸" label="Accords maîtrisés" value={chordsStats.maitrise} />
                <StatCard emoji="📅" label="Sessions totales" value={sessions.length} />
            </div>

            {/* Graphique sessions */}
            <div style={{ marginBottom: 30 }}>
                <h2>⏱️ Temps de pratique par semaine (minutes)</h2>
                {getWeeklyData().length === 0 ? (
                    <p>Pas encore de sessions enregistrées.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={getWeeklyData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="semaine" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="minutes" fill="#8884d8" name="Minutes" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Stats chansons */}
            <div style={{ marginBottom: 30 }}>
                <h2>🎵 Mes chansons</h2>
                <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
                    <StatCard emoji="📋" label="À apprendre" value={songsStats.aApprendre} />
                    <StatCard emoji="🎯" label="En cours" value={songsStats.enCours} />
                    <StatCard emoji="✅" label="Maîtrisées" value={songsStats.maitrisee} />
                </div>
            </div>

            {/* Stats accords */}
            <div style={{ marginBottom: 30 }}>
                <h2>🎸 Mes accords</h2>
                <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
                    <StatCard emoji="📖" label="En apprentissage" value={chordsStats.enApprentissage} />
                    <StatCard emoji="✅" label="Maîtrisés" value={chordsStats.maitrise} />
                    <StatCard emoji="🎯" label="Total suivis" value={userChords.length} />
                </div>
            </div>
        </div>
    )
}

// Composant carte stat
function StatCard({ emoji, label, value }: { emoji: string, label: string, value: string | number }) {
    return (
        <div style={{
            border: "1px solid #ccc",
            borderRadius: 12,
            padding: "15px 20px",
            minWidth: 130,
            textAlign: "center",
            backgroundColor: "#f9f9f9"
        }}>
            <p style={{ fontSize: 28, margin: 0 }}>{emoji}</p>
            <p style={{ fontWeight: "bold", fontSize: 22, margin: "5px 0" }}>{value}</p>
            <p style={{ color: "#888", fontSize: 13, margin: 0 }}>{label}</p>
        </div>
    )
}