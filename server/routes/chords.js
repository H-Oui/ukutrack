const express = require("express")
const { PrismaClient } = require("@prisma/client")
const auth = require("../middleware/auth")

const prisma = new PrismaClient()
const router = express.Router()

// GET tous les accords
router.get("/", auth, async (req, res) => {
    const chords = await prisma.chord.findMany()
    res.json(chords)
})

// GET accords de l'utilisateur
router.get("/user", auth, async (req, res) => {
    const userChords = await prisma.userChord.findMany({
        where: { userId: req.user.userId },
        include: { chord: true }
    })
    res.json(userChords)
})

// Ajouter un accord à l'utilisateur
router.post("/user/:chordId", auth, async (req, res) => {
    const existing = await prisma.userChord.findFirst({
        where: {
            userId: req.user.userId,
            chordId: req.params.chordId
        }
    })

    if (existing) {
        return res.status(400).json({ error: "Accord déjà ajouté" })
    }

    const userChord = await prisma.userChord.create({
        data: {
            userId: req.user.userId,
            chordId: req.params.chordId
        }
    })
    res.json(userChord)
})

// UPDATE statut d'un accord
router.patch("/user/:id", auth, async (req, res) => {
    const { statut } = req.body
    const userChord = await prisma.userChord.update({
        where: { id: req.params.id },
        data: { statut }
    })
    res.json(userChord)
})

// DELETE accord de l'utilisateur
router.delete("/user/:id", auth, async (req, res) => {
    await prisma.userChord.delete({
        where: { id: req.params.id }
    })
    res.json({ message: "Accord supprimé" })
})

module.exports = router