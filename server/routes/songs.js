const express = require("express")
const { PrismaClient } = require("@prisma/client")
const auth = require("../middleware/auth")

const prisma = new PrismaClient()
const router = express.Router()

// GET songs
router.get("/", auth, async (req, res) => {
    const songs = await prisma.song.findMany({
        where: { userId: req.user.userId }
    })
    res.json(songs)
})

// CREATE song
router.post("/", auth, async (req, res) => {
    const { titre, artiste, youtubeUrl, youtubeThumbnail } = req.body

    const song = await prisma.song.create({
        data: {
            titre,
            artiste,
            youtubeUrl,
            youtubeThumbnail,
            userId: req.user.userId
        }
    })
    res.json(song)
})

// UPDATE statut + commentaire
router.patch("/:id", auth, async (req, res) => {
    const { statut, commentaire } = req.body

    const song = await prisma.song.update({
        where: { id: req.params.id },
        data: {
            ...(statut !== undefined && { statut }),
            ...(commentaire !== undefined && { commentaire })
        }
    })
    res.json(song)
})

// DELETE song
router.delete("/:id", auth, async (req, res) => {
    await prisma.song.delete({
        where: { id: req.params.id }
    })
    res.json({ message: "Song deleted" })
})

module.exports = router