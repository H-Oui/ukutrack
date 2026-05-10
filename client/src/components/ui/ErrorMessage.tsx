import { motion, AnimatePresence } from "framer-motion"

interface ErrorMessageProps {
    message: string
}

const errorStyle = {
    color: "var(--danger)",
    fontSize: "0.85rem",
    backgroundColor: "rgba(239,68,68,0.1)",
    padding: "10px 14px",
    borderRadius: 10,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 8
} as React.CSSProperties

export default function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <AnimatePresence>
            {message && (
                <motion.p
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={errorStyle}
                >
                    ⚠️ {message}
                </motion.p>
            )}
        </AnimatePresence>
    )
}