import { PackageViewer } from "@/components/features/PackageViewer"

export default function PackageVaultPage({ params }: { params: { packageId: string } }) {
    return <PackageViewer packageId={params.packageId} />
}
