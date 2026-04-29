import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

interface Chord {
    id: string
    nom: string
    difficulte: string
}

interface UserChord {
    id: string
    chordId: string
    statut: string
    chord: Chord
}

export default function Chords() {
    const { token } = useAuth()
    const [chords, setChords] = useState<Chord[]>([])
    const [userChords, setUserChords] = useState<UserChord[]>([])
    const [filter, setFilter] = useState("tous")

    const fetchChords = async () => {
        try {
            const res = await fetch("http://localhost:3001/chords", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            setChords(data)
        } catch (err) {
            console.error(err)
        }
    }

    const fetchUserChords = async () => {
        try {
            const res = await fetch("http://localhost:3001/chords/user", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            setUserChords(data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchChords().catch(console.error)
        fetchUserChords().catch(console.error)
    }, [])

    const addChord = async (chordId: string) => {
        try {
            await fetch(`http://localhost:3001/chords/user/${chordId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            })

            await fetchUserChords()

        } catch (err) {
            console.error(err)
        }
    }

    const updateStatut = async (id: string, statut: string) => {
        try {
            await fetch(`http://localhost:3001/chords/user/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ statut })
            })

            await fetchUserChords()

        } catch (err) {
            console.error(err)
        }
    }

    const removeChord = async (id: string) => {
        try {
            await fetch(`http://localhost:3001/chords/user/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })

            await fetchUserChords()

        } catch (err) {
            console.error(err)
        }
    }

    const isAdded = (chordId: string) =>
        userChords.some((uc) => uc.chordId === chordId)

    const getUserChord = (chordId: string) =>
        userChords.find((uc) => uc.chordId === chordId)

    const filteredChords = chords.filter((c) =>
        filter === "tous" ? true : c.difficulte === filter
    )

    return (
        <div style={{ padding: 20 }}>
            <h1>🎸 Mes Accords</h1>

            <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <p>Total appris : {userChords.length}</p>
                <p>Maîtrisés : {userChords.filter(uc => uc.statut === "maîtrisé").length}</p>
                <p>En apprentissage : {userChords.filter(uc => uc.statut === "en apprentissage").length}</p>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {["tous", "facile", "moyen", "difficile"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{ fontWeight: filter === f ? "bold" : "normal" }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {filteredChords.map((chord) => {
                    const userChord = getUserChord(chord.id)

                    return (
                        <div
                            key={chord.id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: 10,
                                padding: 15,
                                width: 150,
                                textAlign: "center",
                                backgroundColor: isAdded(chord.id) ? "#e8f5e9" : "#fff"
                            }}
                        >
                            <p style={{ fontWeight: "bold", fontSize: 18 }}>{chord.nom}</p>
                            <p style={{ fontSize: 12, color: "#888" }}>{chord.difficulte}</p>

                            {userChord ? (
                                <>
                                    <select
                                        value={userChord.statut}
                                        onChange={(e) => updateStatut(userChord.id, e.target.value)}
                                        style={{ marginBottom: 5, width: "100%" }}
                                    >
                                        <option value="en apprentissage">En apprentissage</option>
                                        <option value="maîtrisé">Maîtrisé</option>
                                    </select>

                                    <button onClick={() => removeChord(userChord.id)}>
                                        🗑️ Retirer
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => addChord(chord.id)}>
                                    ➕ Ajouter
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}