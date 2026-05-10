import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { motion, AnimatePresence } from "framer-motion"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Select from "../components/ui/Select"
import PageWrapper from "../components/ui/PageWrapper"
import * as React from "react";

// Récupération de l'URL API depuis les variables d'environnement Vite
const API_URL = import.meta.env.VITE_API_URL;

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
}

const statutColors: Record<string, { bg: string, color: string }> = {
    "à apprendre": { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
    "en cours": { bg: "rgba(124,111,247,0.1)", color: "var(--accent)" },
    "maîtrisée": { bg: "rgba(16,185,129,0.1)", color: "#10b981" }
}

const styles = {
    searchWrapper: {
        display: "flex",
        gap: "10px",
        alignItems: "center"
    } as React.CSSProperties,
    searchInput: {
        flex: 1,
        padding: "12px 16px",
        borderRadius: "12px",
        border: "1.5px solid var(--border)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
        fontSize: "0.95rem",
        outline: "none"
    } as React.CSSProperties,
    resultsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "15px",
        marginBottom: "30px"
    } as React.CSSProperties,
    thumbnail: {
        width: "100%",
        borderRadius: "10px",
        objectFit: "cover",
        aspectRatio: "16/9"
    } as React.CSSProperties,
    videoTitle: {
        fontWeight: 600,
        fontSize: "0.9rem",
        color: "var(--text-primary)",
        marginTop: "10px",
        marginBottom: "4px",
        overflow: "hidden",
        maxHeight: "2.8em"
    } as React.CSSProperties,
    videoChannel: {
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
        marginBottom: "10px"
    } as React.CSSProperties,
    songsList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px"
    } as React.CSSProperties,
    songCard: {
        display: "flex",
        gap: "15px",
        alignItems: "center"
    } as React.CSSProperties,
    songThumbnail: {
        width: "90px",
        height: "60px",
        borderRadius: "10px",
        objectFit: "cover",
        flexShrink: 0
    } as React.CSSProperties,
    songInfo: {
        flex: 1,
        minWidth: 0
    } as React.CSSProperties,
    songTitle: {
        fontWeight: 700,
        fontSize: "0.95rem",
        color: "var(--text-primary)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    } as React.CSSProperties,
    songArtist: {
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
        marginTop: "2px"
    } as React.CSSProperties,
    songActions: {
        display: "flex",
        gap: "10px",
        marginTop: "8px",
        alignItems: "center",
        flexWrap: "wrap"
    } as React.CSSProperties,
    youtubeLink: {
        fontSize: "0.8rem",
        color: "var(--accent)",
        textDecoration: "none",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "4px"
    } as React.CSSProperties,
    listHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "15px"
    } as React.CSSProperties,
    loadingWrapper: {
        textAlign: "center",
        padding: "20px",
        color: "var(--text-secondary)"
    } as React.CSSProperties,
    emptyState: {
        textAlign: "center",
        padding: "40px 20px",
        color: "var(--text-secondary)"
    } as React.CSSProperties
}

