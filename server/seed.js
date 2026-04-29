const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    const chords = [
        { nom: "Do (C)", difficulte: "facile" },
        { nom: "Ré (D)", difficulte: "facile" },
        { nom: "Mi (Em)", difficulte: "facile" },
        { nom: "Fa (F)", difficulte: "facile" },
        { nom: "Sol (G)", difficulte: "facile" },
        { nom: "La (Am)", difficulte: "facile" },
        { nom: "Si (Bm)", difficulte: "moyen" },
        { nom: "Do7 (C7)", difficulte: "moyen" },
        { nom: "Ré7 (D7)", difficulte: "moyen" },
        { nom: "Mi7 (E7)", difficulte: "moyen" },
        { nom: "Fa#m", difficulte: "difficile" },
        { nom: "Si bémol (Bb)", difficulte: "difficile" },
    ]

    for (const chord of chords) {
        await prisma.chord.create({
            data: chord
        })
    }

    console.log("✅ Accords créés !")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())