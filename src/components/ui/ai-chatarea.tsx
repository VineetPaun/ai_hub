"use client";
import { useState, FormEvent } from "react";
import { Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import React from 'react'
import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from "@/prompt";
// import { systemInstruction } from "@/prompt";

interface Message {
    id: number;
    content: string;
    sender: string;
}

const AiChatArea = () => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            content: "Hello! How can I help you today?",
            sender: "ai",
        }
    ]);

    const [chat] = useState(() => {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Gemini API key is not set");
            return null;
        }
        const ai = new GoogleGenAI({ apiKey });
        return ai.chats.create({
            model: "gemini-2.0-flash",
            config: {
                systemInstruction,
            },
            history: [
                {
                    role: "user",
                    parts: [{ text: "Hello" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Hello! How can I help you today?" }],
                },
            ],
        });
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chat) return;

        const userMessage = {
            id: messages.length + 1,
            content: input,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const streamingMessage = {
                id: messages.length + 2,
                content: "",
                sender: "ai",
            };

            setMessages((prev) => [...prev, streamingMessage]);

            const stream = await chat.sendMessageStream({
                message: input
            });

            setIsLoading(false);

            let fullResponse = "";
            for await (const chunk of stream) {
                fullResponse += chunk.text;
                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.sender === "ai") {
                        lastMessage.content = fullResponse;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    content: "Sorry, I encountered an error. Please try again.",
                    sender: "ai",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttachFile = () => {
        // Implement file attachment logic
    };

    const handleMicrophoneClick = () => {
        // Implement voice input logic
    };

    return (
        <div className="flex justify-center items-center h-screen w-full pt-20">
            <div className="w-full max-w-3xl mx-auto flex flex-col h-[85vh] bg-background rounded-lg overflow-hidden">
                <div className="flex-1 overflow-hidden">
                    <ChatMessageList>
                        {messages.map((message) => (
                            <ChatBubble
                                key={message.id}
                                variant={message.sender === "user" ? "sent" : "received"}
                            >
                                <ChatBubbleAvatar
                                    className="h-8 w-8 shrink-0"
                                    src={
                                        message.sender === "user"
                                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                                            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                                    }
                                    fallback={message.sender === "user" ? "US" : "AI"}
                                />
                                <ChatBubbleMessage
                                    variant={message.sender === "user" ? "sent" : "received"}
                                >
                                    {message.content}
                                </ChatBubbleMessage>
                            </ChatBubble>
                        ))}

                        {isLoading && (
                            <ChatBubble variant="received">
                                <ChatBubbleAvatar
                                    className="h-8 w-8 shrink-0"
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                                    fallback="AI"
                                />
                                <ChatBubbleMessage isLoading />
                            </ChatBubble>
                        )}
                    </ChatMessageList>
                </div>

                <div className="p-4 border-t">
                    <form
                        onSubmit={handleSubmit}
                        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
                    >
                        <ChatInput
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
                        />
                        <div className="flex items-center p-3 pt-0 justify-between">
                            <div className="flex">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={handleAttachFile}
                                >
                                    <Paperclip className="size-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={handleMicrophoneClick}
                                >
                                    <Mic className="size-4" />
                                </Button>
                            </div>
                            <Button type="submit" size="sm" className="ml-auto gap-1.5">
                                Send Message
                                <CornerDownLeft className="size-3.5" />
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AiChatArea