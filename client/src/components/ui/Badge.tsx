import { motion } from "framer-motion"

interface BadgeProps {
    label: string
    type?: "easy" | "medium" | "hard" | "default"
}

const badgeStyles = {
    easy: { bg: "rgba(16, 185, 129, 0.12)", color: "#10b981" },
    medium: { bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" },
    hard: { bg: "rgba(239, 68, 68, 0.12)", color: "#ef4444" },
    default: { bg: "var(--accent-light)", color: "var(--accent)" }
}

export default function Badge({ label, type = "default" }: BadgeProps) {
    const style = badgeStyles[type]

    const badgeStyle = {
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 50,
        fontSize: "0.75rem",
        fontWeight: 700,
        backgroundColor: style.bg,
        color: style.color,
        letterSpacing: "0.02em"
    } as React.CSSProperties

    return (
        <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={badgeStyle}
        >
            {label}
        </motion.span>
    )
}