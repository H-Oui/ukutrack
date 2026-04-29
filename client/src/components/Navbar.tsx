import { useAuth } from "../context/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const isActive = (path: string) => location.pathname === path

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 30px",
            backgroundColor: "#fff",
            borderBottom: "1px solid #eee",
            position: "sticky",
            top: 0,
            zIndex: 100
        }}>
            {/* Logo */}
            <div
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer", fontWeight: "bold", fontSize: 20 }}
            >
                🎸 UkuTrack
            </div>

            {/* Liens */}
            <div style={{ display: "flex", gap: 20 }}>
                {[
                    { path: "/dashboard", label: "📊 Dashboard" },
                    { path: "/songs", label: "🎵 Chansons" },
                    { path: "/chords", label: "🎸 Accords" },
                    { path: "/sessions", label: "⏱️ Sessions" },
                ].map(({ path, label }) => (
                    <span
                        key={path}
                        onClick={() => navigate(path)}
                        style={{
                            cursor: "pointer",
                            fontWeight: isActive(path) ? "bold" : "normal",
                            color: isActive(path) ? "#8884d8" : "#333",
                            borderBottom: isActive(path) ? "2px solid #8884d8" : "none",
                            paddingBottom: 2
                        }}
                    >
            {label}
          </span>
                ))}
            </div>

            {/* User + Logout */}
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
    <span style={{ fontSize: 14 }}>
        👋 {user?.username}
    </span>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 20,
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        backgroundColor: "#fff"
                    }}
                >
                    Déconnexion
                </button>
            </div>
        </nav>
    )
}