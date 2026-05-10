import { motion } from "framer-motion"
import * as React from "react"

interface Session {
    id: string
    dureeMinutes: number
    createdAt: string
}

interface PracticeCalendarProps {
    sessions: Session[]
    weeklyGoal?: number
}

const styles = {
    wrapper: {
        width: "100%"
    } as React.CSSProperties,
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        gap: "10px"
    } as React.CSSProperties,
    title: {
        fontSize: "1rem",
        fontWeight: 700,
        color: "var(--text-primary)",
        margin: 0
    } as React.CSSProperties,
    weeklyGoalWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backgroundColor: "var(--bg-secondary)",
        padding: "8px 14px",
        borderRadius: "50px",
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "var(--text-secondary)"
    } as React.CSSProperties,
    goalDot: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "var(--accent)"
    } as React.CSSProperties,
    progressBarWrapper: {
        height: "6px",
        borderRadius: "50px",
        backgroundColor: "var(--border)",
        overflow: "hidden",
        flex: 1,
        minWidth: "60px"
    } as React.CSSProperties,
    monthsRow: {
        display: "flex",
        gap: "2px",
        marginBottom: "4px",
        paddingLeft: "24px"
    } as React.CSSProperties,
    monthLabel: {
        fontSize: "0.72rem",
        color: "var(--text-secondary)",
        fontWeight: 500
    } as React.CSSProperties,
    calendarWrapper: {
        display: "flex",
        gap: "4px",
        overflowX: "auto",
        paddingBottom: "8px"
    } as React.CSSProperties,
    dayLabels: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        marginRight: "4px",
        flexShrink: 0
    } as React.CSSProperties,
    dayLabel: {
        fontSize: "0.68rem",
        color: "var(--text-secondary)",
        height: "12px",
        lineHeight: "12px",
        fontWeight: 500
    } as React.CSSProperties,
    weekCol: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        flexShrink: 0
    } as React.CSSProperties,
    legend: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        marginTop: "12px",
        justifyContent: "flex-end"
    } as React.CSSProperties,
    legendText: {
        fontSize: "0.75rem",
        color: "var(--text-secondary)"
    } as React.CSSProperties,
    legendSquares: {
        display: "flex",
        gap: "3px",
        alignItems: "center"
    } as React.CSSProperties,
    tooltip: {
        position: "absolute",
        bottom: "calc(100% + 6px)",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "6px 10px",
        fontSize: "0.72rem",
        fontWeight: 600,
        color: "var(--text-primary)",
        whiteSpace: "nowrap",
        zIndex: 10,
        boxShadow: "var(--shadow)",
        pointerEvents: "none"
    } as React.CSSProperties
}

const getIntensity = (minutes: number) => {
    if (minutes === 0) return 0
    if (minutes < 15) return 1
    if (minutes < 30) return 2
    if (minutes < 60) return 3
    return 4
}

const intensityColors = [
    "var(--border)",           // 0 — vide
    "rgba(124,111,247,0.25)", // 1 — très léger
    "rgba(124,111,247,0.45)", // 2 — léger
    "rgba(124,111,247,0.7)",  // 3 — moyen
    "var(--accent)"            // 4 — intense
]

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
const DAYS = ["L", "M", "M", "J", "V", "S", "D"]
const WEEKS_TO_SHOW = 26 // 6 mois

