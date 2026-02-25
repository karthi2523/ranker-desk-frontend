import { VaultViewer } from "@/components/features/VaultViewer"

export default function VaultPage({ params }: { params: { materialId: string } }) {
    return <VaultViewer materialId={params.materialId} />
}
