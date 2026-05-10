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
    const [open, setOpen] = useState(false)

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
        <>
            <nav style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backgroundColor: "var(--navbar-bg)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid var(--border)",
                boxShadow: scrolled ? "var(--shadow)" : "none"
            }}>
                <div style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: "0 16px",
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    {/* LOGO */}
                    <div onClick={() => navigate("/dashboard")} style={{
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: "1.2rem",
                        color: "var(--accent)"
                    }}>
                        🎸 UkuTrack
                    </div>

                    {/* DESKTOP LINKS */}
                    <div className="desktop-nav" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {links.map(({ path, label, icon }) => (
                            <button key={path} onClick={() => navigate(path)} style={{
                                padding: "8px 12px",
                                borderRadius: 10,
                                border: "none",
                                cursor: "pointer",
                                fontWeight: isActive(path) ? 700 : 500,
                                backgroundColor: isActive(path) ? "var(--accent-light)" : "transparent",
                                color: isActive(path) ? "var(--accent)" : "var(--text-secondary)",
                            }}>
                                {icon} {label}
                            </button>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={toggleTheme} style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            border: "1px solid var(--border)"
                        }}>
                            {theme === "light" ? "🌙" : "☀️"}
                        </button>

                        <button onClick={handleLogout} className="btn btn-danger desktop-only">
                            Déconnexion
                        </button>

                        <button
                            onClick={() => setOpen(!open)}
                            className="mobile-only"
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                border: "1px solid var(--border)",
                                background: "var(--bg-secondary)"
                            }}
                        >
                            ☰
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {open && (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                        gap: 8,
                        borderTop: "1px solid var(--border)"
                    }}>
                        {links.map(({ path, label, icon }) => (
                            <button key={path} onClick={() => { navigate(path); setOpen(false) }} style={{
                                padding: "10px",
                                borderRadius: 10,
                                border: "none",
                                textAlign: "left",
                                cursor: "pointer",
                                backgroundColor: isActive(path) ? "var(--accent-light)" : "transparent",
                                color: isActive(path) ? "var(--accent)" : "var(--text-primary)",
                            }}>
                                {icon} {label}
                            </button>
                        ))}

                        <button
                            onClick={() => { handleLogout(); setOpen(false) }}
                            className="btn btn-danger"
                            style={{ textAlign: "left" }}
                        >
                            Déconnexion
                        </button>
                    </div>
                )}
            </nav>

            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .desktop-only { display: none !important; }
                    .mobile-only { display: flex !important; align-items: center; justify-content: center; }
                }
                @media (min-width: 769px) {
                    .mobile-only { display: none !important; }
                }
            `}</style>
        </>
    )
}