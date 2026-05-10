import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Navbar() {
    const { logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const isActive = (path: string) => location.pathname === path

    const links = [
        { path: "/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/songs", label: "Chansons", icon: "🎵" },
        { path: "/chords", label: "Accords", icon: "🎸" },
        { path: "/sessions", label: "Sessions", icon: "⏱️" },
        { path: "/profile", label: "Profil", icon: "👤" },
    ]

    return (
        <nav style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "var(--navbar-bg)",
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid var(--border)`,
            boxShadow: scrolled ? "var(--shadow)" : "none",
            transition: "box-shadow 0.3s ease"
        }}>
            <div style={{
                maxWidth: 1100,
                margin: "0 auto",
                padding: "0 20px",
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                {/* Logo */}
                <div
                    onClick={() => navigate("/dashboard")}
                    style={{
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: "1.2rem",
                        color: "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        letterSpacing: "-0.5px"
                    }}
                >
                    🎸 UkuTrack
                </div>

                {/* Liens desktop */}
                <div style={{
                    display: "flex",
                    gap: 4,
                    alignItems: "center"
                }}>
                    {links.map(({ path, label, icon }) => (
                        <button
                            key={path}
                            onClick={() => navigate(path)}
                            style={{
                                padding: "8px 14px",
                                borderRadius: 10,
                                border: "none",
                                cursor: "pointer",
                                fontWeight: isActive(path) ? 700 : 500,
                                fontSize: "0.9rem",
                                backgroundColor: isActive(path) ? "var(--accent-light)" : "transparent",
                                color: isActive(path) ? "var(--accent)" : "var(--text-secondary)",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                            }}
                            onMouseEnter={e => {
                                if (!isActive(path)) {
                                    (e.target as HTMLElement).style.backgroundColor = "var(--bg-secondary)"
                                    ;(e.target as HTMLElement).style.color = "var(--text-primary)"
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive(path)) {
                                    (e.target as HTMLElement).style.backgroundColor = "transparent"
                                    ;(e.target as HTMLElement).style.color = "var(--text-secondary)"
                                }
                            }}
                        >
                            <span>{icon}</span>
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* Toggle theme */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            border: "1.5px solid var(--border)",
                            backgroundColor: "var(--bg-secondary)",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease"
                        }}
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="btn btn-danger"
                        style={{ padding: "8px 16px" }}
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
        </nav>
    )
}