"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, CheckCircle2, UploadCloud, X, File, FileText, Image as ImageIcon, Video, Music, Archive, MoveUp, MoveDown, Pencil } from "lucide-react"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

interface QueuedFile {
    id: string;
    file: File;
    displayName: string;
}

export default function CreatePackagePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    // Form State
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [tags, setTags] = useState("")
    const [visibility, setVisibility] = useState("PUBLIC")
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    
    // File Queue
    const [queuedFiles, setQueuedFiles] = useState<QueuedFile[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const thumbInputRef = useRef<HTMLInputElement>(null)

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

    const removeFile = (id: string) => {
        setQueuedFiles(prev => prev.filter(f => f.id !== id))
    }

    const renameFile = (id: string, newName: string) => {
        setQueuedFiles(prev => prev.map(f => f.id === id ? { ...f, displayName: newName } : f))
    }

    const moveFile = (index: number, direction: 'up' | 'down') => {
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

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-500" />
        if (type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />
        if (type.startsWith('audio/')) return <Music className="h-5 w-5 text-pink-500" />
        if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
        if (type.includes('zip') || type.includes('compressed')) return <Archive className="h-5 w-5 text-yellow-500" />
        return <File className="h-5 w-5 text-gray-500" />
    }

    const handleCreate = async () => {
        if (!title || !price || queuedFiles.length === 0) {
            setError("Please provide title, price, and upload at least one file.")
            return
        }

        setIsLoading(true)
        setError(null)

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

            // Append files and their metadata
            const fileMetadata = queuedFiles.map((q, index) => ({
                originalFilename: q.file.name,
                displayName: q.displayName,
                sortOrder: index
            }))
            formData.append('fileMetadata', JSON.stringify(fileMetadata))

            queuedFiles.forEach(q => {
                formData.append('files', q.file)
            })

            await api.post("/packages", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            
            setIsSuccess(true)
            setTimeout(() => {
                router.push("/dashboard/packages")
            }, 2000)
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to create package.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-16 w-16 text-accent mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-text-primary">Package Created!</h2>
                <p className="text-text-secondary mt-2">The package has been successfully deployed to the store.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary uppercase tracking-tighter">Package Creator</h2>
                <p className="text-sm text-text-secondary">Build a new secure digital product package.</p>
            </div>

            <Card className="border-accent/30 bg-surface">
                <CardHeader>
                    <CardTitle>Package Configuration</CardTitle>
                    <CardDescription>
                        Set pricing, metadata, and visibility.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Package Title *</label>
                            <Input placeholder="e.g. Master CSAT Bundle" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Package Price (INR) *</label>
                            <Input type="number" placeholder="999" value={price} onChange={e => setPrice(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Category</label>
                            <Input placeholder="e.g. Exams" value={category} onChange={e => setCategory(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-primary">Tags (comma separated)</label>
                            <Input placeholder="math, reasoning" value={tags} onChange={e => setTags(e.target.value)} />
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
                            className="min-h-[100px]"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-primary">Cover Image (Optional)</label>
                        <Input 
                            type="file" 
                            accept="image/*" 
                            ref={thumbInputRef} 
                            onChange={e => e.target.files && setThumbnail(e.target.files[0])} 
                        />
                        {thumbnail && <p className="text-xs text-text-muted mt-1">Selected: {thumbnail.name}</p>}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border bg-surface">
                <CardHeader>
                    <CardTitle>Content Builder</CardTitle>
                    <CardDescription>Drag and drop files to add them to this package. You can reorder and rename them below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Drag and Drop Zone */}
                    <div 
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                            isDragging ? "border-accent bg-accent/5" : "border-border hover:border-text-muted bg-background/50"
                        )}
                    >
                        <UploadCloud className={cn("h-10 w-10 mb-4", isDragging ? "text-accent" : "text-text-muted")} />
                        <h3 className="text-lg font-semibold text-text-primary mb-1">Upload Files</h3>
                        <p className="text-sm text-text-secondary">Drag and drop PDFs, Images, Videos, or ZIPs here, or click to browse</p>
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

                    {/* File List */}
                    {queuedFiles.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-text-primary uppercase tracking-widest">Queued Files ({queuedFiles.length})</h4>
                            <div className="space-y-2">
                                {queuedFiles.map((qf, index) => (
                                    <div key={qf.id} className="flex items-center gap-3 p-3 bg-background border border-border rounded-lg group">
                                        <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="hover:text-accent disabled:opacity-0"><MoveUp className="h-3 w-3" /></button>
                                            <button onClick={() => moveFile(index, 'down')} disabled={index === queuedFiles.length - 1} className="hover:text-accent disabled:opacity-0"><MoveDown className="h-3 w-3" /></button>
                                        </div>
                                        
                                        <div className="h-10 w-10 shrink-0 bg-surface rounded-md flex items-center justify-center border border-border">
                                            {getFileIcon(qf.file.type)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    value={qf.displayName} 
                                                    onChange={(e) => renameFile(qf.id, e.target.value)}
                                                    className="h-7 text-sm font-semibold bg-transparent border-transparent hover:border-border focus:border-accent px-1"
                                                />
                                                <Pencil className="h-3 w-3 text-text-muted shrink-0" />
                                            </div>
                                            <p className="text-[10px] text-text-muted px-1 font-mono">{(qf.file.size / (1024 * 1024)).toFixed(2)} MB • {qf.file.type || 'Unknown'}</p>
                                        </div>
                                        
                                        <button 
                                            onClick={() => removeFile(qf.id)}
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
                onClick={handleCreate}
                disabled={isLoading || queuedFiles.length === 0}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Publishing Package...</span>
                ) : (
                    <span className="flex items-center gap-2"><Plus className="h-5 w-5" /> Publish Secure Package</span>
                )}
            </Button>
        </div>
    )
}
