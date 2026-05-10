import { motion } from "framer-motion"

interface PageWrapperProps {
    children: React.ReactNode
    title?: string
    subtitle?: string
}

const styles = {
    header: {
        marginBottom: 30
    } as React.CSSProperties,
    title: {
        marginBottom: 6
    } as React.CSSProperties,
    subtitle: {
        color: "var(--text-secondary)",
        fontSize: "0.95rem",
        margin: 0
    } as React.CSSProperties
}

export default function PageWrapper({ children, title, subtitle }: PageWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="page"
        >
            {title && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    style={styles.header}
                >
                    <h1 style={subtitle ? styles.title : {}}>{title}</h1>
                    {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
                </motion.div>
            )}
            {children}
        </motion.div>
    )
}