"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"

interface Notification {
    id: string
    title: string
    message: string
    type: string
    isRead: boolean
    createdAt: string
}

interface NotificationContextType {
    notifications: Notification[]
    unreadCount: number
    refresh: () => Promise<void>
    markAsRead: (id: string) => Promise<void>
    clearAll: () => Promise<void>
    isLoading: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const unreadCount = notifications.filter(n => !n.isRead).length

    const fetchNotifications = useCallback(async () => {
        if (!user) return
        try {
            const { data } = await api.get("/notifications")
            setNotifications(data)
        } catch (error) {
            console.error("Failed to fetch notifications")
        }
    }, [user])

    const refresh = async () => {
        setIsLoading(true)
        await fetchNotifications()
        setIsLoading(false)
    }

    const markAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`)
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        } catch (error) {
            console.error("Failed to mark as read")
        }
    }

    const clearAll = async () => {
        try {
            await api.delete("/notifications")
            setNotifications([])
        } catch (error) {
            console.error("Failed to clear notifications")
        }
    }

    useEffect(() => {
        if (user) {
            fetchNotifications()
            const interval = setInterval(fetchNotifications, 10000) // Lowered to 10s for better feel
            return () => clearInterval(interval)
        } else {
            setNotifications([])
        }
    }, [user, fetchNotifications])

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            refresh,
            markAsRead,
            clearAll,
            isLoading
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}
