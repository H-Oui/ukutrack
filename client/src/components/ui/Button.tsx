import { motion } from "framer-motion"

interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    type?: "button" | "submit"
    variant?: "primary" | "secondary" | "danger"
    disabled?: boolean
    fullWidth?: boolean
    delay?: number
    style?: React.CSSProperties
}

export default function Button({
                                   children, onClick, type = "button", variant = "primary",
                                   disabled = false, fullWidth = false, delay = 0, style
                               }: ButtonProps) {
    const btnStyle = {
        width: fullWidth ? "100%" : "auto",
        justifyContent: "center",
        padding: "12px 20px",
        fontSize: "0.95rem",
        borderRadius: 14,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style
    } as React.CSSProperties

    return (
        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay }}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant}`}
            style={btnStyle}
        >
            {children}
        </motion.button>
    )
}