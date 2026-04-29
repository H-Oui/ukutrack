import { createContext, useContext, useState } from "react"

interface AuthContextType {
    token: string | null
    user: any
    login: (token: string, user: any) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
    const [user, setUser] = useState<any>(null)

    const login = (token: string, user: any) => {
        localStorage.setItem("token", token)
        setToken(token)
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)!