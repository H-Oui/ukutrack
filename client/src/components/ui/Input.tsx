import { motion } from "framer-motion"

interface InputProps {
    label?: string
    type?: string
    placeholder?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
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

export default function Input({
                                  label, type = "text", placeholder, value, onChange, required = false, delay = 0
                              }: InputProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            style={styles.wrapper}
        >
            {label && <label style={styles.label}>{label}</label>}
            <input
                type={type}
                className="input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </motion.div>
    )
}