"use client"
import { BackendFetch } from "@/commonds/fetch-api";
import { StorageToken } from "@/types/response";
import { useCallback, useEffect, useState } from "react";
import { Login } from "./login";

interface ProtectedRouterProps {
    children: React.ReactNode;
  }

export const ProtectedRouter = ({ children }: ProtectedRouterProps) => {
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem(StorageToken.ACCESS_TOKEN);

        if (!token) {
            setIsAuthorized(false);
            setErrorMessage("You need to login first as an Admin");
            setLoading(false);
            return;
        }

        try {
            const response = await BackendFetch("/profile", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setIsAuthorized(true);
                setErrorMessage(null);
            } else {
                throw new Error("Unauthorized");
            }
        } catch {
            setIsAuthorized(false);
            setErrorMessage("You need to login first as an Admin");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLoginSuccess = () => {
        setLoading(true);
        checkAuth();
    };

    if (loading) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
                <span className="loading loading-ring size-24"></span>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="relative flex items-center justify-center h-screen">
                {errorMessage && (
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-800 text-white px-4 py-2 rounded shadow-lg">
                        {errorMessage}
                    </div>
                )}
                <Login onLoginSuccess={handleLoginSuccess} />
            </div>
        );
    }

    return <>{children}</>;
};