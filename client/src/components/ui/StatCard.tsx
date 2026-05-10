import { motion } from "framer-motion"
import * as React from "react";

interface StatCardProps {
    emoji: string
    label: string
    value: string | number
    delay?: number
    color?: string
}

export default function StatCard({
                                     emoji, label, value, delay = 0, color = "var(--accent)"
                                 }: StatCardProps) {
    const cardStyle = {
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "20px 24px",
        minWidth: 140,
        textAlign: "center",
        boxShadow: "var(--shadow)",
        cursor: "default",
        position: "relative",
        overflow: "hidden"
    } as React.CSSProperties

    const glowStyle = {
        position: "absolute",
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        pointerEvents: "none"
    } as React.CSSProperties

    const valueStyle = {
        fontWeight: 800,
        fontSize: "1.8rem",
        margin: "8px 0 4px",
        color: color,
        letterSpacing: "-0.5px"
    } as React.CSSProperties

    const labelStyle = {
        color: "var(--text-secondary)",
        fontSize: "0.8rem",
        margin: 0,
        fontWeight: 500
    } as React.CSSProperties

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.4, type: "spring", stiffness: 150 }}
            whileHover={{ y: -5, scale: 1.03 }}
            style={cardStyle}
        >
            <div style={glowStyle} />
            <motion.p
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}

            >
                {emoji}
            </motion.p>
            <p style={valueStyle}>{value}</p>
            <p style={labelStyle}>{label}</p>
        </motion.div>
    )
}