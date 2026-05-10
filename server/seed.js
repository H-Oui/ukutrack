const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    await prisma.chord.deleteMany()

    const chords = [
        // ========= MAJOR =========
        {
            nom: "C Major",
            symbole: "C",
            tonalite: "C",
            type: "major",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+C+chord",
            tags: "pop,beginner"
        },
        {
            nom: "D Major",
            symbole: "D",
            tonalite: "D",
            type: "major",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+D+chord",
            tags: "pop,beginner"
        },
        {
            nom: "E Major",
            symbole: "E",
            tonalite: "E",
            type: "major",
            difficulte: "hard",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+E+chord",
            tags: "barre"
        },
        {
            nom: "F Major",
            symbole: "F",
            tonalite: "F",
            type: "major",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+F+chord",
            tags: "beginner"
        },
        {
            nom: "G Major",
            symbole: "G",
            tonalite: "G",
            type: "major",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+G+chord",
            tags: "pop"
        },
        {
            nom: "A Major",
            symbole: "A",
            tonalite: "A",
            type: "major",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+A+chord",
            tags: "beginner"
        },
        {
            nom: "B Major",
            symbole: "B",
            tonalite: "B",
            type: "major",
            difficulte: "hard",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+B+chord",
            tags: "barre"
        },

        // ========= MINOR =========
        {
            nom: "A Minor",
            symbole: "Am",
            tonalite: "A",
            type: "minor",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+Am+chord",
            tags: "beginner"
        },
        {
            nom: "E Minor",
            symbole: "Em",
            tonalite: "E",
            type: "minor",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+Em+chord",
            tags: "pop"
        },
        {
            nom: "D Minor",
            symbole: "Dm",
            tonalite: "D",
            type: "minor",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+Dm+chord",
            tags: "beginner"
        },
        {
            nom: "B Minor",
            symbole: "Bm",
            tonalite: "B",
            type: "minor",
            difficulte: "medium",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+Bm+chord",
            tags: "barre"
        },
        {
            nom: "F# Minor",
            symbole: "F#m",
            tonalite: "F#",
            type: "minor",
            difficulte: "hard",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+F%23m+chord",
            tags: "barre"
        },

        // ========= 7TH =========
        {
            nom: "C7",
            symbole: "C7",
            tonalite: "C",
            type: "7th",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+C7+chord",
            tags: "blues,jazz"
        },
        {
            nom: "D7",
            symbole: "D7",
            tonalite: "D",
            type: "7th",
            difficulte: "medium",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+D7+chord",
            tags: "jazz"
        },
        {
            nom: "E7",
            symbole: "E7",
            tonalite: "E",
            type: "7th",
            difficulte: "medium",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+E7+chord",
            tags: "blues"
        },
        {
            nom: "G7",
            symbole: "G7",
            tonalite: "G",
            type: "7th",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+G7+chord",
            tags: "blues"
        },

        // ========= MAJ7 =========
        {
            nom: "Cmaj7",
            symbole: "Cmaj7",
            tonalite: "C",
            type: "maj7",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+Cmaj7+chord",
            tags: "jazz,chill"
        },
        {
            nom: "Fmaj7",
            symbole: "Fmaj7",
            tonalite: "F",
            type: "maj7",
            difficulte: "easy",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+Fmaj7+chord",
            tags: "chill"
        },

        // ========= SUS =========
        {
            nom: "Dsus4",
            symbole: "Dsus4",
            tonalite: "D",
            type: "sus4",
            difficulte: "medium",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+Dsus4+chord",
            tags: "pop"
        },

        // ========= DIM =========
        {
            nom: "Bdim",
            symbole: "Bdim",
            tonalite: "B",
            type: "dim",
            difficulte: "hard",
            youtubeUrl: "https://www.youtube.com/results?search_query=ukulele+Bdim+chord",
            tags: "jazz"
        }
    ]

    for (const chord of chords) {
        await prisma.chord.create({ data: chord })
    }

    console.log("✅ Chords seeded successfully!")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())