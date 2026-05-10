import { motion } from "framer-motion"

interface SelectProps {
    label?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: { value: string, label: string }[]
    delay?: number
}

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 6
    } as React.CSSProperties,
    label: {
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "var(--text-secondary)"
    } as React.CSSProperties
}

export default function Select({ label, value, onChange, options, delay = 0 }: SelectProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            style={styles.wrapper}
        >
            {label && <label style={styles.label}>{label}</label>}
            <select className="select" value={value} onChange={onChange}>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </motion.div>
    )
}