export default function PracticeCalendar({ sessions, weeklyGoal = 3 }: PracticeCalendarProps) {
    const [hoveredDay, setHoveredDay] = React.useState<{
        date: string
        minutes: number
        x: number
        y: number
    } | null>(null)

    // Construit une map date -> minutes
    const sessionMap = React.useMemo(() => {
        const map: Record<string, number> = {}
        sessions.forEach(s => {
            const date = new Date(s.createdAt).toLocaleDateString("fr-CA")
            map[date] = (map[date] || 0) + s.dureeMinutes
        })
        return map
    }, [sessions])

    // Génère les semaines
    const weeks = React.useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Trouve le dernier dimanche
        const endDate = new Date(today)
        endDate.setDate(today.getDate() + (6 - today.getDay()))

        const startDate = new Date(endDate)
        startDate.setDate(endDate.getDate() - WEEKS_TO_SHOW * 7 + 1)

        const result: Array<Array<{ date: string, minutes: number, isToday: boolean, isFuture: boolean }>> = []
        let current = new Date(startDate)

        while (current <= endDate) {
            const week: Array<{ date: string, minutes: number, isToday: boolean, isFuture: boolean }> = []
            for (let d = 0; d < 7; d++) {
                const dateStr = current.toLocaleDateString("fr-CA")
                week.push({
                    date: dateStr,
                    minutes: sessionMap[dateStr] || 0,
                    isToday: current.toDateString() === today.toDateString(),
                    isFuture: current > today
                })
                current.setDate(current.getDate() + 1)
            }
            result.push(week)
        }

        return result
    }, [sessionMap])

    // Sessions cette semaine
    const thisWeekSessions = React.useMemo(() => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay() + 1)
        startOfWeek.setHours(0, 0, 0, 0)

        return sessions.filter(s => new Date(s.createdAt) >= startOfWeek).length
    }, [sessions])

    // Labels des mois


    const weeklyProgress = Math.min((thisWeekSessions / weeklyGoal) * 100, 100)
    const goalReached = thisWeekSessions >= weeklyGoal

    return (
        <div style={styles.wrapper}>
            {/* Header */}
            <div style={styles.header}>
                <p style={styles.title}>Calendrier de pratique</p>

                {/* Objectif hebdomadaire */}
                <div style={styles.weeklyGoalWrapper}>
                    <div style={{
                        ...styles.goalDot,
                        backgroundColor: goalReached ? "#10b981" : "var(--accent)"
                    }} />
                    <span>
                        {thisWeekSessions}/{weeklyGoal} cette semaine
                    </span>
                    <div style={styles.progressBarWrapper}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${weeklyProgress}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                height: "100%",
                                borderRadius: "50px",
                                backgroundColor: goalReached ? "#10b981" : "var(--accent)"
                            } as React.CSSProperties}
                        />
                    </div>
                    {goalReached && <span style={{ color: "#10b981" }}>🎉</span>}
                </div>
            </div>

            {/* Calendrier */}
            <div style={{ overflowX: "auto", paddingBottom: "8px" } as React.CSSProperties}>
                {/* Labels des mois */}
                <div style={{
                    display: "flex",
                    gap: "2px",
                    marginBottom: "6px",
                    paddingLeft: "20px"
                } as React.CSSProperties}>
                    {weeks.map((week, wi) => {
                        const firstDay = new Date(week[0].date)
                        const isFirstWeekOfMonth = firstDay.getDate() <= 7
                        return (
                            <div
                                key={wi}
                                style={{
                                    width: "12px",
                                    flexShrink: 0,
                                    fontSize: "0.68rem",
                                    color: "var(--text-secondary)",
                                    fontWeight: 500,
                                    overflow: "visible",
                                    whiteSpace: "nowrap"
                                } as React.CSSProperties}
                            >
                                {isFirstWeekOfMonth ? MONTHS[firstDay.getMonth()] : ""}
                            </div>
                        )
                    })}
                </div>

                {/* Grid */}
                <div style={{ display: "flex", gap: "2px" } as React.CSSProperties}>
                    {/* Labels jours */}
                    <div style={styles.dayLabels}>
                        {DAYS.map((d, i) => (
                            <div key={i} style={{
                                ...styles.dayLabel,
                                visibility: i % 2 === 0 ? "visible" : "hidden"
                            } as React.CSSProperties}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Semaines */}
                    {weeks.map((week, wi) => (
                        <div key={wi} style={styles.weekCol}>
                            {week.map((day, di) => {
                                const intensity = day.isFuture ? -1 : getIntensity(day.minutes)
                                const bgColor = day.isFuture
                                    ? "transparent"
                                    : intensityColors[intensity]

                                const dayStyle: React.CSSProperties = {
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "3px",
                                    backgroundColor: bgColor,
                                    border: day.isToday
                                        ? "1.5px solid var(--accent)"
                                        : "1px solid rgba(0,0,0,0.05)",
                                    cursor: day.isFuture ? "default" : "pointer",
                                    position: "relative",
                                    transition: "transform 0.1s ease"
                                }

                                return (
                                    <motion.div
                                        key={di}
                                        style={dayStyle}
                                        whileHover={!day.isFuture ? { scale: 1.4 } : {}}
                                        onMouseEnter={() => {
                                            if (!day.isFuture) {
                                                setHoveredDay({
                                                    date: day.date,
                                                    minutes: day.minutes,
                                                    x: wi,
                                                    y: di
                                                })
                                            }
                                        }}
                                        onMouseLeave={() => setHoveredDay(null)}
                                    >
                                        {/* Tooltip */}
                                        {hoveredDay?.date === day.date && (
                                            <div style={styles.tooltip}>
                                                {day.minutes > 0
                                                    ? `${day.minutes} min — ${new Date(day.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`
                                                    : `Pas de session — ${new Date(day.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`
                                                }
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Légende */}
            <div style={styles.legend}>
                <span style={styles.legendText}>Moins</span>
                <div style={styles.legendSquares}>
                    {intensityColors.map((color, i) => (
                        <div
                            key={i}
                            style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "3px",
                                backgroundColor: color,
                                border: "1px solid rgba(0,0,0,0.05)"
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
                <span style={styles.legendText}>Plus</span>
            </div>
        </div>
    )
}