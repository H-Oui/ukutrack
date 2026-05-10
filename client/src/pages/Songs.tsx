import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Select from "../components/ui/Select"
import PageWrapper from "../components/ui/PageWrapper"
import * as React from "react"

const API_URL = import.meta.env.VITE_API_URL

interface YoutubVideo {
    id: { videoId: string }
    snippet: {
        title: string
        channelTitle: string
        thumbnails: { medium: { url: string } }
    }
}

interface Song {
    id: string
    titre: string
    artiste: string
    youtubeUrl: string
    youtubeThumbnail: string
    statut: string
    commentaire?: string
}

const statutColors: Record<string, { bg: string, color: string }> = {
    "à apprendre": { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
    "en cours":    { bg: "rgba(124,111,247,0.12)", color: "var(--accent)" },
    "maîtrisée":   { bg: "rgba(16,185,129,0.12)",  color: "#10b981" }
}


const styles: Record<string, React.CSSProperties> = {
    searchWrapper: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
        flexWrap: "wrap"
    },
    searchInput: {
        flex: 1,
        minWidth: "160px",
        padding: "12px 16px",
        borderRadius: "12px",
        border: "1.5px solid var(--border)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        fontSize: "0.95rem",
        outline: "none"
    },
    filterInput: {
        flex: 1,
        minWidth: "160px",
        padding: "10px 14px",
        borderRadius: "12px",
        border: "1.5px solid var(--border)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        fontSize: "0.88rem",
        outline: "none"
    },
    resultsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
    },
    thumbnail: {
        width: "100%",
        borderRadius: "10px",
        objectFit: "cover",
        aspectRatio: "16/9"
    },
    videoTitle: {
        fontWeight: 600,
        fontSize: "0.9rem",
        color: "var(--text-primary)",
        marginTop: "10px",
        marginBottom: "4px",
        overflow: "hidden",
        maxHeight: "2.8em"
    },
    videoChannel: {
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
        marginBottom: "10px"
    },
    songsList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    },
    listHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px",
        flexWrap: "wrap",
        gap: "10px"
    },
    filterRow: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap"
    },
    loadingWrapper: {
        textAlign: "center",
        padding: "20px",
        color: "var(--text-secondary)"
    },
    emptyState: {
        textAlign: "center",
        padding: "40px 20px",
        color: "var(--text-secondary)"
    },
    // Song card redesign
    songCard: {
        display: "flex",
        gap: "14px",
        alignItems: "flex-start"
    },
    songThumbnailWrap: {
        flexShrink: 0,
        width: "96px",
        borderRadius: "10px",
        overflow: "hidden",
        aspectRatio: "16/9",
        backgroundColor: "var(--bg-secondary)"
    },
    songThumbnail: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block"
    },
    songInfo: {
        flex: 1,
        minWidth: 0
    },
    songTopRow: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "8px",
        flexWrap: "wrap"
    },
    songTitle: {
        fontWeight: 700,
        fontSize: "0.95rem",
        color: "var(--text-primary)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        flex: 1,
        minWidth: 0
    },
    songArtist: {
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
        marginTop: "2px",
        marginBottom: "8px"
    },
    songActions: {
        display: "flex",
        gap: "8px",
        marginTop: "10px",
        alignItems: "center",
        flexWrap: "wrap"
    },
    youtubeLink: {
        fontSize: "0.8rem",
        color: "#ef4444",
        textDecoration: "none",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 10px",
        borderRadius: "8px",
        backgroundColor: "rgba(239,68,68,0.08)"
    },
    commentairesInput: {
        width: "100%",
        marginTop: "10px",
        padding: "8px 12px",
        borderRadius: "10px",
        border: "1.5px solid var(--border)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        fontSize: "0.82rem",
        resize: "vertical",
        minHeight: "56px",
        outline: "none",
        fontFamily: "inherit"
    }
}

