import { motion } from "framer-motion"
import * as React from "react";

interface CardProps {
    children: React.ReactNode
    delay?: number
    style?: React.CSSProperties
    onClick?: () => void
    hoverable?: boolean
}

export default function Card({
                                 children, delay = 0, style, onClick, hoverable = true
                             }: CardProps) {
    const cardStyle = {
        cursor: onClick ? "pointer" : "default",
        ...style
    } as React.CSSProperties

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={hoverable ? { y: -4 } : {}}
            onClick={onClick}
            className="card"
            style={cardStyle}
        >
            {children}
        </motion.div>
    )
}