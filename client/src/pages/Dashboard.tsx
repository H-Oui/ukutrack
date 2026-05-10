import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import * as React from "react"
import PageWrapper from "../components/ui/PageWrapper"
import StatCard from "../components/ui/StatCard"
import Card from "../components/ui/Card"
import PracticeCalendar from "../components/ui/PracticeCalendar"
import { AnimatePresence } from "framer-motion"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from "recharts"
import { animate } from "framer-motion"
import { useMotionValue, useTransform } from "framer-motion"


const API_URL = import.meta.env.VITE_API_URL
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

const styles = {
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "14px",
        marginBottom: "30px"
    } as React.CSSProperties,
    sectionTitle: {
        fontSize: "1.1rem",
        fontWeight: 700,
        color: "var(--text-primary)",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    } as React.CSSProperties,
    twoCol: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "16px",
        marginBottom: "24px"
    } as React.CSSProperties,
    miniStatRow: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    } as React.CSSProperties,
    miniStat: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        borderRadius: "12px",
        backgroundColor: "var(--bg-secondary)"
    } as React.CSSProperties,
    miniStatLabel: {
        fontSize: "0.88rem",
        color: "var(--text-secondary)",
        fontWeight: 500
    } as React.CSSProperties,
    miniStatValue: {
        fontWeight: 800,
        fontSize: "1rem",
        color: "var(--text-primary)"
    } as React.CSSProperties,
    chartWrapper: {
        marginBottom: "24px"
    } as React.CSSProperties,
    emptyChart: {
        textAlign: "center",
        padding: "30px",
        color: "var(--text-secondary)",
        fontSize: "0.9rem"
    } as React.CSSProperties,
    progressBar: {
        height: "8px",
        borderRadius: "50px",
        backgroundColor: "var(--border)",
        overflow: "hidden",
        marginTop: "6px"
    } as React.CSSProperties,
    progressFill: {
        height: "100%",
        borderRadius: "50px",
        backgroundColor: "var(--accent)",
        transition: "width 0.6s ease"
    } as React.CSSProperties,
    progressItem: {
        marginBottom: "14px"
    } as React.CSSProperties,
    progressHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "4px"
    } as React.CSSProperties,
    progressLabel: {
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
        fontWeight: 500
    } as React.CSSProperties,
    progressValue: {
        fontSize: "0.85rem",
        fontWeight: 700,
        color: "var(--text-primary)"
    } as React.CSSProperties,
    streakBanner: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 20px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, var(--accent) 0%, #9d94ff 100%)",
        marginBottom: "24px",
        color: "white"
    } as React.CSSProperties,
    streakEmoji: {
        fontSize: "2rem"
    } as React.CSSProperties,
    streakText: {
        flex: 1
    } as React.CSSProperties,
    streakTitle: {
        fontWeight: 800,
        fontSize: "1.1rem",
        margin: 0
    } as React.CSSProperties,
    streakSub: {
        fontSize: "0.82rem",
        opacity: 0.85,
        margin: 0,
        marginTop: "2px"
    } as React.CSSProperties,
    streakValue: {
        fontWeight: 900,
        fontSize: "2rem"
    } as React.CSSProperties
}

function AnimatedCounter({ value, delay = 0 }: { value: number, delay?: number }) {
    const count = useMotionValue(0)
    const rounded = useTransform(count, latest => Math.round(latest))

    const [display, setDisplay] = useState(0)

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.2,
            ease: "easeOut",
            delay // 👈 clé ici
        })

        const unsubscribe = rounded.on("change", (v) => {
            setDisplay(v)
        })

        return () => {
            controls.stop()
            unsubscribe()
        }
    }, [value, delay])

    return <span>{display}</span>
}

