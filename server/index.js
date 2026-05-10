const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const songsRoutes = require("./routes/songs")

const app = express()

// CORS
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ton-frontend.vercel.app"
    ],
    credentials: true
}))

app.use(express.json())

// test route
app.get("/", (req, res) => {
    res.json({ message: "UkuTrack API is running 🚀" })
})

// routes
app.use("/auth", authRoutes)
app.use("/songs", songsRoutes)
const chordsRoutes = require("./routes/chords")
app.use("/chords", chordsRoutes)

const sessionsRoutes = require("./routes/sessions")
app.use("/sessions", sessionsRoutes)

const profileRoutes = require("./routes/profile")
app.use("/profile", profileRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})