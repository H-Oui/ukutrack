import PageWrapper from "../components/ui/PageWrapper"
import Tuner from "../components/ui/Tuner"
import Card from "../components/ui/Card"

export default function TunerPage() {
    return (
        <PageWrapper
            title="🎵 Accordeur"
            subtitle="Accorde ton ukulélé en temps réel"
        >
            <Card hoverable={false}>
                <Tuner />
            </Card>
        </PageWrapper>
    )
}