import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

interface Session {
    id: string
    dureeMinutes: number
    notes: string | null
    createdAt: string
}

export default function Sessions() {
    const { token } = useAuth()
    const [sessions, setSessions] = useState<Session[]>([])
    const [duree, setDuree] = useState("")
    const [notes, setNotes] = useState("")
    const [loading, setLoading] = useState(false)

    const fetchSessions = async () => {
        try {
            const res = await fetch("http://localhost:3001/sessions", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            setSessions(data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        // 👇 FIX ici
        fetchSessions().catch(console.error)
    }, [])

    const addSession = async () => {
        if (!duree) return
        setLoading(true)

        try {
            await fetch("http://localhost:3001/sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    dureeMinutes: Number(duree), // 👈 important
                    notes
                })
            })

            setDuree("")
            setNotes("")

            // 👇 FIX ici
            await fetchSessions()

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const deleteSession = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/sessions/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })

            // 👇 FIX ici
            await fetchSessions()

        } catch (err) {
            console.error(err)
        }
    }

    const totalMinutes = sessions.reduce((acc, s) => acc + s.dureeMinutes, 0)
    const totalHeures = Math.floor(totalMinutes / 60)
    const restMinutes = totalMinutes % 60

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>⏱️ Sessions de pratique</h1>

            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <p>Total sessions : {sessions.length}</p>
                <p>Temps total : {totalHeures}h {restMinutes}min</p>
            </div>

            <div style={{ marginBottom: 30, display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
                <h2>Ajouter une session</h2>

                <input
                    type="number"
                    placeholder="Durée (en minutes)"
                    value={duree}
                    onChange={(e) => setDuree(e.target.value)}
                    min={1}
                />

                <textarea
                    placeholder="Notes (optionnel)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                />

                <button onClick={addSession} disabled={loading}>
                    {loading ? "Enregistrement..." : "✅ Enregistrer la session"}
                </button>
            </div>

            <h2>Historique</h2>

            {sessions.length === 0 && <p>Aucune session enregistrée.</p>}

            {sessions.map((session) => (
                <div key={session.id} style={{
                    border: "1px solid #ccc",
                    borderRadius: 10,
                    padding: 15,
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <div>
                        <p><strong>{session.dureeMinutes} minutes</strong></p>
                        <p style={{ color: "#888", fontSize: 13 }}>
                            {formatDate(session.createdAt)}
                        </p>
                        {session.notes && <p>{session.notes}</p>}
                    </div>

                    <button onClick={() => deleteSession(session.id)}>🗑️</button>
                </div>
            ))}
        </div>
    )
}