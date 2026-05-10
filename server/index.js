const express = require("express")
const cors = require("cors")

const authRoutes = require("./routes/auth")
const songsRoutes = require("./routes/songs")
const chordsRoutes = require("./routes/chords")
const sessionsRoutes = require("./routes/sessions")
const profileRoutes = require("./routes/profile")

const app = express()

// CORS
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://ukutrack-5qef.vercel.app"
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
app.use("/chords", chordsRoutes)
app.use("/sessions", sessionsRoutes)
app.use("/profile", profileRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})