export default function Songs() {
    const { token } = useAuth()
    const [search, setSearch]           = useState("")
    const [localSearch, setLocalSearch] = useState("")
    const [results, setResults]         = useState<YoutubVideo[]>([])
    const [songs, setSongs]             = useState<Song[]>([])
    const [loading, setLoading]         = useState(false)
    const [filter, setFilter]           = useState("tous")
    const [editingCommentaires, setEditingCommentaires] = useState<Record<string, string>>({})
    const [savingCommentaires, setSavingCommentaires]   = useState<Record<string, boolean>>({})

    const fetchSongs = async () => {
        try {
            const res = await fetch(`${API_URL}/songs`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Erreur lors de la récupération")
            const data: Song[] = await res.json()
            setSongs(data)
            // Init les notes locales
            const commentaires: Record<string, string> = {}
            data.forEach(s => { commentaires[s.id] = s.commentaire ?? "" })
            setEditingCommentaires(commentaires)
        } catch (err) {
            console.error("Fetch songs error:", err)
        }
    }

    useEffect(() => { if (token) fetchSongs() }, [token])

    const searchYoutube = async () => {
        if (!search) return
        setLoading(true)
        try {
            const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
            const query = encodeURIComponent(`${search} ukulele`)
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=5&key=${API_KEY}`
            const res = await fetch(url)
            const data = await res.json()
            setResults(data.items || [])
        } catch (err) {
            console.error("YouTube search error:", err)
        } finally {
            setLoading(false)
        }
    }

    const addSong = async (video: YoutubVideo) => {
        try {
            const res = await fetch(`${API_URL}/songs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    titre: video.snippet.title,
                    artiste: video.snippet.channelTitle,
                    youtubeUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                    youtubeThumbnail: video.snippet.thumbnails.medium.url
                })
            })
            if (res.ok) { fetchSongs(); setResults([]); setSearch("") }
        } catch (err) {
            console.error("Add song error:", err)
        }
    }

    const updateStatut = async (id: string, statut: string) => {
        try {
            const res = await fetch(`${API_URL}/songs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ statut })
            })
            if (res.ok) fetchSongs()
        } catch (err) { console.error(err) }
    }

    const saveCommentaires = async (id: string) => {
        setSavingCommentaires(p => ({ ...p, [id]: true }))
        try {
            await fetch(`${API_URL}/songs/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ commentaire: editingCommentaires[id] ?? "" })
            })
        } catch (err) { console.error(err) }
        finally { setSavingCommentaires(p => ({ ...p, [id]: false })) }
    }

    const deleteSong = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/songs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) fetchSongs()
        } catch (err) { console.error(err) }
    }

    const filteredSongs = songs
        .filter(s => filter === "tous" ? true : s.statut === filter)
        .filter(s => {
            const q = localSearch.toLowerCase()
            return q === "" ||
                s.titre.toLowerCase().includes(q) ||
                s.artiste.toLowerCase().includes(q)
        })

    const filters = [
        { value: "tous",        label: "Tous" },
        { value: "à apprendre", label: "À apprendre" },
        { value: "en cours",    label: "En cours" },
        { value: "maîtrisée",   label: "Maîtrisées" }
    ]

    return (
        <PageWrapper
            title="🎵 Mes chansons"
            subtitle="Recherche et gère ton répertoire ukulélé"
        >
            {/* Recherche YouTube */}
            <Card style={{ marginBottom: "24px" }} hoverable={false}>
                <div style={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder=" Rechercher sur YouTube..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && searchYoutube()}
                        style={styles.searchInput}
                    />
                    <Button onClick={searchYoutube} disabled={loading}>
                        {loading ? "..." : "Rechercher"}
                    </Button>
                </div>
            </Card>

            {loading && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.loadingWrapper}>
                    🎵 Recherche en cours...
                </motion.p>
            )}

            {/* Résultats YouTube */}
            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <h2 style={{ marginBottom: "15px" }}>Résultats ({results.length})</h2>
                        <div style={styles.resultsGrid}>
                            {results.map((video, i) => (
                                <Card key={video.id.videoId} delay={i * 0.05}>
                                    <img
                                        src={video.snippet.thumbnails.medium.url}
                                        alt={video.snippet.title}
                                        style={styles.thumbnail}
                                    />
                                    <p style={styles.videoTitle}>{video.snippet.title}</p>
                                    <p style={styles.videoChannel}>{video.snippet.channelTitle}</p>
                                    <Button fullWidth variant="secondary" onClick={() => addSong(video)}>
                                        ➕ Ajouter
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header liste */}
            <div style={styles.listHeader}>
                <h2>Ma liste ({songs.length})</h2>

                {/* Recherche locale */}
                <input
                    type="text"
                    placeholder=" Filtrer mes chansons..."
                    value={localSearch}
                    onChange={e => setLocalSearch(e.target.value)}
                    style={{ ...styles.filterInput, maxWidth: "240px" }}
                />
            </div>

            {/* Filtres statut */}
            <div style={{ ...styles.filterRow, marginBottom: "16px" }}>
                {filters.map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        style={{
                            padding: "6px 14px",
                            borderRadius: "50px",
                            border: "1.5px solid var(--border)",
                            backgroundColor: filter === f.value ? "var(--accent)" : "var(--bg-secondary)",
                            color: filter === f.value ? "white" : "var(--text-secondary)",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Liste chansons */}
            {filteredSongs.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.emptyState}>
                    <p style={{ fontSize: "2rem" }}>🎸</p>
                    <p>Aucune chanson dans cette catégorie</p>
                </motion.div>
            ) : (
                <div style={styles.songsList}>
                    <AnimatePresence>
                        {filteredSongs.map((song, i) => {
                            const sc = statutColors[song.statut] || statutColors["à apprendre"]
                            const icon = statutIcons[song.statut] || "📋"
                            return (
                                <motion.div
                                    key={song.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <Card hoverable={false} style={{
                                        borderLeft: `3px solid ${sc.color}`,
                                        borderRadius: "14px"
                                    }}>
                                        <div style={styles.songCard}>
                                            {/* Thumbnail */}
                                            {song.youtubeThumbnail && (
                                                <div style={styles.songThumbnailWrap}>
                                                    <img
                                                        src={song.youtubeThumbnail}
                                                        alt={song.titre}
                                                        style={styles.songThumbnail}
                                                    />
                                                </div>
                                            )}

                                            {/* Infos */}
                                            <div style={styles.songInfo}>
                                                <div style={styles.songTopRow}>
                                                    <p style={styles.songTitle}>{song.titre}</p>
                                                    {/* Badge statut */}
                                                    <span style={{
                                                        flexShrink: 0,
                                                        padding: "3px 10px",
                                                        borderRadius: "50px",
                                                        fontSize: "0.73rem",
                                                        fontWeight: 700,
                                                        backgroundColor: sc.bg,
                                                        color: sc.color,
                                                        whiteSpace: "nowrap"
                                                    }}>
                                                        {icon} {song.statut}
                                                    </span>
                                                </div>

                                                <p style={styles.songArtist}> {song.artiste}</p>

                                                {/* Notes */}
                                                <textarea
                                                    placeholder="💬 Ajouter un commentaire..."
                                                    value={editingCommentaires[song.id] ?? ""}
                                                    onChange={e => setEditingCommentaires(p => ({
                                                        ...p, [song.id]: e.target.value
                                                    }))}
                                                    onBlur={() => saveCommentaires(song.id)}
                                                    style={styles.commentairesInput}
                                                    rows={2}
                                                />
                                                {savingCommentaires[song.id] && (
                                                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                                                        Sauvegarde...
                                                    </p>
                                                )}

                                                {/* Actions */}
                                                <div style={styles.songActions}>
                                                    <Select
                                                        value={song.statut}
                                                        onChange={e => updateStatut(song.id, e.target.value)}
                                                        options={[
                                                            { value: "à apprendre", label: " À apprendre" },
                                                            { value: "en cours",    label: " En cours" },
                                                            { value: "maîtrisée",   label: " Maîtrisée" }
                                                        ]}
                                                    />
                                                    {song.youtubeUrl && (

                                                       <a href={String(song.youtubeUrl)}
                                                        target={"_blank"}
                                                        rel={"noreferrer"}
                                                        style={styles.youtubeLink}
                                                        >
                                                    {"▶ YouTube"}
                                                        </a>
                                                        )}
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => deleteSong(song.id)}
                                                        style={{ marginLeft: "auto", flexShrink: 0 }}
                                                    >
                                                        🗑
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}
        </PageWrapper>
    )
}