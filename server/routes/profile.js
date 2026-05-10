const express = require("express")
const { PrismaClient } = require("@prisma/client")
const auth = require("../middleware/auth")
const bcrypt = require("bcrypt")

const prisma = new PrismaClient()
const router = express.Router()

// GET profil
router.get("/", auth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                username: true,
                niveau: true,
                createdAt: true
            }
        })
        res.json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// UPDATE profil
router.patch("/", auth, async (req, res) => {
    try {
        const { username, niveau, password } = req.body

        const data = {}
        if (username) data.username = username
        if (niveau) data.niveau = niveau
        if (password) data.password = await bcrypt.hash(password, 10)

        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data,
            select: {
                id: true,
                email: true,
                username: true,
                niveau: true
            }
        })
        res.json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router