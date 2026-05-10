const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")

const router = express.Router()

// Prisma singleton (important pour Render)
const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma
}

const JWT_SECRET = process.env.JWT_SECRET

// ======================
// REGISTER
// ======================
router.post("/register", async (req, res) => {
    try {
        const { email, password, username } = req.body

        if (!email || !password || !username) {
            return res.status(400).json({ error: "Missing fields" })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword
            }
        })

        res.json({
            message: "User created",
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ======================
// LOGIN
// ======================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "Missing fields" })
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            return res.status(400).json({ error: "User not found" })
        }

        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return res.status(400).json({ error: "Wrong password" })
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.json({
            message: "Login success",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router