export default function Dashboard() {
    const { token } = useAuth()
    const [sessions, setSessions] = useState<Session[]>([])
    const [songs, setSongs] = useState<Song[]>([])
    const [userChords, setUserChords] = useState<UserChord[]>([])
    const [loading, setLoading] = useState(true)
    const [activeView, setActiveView] = useState<"Semaine" | "Calendrier">("Semaine")

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` }

                const [sessionsRes, songsRes, chordsRes] = await Promise.all([
                    fetch(`${API_URL}/sessions`, { headers }),
                    fetch(`${API_URL}/songs`, { headers }),
                    fetch(`${API_URL}/chords/user`, { headers })
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
    const moyenneMinutes = sessions.length > 0
        ? Math.round(totalMinutes / sessions.length)
        : 0

    // Nombre de jours uniques pratiqués
    const totalDaysPracticed = new Set(
        sessions.map(s =>
            new Date(s.createdAt).toLocaleDateString("fr-FR")
        )
    ).size


    // Graphique par jour de la semaine
    const getWeekDaysData = () => {
        const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay() + 1)
        startOfWeek.setHours(0, 0, 0, 0)

        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek)
            day.setDate(startOfWeek.getDate() + i)
            const dayEnd = new Date(day)
            dayEnd.setHours(23, 59, 59, 999)

            const minutes = sessions
                .filter(s => {
                    const d = new Date(s.createdAt)
                    return d >= day && d <= dayEnd
                })
                .reduce((acc, s) => acc + s.dureeMinutes, 0)

            return {
                jour: days[day.getDay()],
                minutes,
                date: day.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short"
                })
            }
        })
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


    if (loading) return (
        <PageWrapper title="📊 Dashboard">
            <div style={{ textAlign: "center", padding: "50px", color: "var(--text-secondary)" } as React.CSSProperties}>
                <motion.p
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }as React.CSSProperties}
                >
                    <AnimatedCounter value={totalDaysPracticed} delay={0} />
                </motion.p>
            </div>
        </PageWrapper>
    )

    return (
        <PageWrapper
            title="📊 Dashboard"
            subtitle="Bienvenue ! Voici ta progression en un coup d'œil."
        >
            {/* Practice Summary */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "24px"
                }as React.CSSProperties}
            >
                <div style={{
                    flex: 1,
                    padding: "16px",
                    borderRadius: "16px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            Jours pratiqués
                        </p>
                        <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>
                            <AnimatedCounter value={totalDaysPracticed} />
                        </p>
                    </div>
                    <span style={{ fontSize: "1.8rem" }}>📆</span>
                </div>

                <div style={{
                    flex: 1,
                    padding: "16px",
                    borderRadius: "16px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <div>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                            Sessions totales
                        </p>
                        <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>
                            <AnimatedCounter value={sessions.length} delay={1.3} />
                        </p>
                    </div>
                    <span style={{ fontSize: "1.8rem" }}>🎵</span>
                </div>
            </motion.div>

            {/* Stat Cards */}
            <div style={styles.statsGrid}>
                <StatCard
                    emoji="⏱️"
                    label="Temps total"
                    value={`${totalHeures}h${restMinutes}m`}
                    delay={0.05}
                    color="#7c6ff7"
                />
                <StatCard
                    emoji="📅"
                    label="Sessions"
                    value={sessions.length}
                    delay={0.1}
                    color="#10b981"
                />
                <StatCard
                    emoji="📊"
                    label="Moyenne"
                    value={`${moyenneMinutes}min`}
                    delay={0.15}
                    color="#f59e0b"
                />
                <StatCard
                    emoji="🎵"
                    label="Maîtrisées"
                    value={songsStats.maitrisee}
                    delay={0.2}
                    color="#ec4899"
                />
                <StatCard
                    emoji="🎸"
                    label="Accords OK"
                    value={chordsStats.maitrise}
                    delay={0.25}
                    color="#8b5cf6"
                />
            </div>

            {/* Vue Semaine / Mois */}
            <Card style={styles.chartWrapper} hoverable={false}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px"
                } as React.CSSProperties}>
                    <p style={styles.sectionTitle}>📅 Pratique</p>
                    <div style={{
                        display: "flex",
                        gap: "6px",
                        backgroundColor: "var(--bg-secondary)",
                        padding: "4px",
                        borderRadius: "12px"
                    } as React.CSSProperties}>
                        {["Semaine", "Calendrier"].map((view) => (
                            <button
                                key={view}
                                onClick={() => setActiveView(view as "Semaine" | "Calendrier")}
                                style={{
                                    padding: "6px 16px",
                                    borderRadius: "8px",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "0.82rem",
                                    fontWeight: 600,
                                    backgroundColor: activeView === view
                                        ? "var(--bg-card)"
                                        : "transparent",
                                    color: activeView === view
                                        ? "var(--accent)"
                                        : "var(--text-secondary)",
                                    boxShadow: activeView === view
                                        ? "var(--shadow)"
                                        : "none",
                                    transition: "all 0.2s ease"
                                } as React.CSSProperties}
                            >
                                {view === "Semaine" ? "📊 Semaine" : "📅 Calendrier"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Contenu selon la vue */}
                <AnimatePresence mode="wait">
                    {activeView === "Semaine" ? (
                        <motion.div
                            key="semaine"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {getWeekDaysData().every(d => d.minutes === 0) ? (
                                <div style={styles.emptyChart}>
                                    <p>😴 Aucune session cette semaine</p>
                                    <p style={{ marginTop: "6px" }}>
                                        Lance-toi, même 10 minutes c'est bien !
                                    </p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart
                                        data={getWeekDaysData()}
                                        barSize={36}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke="var(--border)"
                                        />
                                        <XAxis
                                            dataKey="jour"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            unit="m"
                                            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "var(--bg-card)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "12px",
                                                color: "var(--text-primary)"
                                            }}
                                            formatter={(value) => [`${value} min`, "Pratique"]}
                                            labelFormatter={(_, payload) =>
                                                payload?.[0]?.payload?.date ?? ""
                                            }
                                        />
                                        <Bar
                                            dataKey="minutes"
                                            fill="var(--accent)"
                                            radius={[8, 8, 0, 0]}
                                            label={{
                                                position: "top",
                                                fontSize: 11,
                                                fill: "var(--text-secondary)"
                                            }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="calendrier"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <PracticeCalendar sessions={sessions} weeklyGoal={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            {/* Deux colonnes : chansons + accords */}
            <div style={styles.twoCol}>
                {/* Chansons */}
                <Card hoverable={false}>
                    <p style={styles.sectionTitle}>🎵 Chansons</p>
                    <div style={styles.miniStatRow}>
                        {[
                            { label: "À apprendre", value: songsStats.aApprendre, color: "#f59e0b" },
                            { label: "En cours", value: songsStats.enCours, color: "var(--accent)" },
                            { label: "Maîtrisées", value: songsStats.maitrisee, color: "#10b981" }
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                style={styles.miniStat}
                            >
                                <span style={styles.miniStatLabel}>{item.label}</span>
                                <span style={{ ...styles.miniStatValue, color: item.color }}>
                                    {item.value}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Barre de progression */}
                    {songs.length > 0 && (
                        <div style={{ marginTop: "16px" } as React.CSSProperties}>
                            <div style={styles.progressItem}>
                                <div style={styles.progressHeader}>
                                    <span style={styles.progressLabel}>Progression globale</span>
                                    <span style={styles.progressValue}>
                                        {Math.round((songsStats.maitrisee / songs.length) * 100)}%
                                    </span>
                                </div>
                                <div style={styles.progressBar}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${(songsStats.maitrisee / songs.length) * 100}%`
                                        }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        style={styles.progressFill}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Accords */}
                <Card hoverable={false}>
                    <p style={styles.sectionTitle}>🎸 Accords</p>
                    <div style={styles.miniStatRow}>
                        {[
                            { label: "En apprentissage", value: chordsStats.enApprentissage, color: "#f59e0b" },
                            { label: "Maîtrisés", value: chordsStats.maitrise, color: "#10b981" },
                            { label: "Total suivis", value: userChords.length, color: "var(--accent)" }
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.08 }}
                                style={styles.miniStat}
                            >
                                <span style={styles.miniStatLabel}>{item.label}</span>
                                <span style={{ ...styles.miniStatValue, color: item.color }}>
                                    {item.value}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Barre de progression */}
                    {userChords.length > 0 && (
                        <div style={{ marginTop: "16px" } as React.CSSProperties}>
                            <div style={styles.progressItem}>
                                <div style={styles.progressHeader}>
                                    <span style={styles.progressLabel}>Taux de maîtrise</span>
                                    <span style={styles.progressValue}>
                                        {Math.round((chordsStats.maitrise / userChords.length) * 100)}%
                                    </span>
                                </div>
                                <div style={styles.progressBar}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${(chordsStats.maitrise / userChords.length) * 100}%`
                                        }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        style={{
                                            ...styles.progressFill,
                                            backgroundColor: "#10b981"
                                        } as React.CSSProperties}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </PageWrapper>
    )
}