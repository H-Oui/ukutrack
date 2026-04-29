const express = require("express")
const { PrismaClient } = require("@prisma/client")
const auth = require("../middleware/auth")

const prisma = new PrismaClient()
const router = express.Router()

// GET toutes les sessions
router.get("/", auth, async (req, res) => {
    const sessions = await prisma.practiceSession.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: "desc" }
    })
    res.json(sessions)
})

// CREATE session
router.post("/", auth, async (req, res) => {
    const { dureeMinutes, notes } = req.body

    const session = await prisma.practiceSession.create({
        data: {
            dureeMinutes: parseInt(dureeMinutes),
            notes,
            userId: req.user.userId
        }
    })
    res.json(session)
})

// DELETE session
router.delete("/:id", auth, async (req, res) => {
    await prisma.practiceSession.delete({
        where: { id: req.params.id }
    })
    res.json({ message: "Session supprimée" })
})

module.exports = router