import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import * as React from "react"
import Button from "../components/ui/Button"
import Badge from "../components/ui/Badge"
import PageWrapper from "../components/ui/PageWrapper"

interface Chord {
    id: string
    nom: string
    difficulte: string
    youtubeUrl?: string
}

type Statut = "en apprentissage" | "maîtrisé"

interface UserChord {
    id: string
    chordId: string
    statut: Statut
    chord: Chord
}

const difficulte: Record<string, "easy" | "medium" | "hard"> = {
    easy: "easy",
    medium: "medium",
    hard: "hard"
}

const styles = {
    statsRow: {
        display: "flex",
        gap: "12px",
        marginBottom: "24px",
        flexWrap: "wrap"
    } as React.CSSProperties,
    statItem: {
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "16px 24px",
        textAlign: "center",
        flex: 1,
        minWidth: "120px"
    } as React.CSSProperties,
    statValue: {
        fontWeight: 800,
        fontSize: "1.8rem",
        margin: 0
    } as React.CSSProperties,
    statLabel: {
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
        margin: 0,
        fontWeight: 500
    } as React.CSSProperties,
    filtersRow: {
        display: "flex",
        gap: "8px",
        marginBottom: "16px",
        flexWrap: "wrap",
        alignItems: "center"
    } as React.CSSProperties,
    filterLabel: {
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
        fontWeight: 600,
        marginRight: "4px"
    } as React.CSSProperties,
    chordsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
        gap: "14px",
        marginTop: "24px"
    } as React.CSSProperties,
    chordName: {
        fontWeight: 800,
        fontSize: "1.3rem",
        color: "var(--text-primary)",
        margin: "0 0 8px 0"
    } as React.CSSProperties,
    chordGlow: {
        position: "absolute",
        top: -30,
        right: -30,
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,111,247,0.2) 0%, transparent 70%)",
        pointerEvents: "none"
    } as React.CSSProperties,
    statutBadge: {
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "50px",
        fontSize: "0.72rem",
        fontWeight: 700,
        marginBottom: "10px",
        marginTop: "6px"
    } as React.CSSProperties,
    selectStatut: {
        width: "100%",
        padding: "8px 10px",
        borderRadius: "10px",
        border: "1.5px solid var(--border)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        fontSize: "0.82rem",
        outline: "none",
        marginBottom: "8px",
        cursor: "pointer"
    } as React.CSSProperties,
    emptyState: {
        textAlign: "center",
        padding: "50px 20px",
        color: "var(--text-secondary)"
    } as React.CSSProperties,
    sectionTitle: {
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    } as React.CSSProperties
}