export default function Songs() {
    const { token } = useAuth()
    const [search, setSearch] = useState("")
    const [results, setResults] = useState<YoutubVideo[]>([])
    const [songs, setSongs] = useState<Song[]>([])
    const [loading, setLoading] = useState(false)
    const [filter, setFilter] = useState("tous")

    const fetchSongs = async () => {
        try {
            const res = await fetch(`${API_URL}/songs`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!res.ok) throw new Error("Erreur lors de la récupération");
            const data = await res.json()
            setSongs(data)
        } catch (err) {
            console.error("Fetch songs error:", err)
        }
    }

    useEffect(() => {
        if (token) fetchSongs()
    }, [token])

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
            if (res.ok) {
                fetchSongs()
                setResults([])
                setSearch("")
            }
        } catch (err) {
            console.error("Add song error:", err)
        }
    }

    const updateStatut = async (id: string, statut: string) => {
        try {
            const res = await fetch(`${API_URL}/songs/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ statut })
            })
            if (res.ok) fetchSongs()
        } catch (err) {
            console.error("Update statut error:", err)
        }
    }

    const deleteSong = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/songs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) fetchSongs()
        } catch (err) {
            console.error("Delete song error:", err)
        }
    }

    const filteredSongs = songs.filter(s =>
        filter === "tous" ? true : s.statut === filter
    )

    return (
        <PageWrapper
            title="🎵 Mes chansons"
            subtitle="Recherche et gère ton répertoire ukulélé"
        >
            <Card style={{ marginBottom: "24px" }} hoverable={false}>
                <div style={styles.searchWrapper}>
                    <input
                        className="input"
                        type="text"
                        placeholder="🔍 Rechercher une chanson..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && searchYoutube()}
                        style={{ ...styles.searchInput, flex: 1 }}
                    />
                    <Button onClick={searchYoutube} disabled={loading}>
                        {loading ? "..." : "Rechercher"}
                    </Button>
                </div>
            </Card>

            {loading && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.loadingWrapper}
                >
                    🎵 Recherche en cours...
                </motion.p>
            )}

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <h2 style={{ marginBottom: "15px" }}>
                            Résultats ({results.length})
                        </h2>
                        <div style={styles.resultsGrid}>
                            {results.map((video, i) => (
                                <Card key={video.id.videoId} delay={i * 0.05}>
                                    <img
                                        src={video.snippet.thumbnails.medium.url}
                                        alt={video.snippet.title}
                                        style={styles.thumbnail}
                                    />
                                    <p style={styles.videoTitle}>
                                        {video.snippet.title}
                                    </p>
                                    <p style={styles.videoChannel}>
                                        {video.snippet.channelTitle}
                                    </p>
                                    <Button
                                        fullWidth
                                        variant="secondary"
                                        onClick={() => addSong(video)}
                                    >
                                        ➕ Ajouter
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={styles.listHeader}>
                <h2>Ma liste ({songs.length})</h2>
                <div style={{ display: "flex", gap: "8px" }}>
                    {[
                        { value: "tous", label: "Tous" },
                        { value: "à apprendre", label: "À apprendre" },
                        { value: "en cours", label: "En cours" },
                        { value: "maîtrisée", label: "Maîtrisées" }
                    ].map(f => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "50px",
                                border: "1.5px solid var(--border)",
                                backgroundColor: filter === f.value
                                    ? "var(--accent)"
                                    : "var(--bg-secondary)",
                                color: filter === f.value
                                    ? "white"
                                    : "var(--text-secondary)",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                            } as React.CSSProperties}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredSongs.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.emptyState}
                >
                    <p style={{ fontSize: "2rem" }}>🎸</p>
                    <p>Aucune chanson dans cette catégorie</p>
                </motion.div>
            ) : (
                <div style={styles.songsList}>
                    <AnimatePresence>
                        {filteredSongs.map((song, i) => {
                            const statutStyle = statutColors[song.statut] || statutColors["à apprendre"]
                            return (
                                <Card key={song.id} delay={i * 0.05}>
                                    <div style={styles.songCard}>
                                        {song.youtubeThumbnail && (
                                            <img
                                                src={song.youtubeThumbnail}
                                                alt={song.titre}
                                                style={styles.songThumbnail}
                                            />
                                        )}
                                        <div style={styles.songInfo}>
                                            <p style={styles.songTitle}>{song.titre}</p>
                                            <p style={styles.songArtist}>{song.artiste}</p>

                                            <span style={{
                                                display: "inline-block",
                                                padding: "2px 10px",
                                                borderRadius: "50px",
                                                fontSize: "0.75rem",
                                                fontWeight: 700,
                                                backgroundColor: statutStyle.bg,
                                                color: statutStyle.color,
                                                marginBottom: "8px"
                                            } as React.CSSProperties}>
                                                {song.statut}
                                            </span>

                                            <div style={styles.songActions}>
                                                <Select
                                                    value={song.statut}
                                                    onChange={(e) =>
                                                        updateStatut(song.id, e.target.value)
                                                    }
                                                    options={[
                                                        { value: "à apprendre", label: "📋 À apprendre" },
                                                        { value: "en cours", label: "🎯 En cours" },
                                                        { value: "maîtrisée", label: "✅ Maîtrisée" }
                                                    ]}
                                                />
                                                {song.youtubeUrl && (
                                                    <a href={song.youtubeUrl}
                                                       target="_blank"
                                                       rel="noreferrer"
                                                       style={styles.youtubeLink}
                                                    >
                                                        ▶ YouTube
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            variant="danger"
                                            onClick={() => deleteSong(song.id)}
                                            style={{ flexShrink: 0 }}
                                        >
                                            🗑
                                        </Button>
                                    </div>
                                </Card>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}
        </PageWrapper>
    )
}