"use client";
import React, { useEffect, useState, ReactNode } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { MessagesContext } from "@/context/MessagesContext";
import type { Message } from "@/context/messages-types";
import { UserDetailContext, type UserDetail } from "@/context/UserDetailContext";
import Header from "@/components/custom/Header";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Props {
    children: ReactNode;
}

export default function Provider({ children }: Props) {
    const [messages, setMessages] = useState<Message[] | null>(null);
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const convex = useConvex();

    useEffect(() => {
        isAuthenticated();
    }, []);

    const isAuthenticated = async () => {
        if (typeof window !== undefined) {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            if (user) {
                const result = await convex.query(api.users.GetUser, {
                    email: user?.email,
                });
                setUserDetail({ ...result, ...user });
            }
        }
    };

    const messagesContextValue = React.useMemo(() => ({
        messages,
        setMessages
    }), [messages]);

    return (
        <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY || ""}>
            <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                <MessagesContext.Provider value={messagesContextValue}>
                    <NextThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange>
                        <Header />
                        {children}
                    </NextThemeProvider>
                </MessagesContext.Provider>
            </UserDetailContext.Provider>
        </GoogleOAuthProvider>
    );
}