export default function Chords() {
    const { token } = useAuth()
    const [chords, setChords] = useState<Chord[]>([])
    const [userChords, setUserChords] = useState<UserChord[]>([])
    const [filter, setFilter] = useState("tous")
    const [statutFilter, setStatutFilter] = useState("tous")

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
        if (token) {
            fetchChords()
            fetchUserChords()
        }
    }, [token])

    const addChord = async (chordId: string) => {
        await fetch(`http://localhost:3001/chords/user/${chordId}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        })
        fetchUserChords()
    }

    const updateStatut = async (id: string, statut: Statut) => {
        await fetch(`http://localhost:3001/chords/user/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ statut })
        })
        fetchUserChords()
    }

    const removeChord = async (id: string) => {
        await fetch(`http://localhost:3001/chords/user/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        fetchUserChords()
    }

    const isAdded = (chordId: string) =>
        userChords.some(uc => uc.chordId === chordId)

    const getUserChord = (chordId: string) =>
        userChords.find(uc => uc.chordId === chordId)

    const filteredChords = chords.filter(c => {
        const diffOk = filter === "tous" ? true : c.difficulte === filter
        const userChord = getUserChord(c.id)
        const statutOk =
            statutFilter === "tous"
                ? true
                : statutFilter === "non commencé"
                    ? !isAdded(c.id)
                    : userChord?.statut === statutFilter
        return diffOk && statutOk
    })

    const FilterBtn = ({
                           value, label, active, setActive
                       }: {
        value: string
        label: string
        active: string
        setActive: (v: string) => void
    }) => (
        <button
            onClick={() => setActive(value)}
            style={{
                padding: "6px 14px",
                borderRadius: "50px",
                border: "1.5px solid var(--border)",
                backgroundColor: active === value ? "var(--accent)" : "var(--bg-secondary)",
                color: active === value ? "white" : "var(--text-secondary)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
            } as React.CSSProperties}
        >
            {label}
        </button>
    )

    return (
        <PageWrapper
            title="🎸 Mes Accords"
            subtitle="Suis ta progression sur chaque accord"
        >
            {/* Stats */}
            <div style={styles.statsRow}>
                {[
                    { label: "Total suivis", value: userChords.length, color: "var(--accent)" },
                    { label: "Maîtrisés", value: userChords.filter(uc => uc.statut === "maîtrisé").length, color: "#10b981" },
                    { label: "En apprentissage", value: userChords.filter(uc => uc.statut === "en apprentissage").length, color: "#f59e0b" },
                    { label: "Non commencés", value: chords.length - userChords.length, color: "var(--text-secondary)" }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        style={styles.statItem}
                    >
                        <p style={{ ...styles.statValue, color: stat.color }}>{stat.value}</p>
                        <p style={styles.statLabel}>{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filtres */}
            <div style={styles.sectionTitle}>
                <h2>Bibliothèque d'accords</h2>
                <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {filteredChords.length} accord{filteredChords.length > 1 ? "s" : ""}
                </span>
            </div>

            <div style={styles.filtersRow}>
                <span style={styles.filterLabel}>Difficulté :</span>
                {[
                    { value: "tous", label: "Tous" },
                    { value: "easy", label: "🟢 easy" },
                    { value: "medium", label: "🟡 medium" },
                    { value: "hard", label: "🔴 hard" }
                ].map(f => (
                    <FilterBtn
                        key={f.value}
                        value={f.value}
                        label={f.label}
                        active={filter}
                        setActive={setFilter}
                    />
                ))}
            </div>

            <div style={{ ...styles.filtersRow, marginBottom: "8px" }}>
                <span style={styles.filterLabel}>Statut :</span>
                {[
                    { value: "tous", label: "Tous" },
                    { value: "non commencé", label: "⬜ Non commencé" },
                    { value: "en apprentissage", label: "📖 En apprentissage" },
                    { value: "maîtrisé", label: "✅ Maîtrisé" }
                ].map(f => (
                    <FilterBtn
                        key={f.value}
                        value={f.value}
                        label={f.label}
                        active={statutFilter}
                        setActive={setStatutFilter}
                    />
                ))}
            </div>

            {/* Grille d'accords */}
            {filteredChords.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.emptyState}
                >
                    <p style={{ fontSize: "2.5rem" }}>🎸</p>
                    <p>Aucun accord dans cette catégorie</p>
                </motion.div>
            ) : (
                <div style={styles.chordsGrid}>
                    <AnimatePresence>
                        {filteredChords.map((chord, i) => {
                            const userChord = getUserChord(chord.id)
                            const added = isAdded(chord.id)

                            const cardStyle: React.CSSProperties = {
                                textAlign: "center",
                                position: "relative",
                                overflow: "hidden",
                                backgroundColor: added ? "var(--accent-light)" : "var(--bg-card)",
                                borderColor: added ? "var(--accent)" : "var(--border)",
                                borderWidth: "1.5px",
                                borderStyle: "solid",
                                borderRadius: "16px",
                                padding: "20px 16px"
                            }

                            return (
                                <motion.div
                                    key={chord.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.04 }}
                                    whileHover={{ y: -4, boxShadow: "var(--shadow-hover)" }}
                                    style={cardStyle}
                                >
                                    {/* Glow quand ajouté */}
                                    {added && <div style={styles.chordGlow} />}

                                    {/* Nom de l'accord */}
                                    <p style={styles.chordName}>{chord.nom}</p>

                                    {/* Badge difficulté */}
                                    <div style={{ marginBottom: "10px" }}>
                                        <Badge
                                            label={chord.difficulte}
                                            type={difficulte[chord.difficulte] || "default"}
                                        />
                                    </div>

                                    {/* Badge statut si ajouté */}
                                    {userChord && (
                                        <span style={{
                                            ...styles.statutBadge,
                                            backgroundColor: userChord.statut === "maîtrisé"
                                                ? "rgba(16,185,129,0.1)"
                                                : "rgba(245,158,11,0.1)",
                                            color: userChord.statut === "maîtrisé"
                                                ? "#10b981"
                                                : "#f59e0b"
                                        }}>
                                            {userChord.statut === "maîtrisé"
                                                ? "✅ Maîtrisé"
                                                : "📖 En apprentissage"}
                                        </span>
                                    )}

                                    {/* Actions */}
                                    {userChord ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" } as React.CSSProperties}>
                                            <select
                                                value={userChord.statut}
                                                onChange={(e) =>
                                                    updateStatut(userChord.id, e.target.value as Statut)
                                                }
                                                style={styles.selectStatut}
                                            >
                                                <option value="en apprentissage">📖 En apprentissage</option>
                                                <option value="maîtrisé">✅ Maîtrisé</option>
                                            </select>
                                            <Button
                                                variant="danger"
                                                fullWidth
                                                onClick={() => removeChord(userChord.id)}
                                                style={{ fontSize: "0.8rem", padding: "6px 10px" }}
                                            >
                                                Retirer
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="secondary"
                                            fullWidth
                                            onClick={() => addChord(chord.id)}
                                            style={{ fontSize: "0.8rem", padding: "6px 10px" }}
                                        >
                                            ➕ Ajouter
                                        </Button>
                                    )}

                                    {/* YOUTUBE LINK */}
                                    {chord.youtubeUrl && (
                                        <a
                                            href={chord.youtubeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                marginTop: "10px",
                                                fontSize: "0.8rem",
                                                color: "var(--accent)",
                                                fontWeight: 600,
                                                textDecoration: "none",
                                                padding: "6px 10px",
                                                borderRadius: "10px",
                                                backgroundColor: "rgba(124,111,247,0.08)",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            ▶ Voir le tuto
                                        </a>
                                    )}
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}
        </PageWrapper>
    )
}