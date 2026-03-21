"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    getDeviceId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = Cookies.get("token");
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.get("/auth/me");
            setUser(response.data);
        } catch (error) {
            console.error("Auth check failed:", error);
            Cookies.remove("token");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const getDeviceId = () => {
        if (typeof window === "undefined") return null;
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            // Use cryptographically secure UUID if available
            deviceId = typeof window.crypto?.randomUUID === "function"
                ? window.crypto.randomUUID()
                : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("deviceId", deviceId);
        }
        return deviceId;
    };

    const login = async (accessToken: string, userData: User) => {
        Cookies.set("token", accessToken, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });
        setUser(userData);
        router.replace("/dashboard");
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout API failed:", error);
        } finally {
            Cookies.remove("token");
            setUser(null);
            router.replace("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth, setUser, getDeviceId }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
