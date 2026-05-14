import { useState, useEffect, useRef } from "react"

const UKULELE_STRINGS = [
    { note: "G", frequency: 392.0, string: 4 },
    { note: "C", frequency: 261.63, string: 3 },
    { note: "E", frequency: 329.63, string: 2 },
    { note: "A", frequency: 440.0, string: 1 }
]

function getNearestNote(frequency: number) {
    return UKULELE_STRINGS.reduce((closest, string) => {
        return Math.abs(string.frequency - frequency) <  // 👈 le < manquait
        Math.abs(closest.frequency - frequency)
            ? string
            : closest
    })
}

function getCents(detected: number, target: number) {
    return Math.round(1200 * Math.log2(detected / target))
}

function detectPitch(buffer: Float32Array, sampleRate: number): number | null {
    let rms = 0
    for (let i = 0; i < buffer.length; i++) rms += buffer[i] * buffer[i]
    rms = Math.sqrt(rms / buffer.length)
    if (rms < 0.015) return null

    const SIZE = buffer.length
    const correlations = new Float32Array(SIZE)

    for (let lag = 0; lag < SIZE / 2; lag++) {
        let sum = 0
        for (let i = 0; i < SIZE / 2; i++) {
            sum += buffer[i] * buffer[i + lag]
        }
        correlations[lag] = sum
    }

    let peak = -1
    let peakVal = -1
    let goingDown = false

    for (let i = 1; i < SIZE / 2; i++) {
        if (correlations[i] < correlations[i - 1]) {
            goingDown = true
        } else if (goingDown && correlations[i] > correlations[i - 1]) {
            for (let j = i; j < SIZE / 2; j++) {
                if (correlations[j] > peakVal) {
                    peakVal = correlations[j]
                    peak = j
                } else {
                    break
                }
            }
            break
        }
    }

    if (peak === -1 || peakVal < 0.1) return null
    return sampleRate / peak
}

export default function Tuner() {
    const [active, setActive] = useState(false)
    const [frequency, setFrequency] = useState<number | null>(null)
    const [nearestNote, setNearestNote] = useState<typeof UKULELE_STRINGS[0] | null>(null)
    const [cents, setCents] = useState(0)

    const audioCtxRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const rafRef = useRef<number | null>(null)

    const start = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const ctx = new AudioContext()
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 2048

        ctx.createMediaStreamSource(stream).connect(analyser)

        audioCtxRef.current = ctx
        analyserRef.current = analyser
        streamRef.current = stream
        setActive(true)

        const buffer = new Float32Array(analyser.fftSize)

        const loop = () => {
            analyser.getFloatTimeDomainData(buffer)
            const pitch = detectPitch(buffer, ctx.sampleRate)

            if (pitch && pitch > 60 && pitch < 1500) {
                const note = getNearestNote(pitch)
                const c = getCents(pitch, note.frequency)
                setFrequency(Math.round(pitch * 10) / 10)
                setNearestNote(note)
                setCents(c)
            }

            rafRef.current = requestAnimationFrame(loop)
        }
        loop()
    }

    const stop = () => {
        rafRef.current && cancelAnimationFrame(rafRef.current)
        streamRef.current?.getTracks().forEach(t => t.stop())
        audioCtxRef.current?.close()
        setActive(false)
        setFrequency(null)
        setNearestNote(null)
        setCents(0)
    }

    useEffect(() => () => { stop() }, [])

    const tuneStatus = () => {
        if (!nearestNote) return null
        if (Math.abs(cents) <= 5) return { label: "Juste ✅", color: "#10b981" }
        if (cents < 0) return { label: "Trop bas ▲", color: "#f59e0b" }
        return { label: "Trop haut ▼", color: "#ef4444" }
    }

    const status = tuneStatus()

    return (
        <div style={{
            padding: "24px",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-card)",
            textAlign: "center",
            maxWidth: "340px",
            margin: "0 auto"
        }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem", fontWeight: 700 }}>
                🎵 Accordeur ukulélé
            </h3>

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
                {UKULELE_STRINGS.map(s => (
                    <div key={s.note} style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        border: `2px solid ${nearestNote?.note === s.note ? "var(--accent)" : "var(--border)"}`,
                        backgroundColor: nearestNote?.note === s.note ? "var(--accent-light)" : "var(--bg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: nearestNote?.note === s.note ? "var(--accent)" : "var(--text-secondary)",
                        transition: "all 0.2s"
                    }}>
                        {s.note}
                    </div>
                ))}
            </div>

            <p style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                {frequency ? `${frequency} Hz` : "—"}
            </p>

            {status && (
                <p style={{ fontSize: "1rem", fontWeight: 700, color: status.color, margin: "0 0 16px 0" }}>
                    {status.label}
                </p>
            )}

            <div style={{
                position: "relative",
                height: "12px",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "50px",
                marginBottom: "20px",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    width: "2px",
                    height: "100%",
                    backgroundColor: "var(--border)",
                    transform: "translateX(-50%)"
                }}/>
                <div style={{
                    position: "absolute",
                    top: "2px",
                    height: "8px",
                    width: "8px",
                    borderRadius: "50%",
                    backgroundColor: status?.color ?? "var(--accent)",
                    left: `${Math.min(Math.max(50 + cents, 5), 95)}%`,
                    transform: "translateX(-50%)",
                    transition: "left 0.1s ease"
                }}/>
            </div>

            <button
                onClick={active ? stop : start}
                style={{
                    padding: "10px 28px",
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: active ? "#ef4444" : "var(--accent)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer"
                }}
            >
                {active ? "⏹ Arrêter" : "🎙 Démarrer"}
            </button>
        </div>
    )
}