import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

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

export default function Songs() {
    const { token } = useAuth()
    const [search, setSearch] = useState("")
    const [results, setResults] = useState<YoutubVideo[]>([])
    const [songs, setSongs] = useState<Song[]>([])
    const [loading, setLoading] = useState(false)

    // Récupère les chansons de l'utilisateur
    const fetchSongs = async () => {
        const res = await fetch("http://localhost:3001/songs", {
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setSongs(data)
    }

    useEffect(() => {
        fetchSongs()
    }, [])

    // Recherche YouTube
    const searchYoutube = async () => {
        if (!search) return
        setLoading(true)

        const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
        const query = encodeURIComponent(`${search} ukulele`)
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=5&key=${API_KEY}`

        const res = await fetch(url)
        const data = await res.json()
        setResults(data.items || [])
        setLoading(false)
    }

    // Ajoute une chanson depuis YouTube
    const addSong = async (video: YoutubVideo) => {
        const res = await fetch("http://localhost:3001/songs", {
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
    }

    // Change le statut d'une chanson
    const updateStatut = async (id: string, statut: string) => {
        await fetch(`http://localhost:3001/songs/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ statut })
        })
        fetchSongs()
    }

    // Supprime une chanson
    const deleteSong = async (id: string) => {
        await fetch(`http://localhost:3001/songs/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        fetchSongs()
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>🎵 Mes Chansons</h1>

            {/* Recherche YouTube */}
            <div>
                <input
                    type="text"
                    placeholder="Rechercher une chanson..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchYoutube()}
                />
                <button onClick={searchYoutube}>Rechercher</button>
            </div>

            {/* Résultats YouTube */}
            {loading && <p>Chargement...</p>}
            {results.map((video) => (
                <div key={video.id.videoId} style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} width={120} />
                    <div>
                        <p>{video.snippet.title}</p>
                        <p>{video.snippet.channelTitle}</p>
                        <button onClick={() => addSong(video)}>➕ Ajouter</button>
                    </div>
                </div>
            ))}

            {/* Liste des chansons */}
            <h2>Ma liste ({songs.length})</h2>
            {songs.map((song) => (
                <div key={song.id} style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
                    {song.youtubeThumbnail && (
                        <img src={song.youtubeThumbnail} alt={song.titre} width={80} />
                    )}
                    <div>
                        <p><strong>{song.titre}</strong></p>
                        <p>{song.artiste}</p>
                        <select
                            value={song.statut}
                            onChange={(e) => updateStatut(song.id, e.target.value)}
                        >
                            <option value="à apprendre">À apprendre</option>
                            <option value="en cours">En cours</option>
                            <option value="maîtrisée">Maîtrisée</option>
                        </select>
                        {song.youtubeUrl && (
                            <a href={song.youtubeUrl} target="_blank" rel="noreferrer">
                                ▶️ Voir sur YouTube
                            </a>
                        )}
                        <button onClick={() => deleteSong(song.id)}>🗑️ Supprimer</button>
                    </div>
                </div>
            ))}
        </div>
    )
}