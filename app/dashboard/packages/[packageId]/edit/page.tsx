"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, UploadCloud, X, File, FileText, Image as ImageIcon, Video, Music, Archive, MoveUp, MoveDown, Pencil, ArrowLeft } from "lucide-react"
import api from "@/lib/api"
import { cn } from "@/lib/utils"
import { useToast } from "@/context/ToastContext"
import Link from "next/link"

interface QueuedFile {
    id: string;
    file: File;
    displayName: string;
}

interface ExistingFile {
    id: string;
    displayName: string;
    mimeType: string;
    fileSize: number;
    sortOrder: number;
}

export default function EditPackagePage({ params }: { params: { packageId: string } }) {
    const router = useRouter()
    const { showToast } = useToast()
    const [isPageLoading, setIsPageLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    // Form State
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [tags, setTags] = useState("")
    const [visibility, setVisibility] = useState("PUBLIC")
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | null>(null)
    
    // File State
    const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([])
    const [filesToDelete, setFilesToDelete] = useState<string[]>([])
    const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([])
    
    const fileInputRef = useRef<HTMLInputElement>(null)
    const thumbInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchPackage()
    }, [params.packageId])

    const fetchPackage = async () => {
        try {
            const response = await api.get(`/packages/${params.packageId}`)
            const pkg = response.data
            setTitle(pkg.title)
            setPrice(pkg.price.toString())
            setDescription(pkg.description || "")
            setCategory(pkg.category || "")
            setTags(pkg.tags?.join(', ') || "")
            setVisibility(pkg.visibility || "PUBLIC")
            if (pkg.thumbnail) setExistingThumbnailUrl(pkg.thumbnail)
            if (pkg.files) setExistingFiles(pkg.files)
        } catch (error) {
            console.error("Failed to fetch package", error)
            showToast("Failed to fetch package details", "error")
            router.push("/dashboard/packages")
        } finally {
            setIsPageLoading(false)
        }
    }

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files))
        }
    }, [])

    const handleFiles = (files: File[]) => {
        const newFiles = files.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            displayName: file.name
        }))
        setQueuedFiles(prev => [...prev, ...newFiles])
    }

    const removeQueuedFile = (id: string) => {
        setQueuedFiles(prev => prev.filter(f => f.id !== id))
    }

    const renameQueuedFile = (id: string, newName: string) => {
        setQueuedFiles(prev => prev.map(f => f.id === id ? { ...f, displayName: newName } : f))
    }

    const moveQueuedFile = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index > 0) {
            const newFiles = [...queuedFiles]
            const temp = newFiles[index - 1]
            newFiles[index - 1] = newFiles[index]
            newFiles[index] = temp
            setQueuedFiles(newFiles)
        } else if (direction === 'down' && index < queuedFiles.length - 1) {
            const newFiles = [...queuedFiles]
            const temp = newFiles[index + 1]
            newFiles[index + 1] = newFiles[index]
            newFiles[index] = temp
            setQueuedFiles(newFiles)
        }
    }

    const markExistingFileForDeletion = (id: string) => {
        setFilesToDelete(prev => [...prev, id])
        setExistingFiles(prev => prev.filter(f => f.id !== id))
    }

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-500" />
        if (type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />
        if (type.startsWith('audio/')) return <Music className="h-5 w-5 text-pink-500" />
        if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
        if (type.includes('zip') || type.includes('compressed')) return <Archive className="h-5 w-5 text-yellow-500" />
        return <File className="h-5 w-5 text-gray-500" />
    }

    const handleSave = async () => {
        if (!title || !price) {
            showToast("Please provide title and price.", "error")
            return
        }

        if (existingFiles.length === 0 && queuedFiles.length === 0) {
            showToast("A package must contain at least one file.", "error")
            return
        }

        setIsSaving(true)

        try {
            const formData = new FormData()
            formData.append('title', title)
            formData.append('price', price)
            formData.append('description', description)
            if (category) formData.append('category', category)
            if (visibility) formData.append('visibility', visibility)
            
            const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t)
            if (tagsArray.length > 0) formData.append('tags', JSON.stringify(tagsArray))
            
            if (thumbnail) formData.append('thumbnail', thumbnail)

            if (filesToDelete.length > 0) {
                formData.append('filesToDelete', JSON.stringify(filesToDelete))
            }

            // Append new files and their metadata
            if (queuedFiles.length > 0) {
                const fileMetadata = queuedFiles.map((q, index) => ({
                    originalFilename: q.file.name,
                    displayName: q.displayName,
                    sortOrder: existingFiles.length + index
                }))
                formData.append('fileMetadata', JSON.stringify(fileMetadata))

                queuedFiles.forEach(q => {
                    formData.append('files', q.file)
                })
            }

            await api.patch(`/packages/${params.packageId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            
            showToast("Package updated successfully!", "success")
            router.push("/dashboard/packages")
        } catch (error: any) {
            showToast(error.response?.data?.message || "Failed to update package.", "error")
        } finally {
            setIsSaving(false)
        }
    }

    if (isPageLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em]">Loading package data...</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/packages">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary uppercase tracking-tighter">Edit Package</h2>
                    <p className="text-sm text-text-secondary">Update package details and manage files.</p>
                </div>
            </div>

            <Card className="border-accent/30 bg-surface">
                <CardHeader>
                    <CardTitle>Package Configuration</CardTitle>
                    <CardDescription>
                        Modify pricing, metadata, and visibility.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Package Title *</label>
                            <Input placeholder="e.g. Master CSAT Bundle" value={title} onChange={e => setTitle(e.target.value)} className="bg-background focus:ring-accent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Package Price (INR) *</label>
                            <Input type="number" placeholder="999" value={price} onChange={e => setPrice(e.target.value)} className="bg-background focus:ring-accent" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Category</label>
                            <Input placeholder="e.g. Exams" value={category} onChange={e => setCategory(e.target.value)} className="bg-background focus:ring-accent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Tags (comma separated)</label>
                            <Input placeholder="math, reasoning" value={tags} onChange={e => setTags(e.target.value)} className="bg-background focus:ring-accent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Visibility</label>
                            <select 
                                className="w-full bg-background border border-border h-10 px-3 rounded-md text-sm text-text-primary focus:ring-accent"
                                value={visibility}
                                onChange={e => setVisibility(e.target.value)}
                            >
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                                <option value="DRAFT">Draft</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Description</label>
                        <Textarea
                            placeholder="Provide details about the package content..."
                            className="min-h-[100px] bg-background focus:ring-accent resize-none"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Cover Image (Optional)</label>
                        <div className="flex items-center gap-4">
                            {existingThumbnailUrl && !thumbnail && (
                                <div className="h-16 w-16 bg-surface rounded-md border border-border overflow-hidden shrink-0">
                                    <img src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}`.replace(/\/api\/?$/, '') + existingThumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1">
                                <Input 
                                    type="file" 
                                    accept="image/*" 
                                    ref={thumbInputRef} 
                                    onChange={e => e.target.files && setThumbnail(e.target.files[0])} 
                                    className="bg-background"
                                />
                                {thumbnail && <p className="text-xs text-accent mt-1 font-medium">Selected: {thumbnail.name} (Will replace existing)</p>}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border bg-surface">
                <CardHeader>
                    <CardTitle>Manage Files</CardTitle>
                    <CardDescription>Review existing files, delete them, or upload new content.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Existing Files List */}
                    {existingFiles.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Existing Files ({existingFiles.length})</h4>
                            <div className="space-y-2">
                                {existingFiles.map((file) => (
                                    <div key={file.id} className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg group">
                                        <div className="h-10 w-10 shrink-0 bg-surface rounded-md flex items-center justify-center border border-border">
                                            {getFileIcon(file.mimeType)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-text-primary line-clamp-1">{file.displayName}</p>
                                            <p className="text-[10px] text-text-muted font-mono">{(file.fileSize / (1024 * 1024)).toFixed(2)} MB • {file.mimeType}</p>
                                        </div>
                                        
                                        <button 
                                            type="button"
                                            onClick={() => markExistingFileForDeletion(file.id)}
                                            className="h-8 w-8 shrink-0 flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                            title="Mark for deletion"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Drag and Drop Zone */}
                    <div 
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                            existingFiles.length > 0 ? "mt-6" : "",
                            isDragging ? "border-accent bg-accent/5" : "border-border hover:border-text-muted bg-background/50"
                        )}
                    >
                        <UploadCloud className={cn("h-8 w-8 mb-4", isDragging ? "text-accent" : "text-text-muted")} />
                        <h3 className="text-base font-semibold text-text-primary mb-1">Add New Files</h3>
                        <p className="text-xs text-text-secondary">Drag and drop files here, or click to browse</p>
                        <input 
                            type="file" 
                            multiple 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={e => {
                                if (e.target.files) handleFiles(Array.from(e.target.files))
                            }}
                        />
                    </div>

                    {/* Queued Files List */}
                    {queuedFiles.length > 0 && (
                        <div className="space-y-3 pt-4">
                            <h4 className="text-sm font-bold text-accent uppercase tracking-widest">New Files ({queuedFiles.length})</h4>
                            <div className="space-y-2">
                                {queuedFiles.map((qf, index) => (
                                    <div key={qf.id} className="flex items-center gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg group">
                                        <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button type="button" onClick={() => moveQueuedFile(index, 'up')} disabled={index === 0} className="hover:text-accent disabled:opacity-0"><MoveUp className="h-3 w-3" /></button>
                                            <button type="button" onClick={() => moveQueuedFile(index, 'down')} disabled={index === queuedFiles.length - 1} className="hover:text-accent disabled:opacity-0"><MoveDown className="h-3 w-3" /></button>
                                        </div>
                                        
                                        <div className="h-10 w-10 shrink-0 bg-background rounded-md flex items-center justify-center border border-border">
                                            {getFileIcon(qf.file.type)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    value={qf.displayName} 
                                                    onChange={(e) => renameQueuedFile(qf.id, e.target.value)}
                                                    className="h-7 text-sm font-semibold bg-transparent border-transparent hover:border-border focus:border-accent px-1"
                                                />
                                                <Pencil className="h-3 w-3 text-text-muted shrink-0" />
                                            </div>
                                            <p className="text-[10px] text-text-muted px-1 font-mono">{(qf.file.size / (1024 * 1024)).toFixed(2)} MB • {qf.file.type || 'Unknown'}</p>
                                        </div>
                                        
                                        <button 
                                            type="button"
                                            onClick={() => removeQueuedFile(qf.id)}
                                            className="h-8 w-8 shrink-0 flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Button
                className="w-full bg-accent hover:bg-accent-hover text-white font-bold h-14 text-lg shadow-lg relative overflow-hidden group disabled:opacity-50"
                onClick={handleSave}
                disabled={isSaving || (existingFiles.length === 0 && queuedFiles.length === 0)}
            >
                {isSaving ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Saving Changes...</span>
                ) : (
                    <span className="flex items-center gap-2"><Save className="h-5 w-5" /> Save Package</span>
                )}
            </Button>
        </div>
    )
}
