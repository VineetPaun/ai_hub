"use client";

import { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
} from "lucide-react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            // Temporarily shrink to get the right scrollHeight
            textarea.style.height = `${minHeight}px`;

            // Calculate new height
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        // Set initial height
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    // Adjust height on window resize
    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

export function AiChatBox() {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });

    // Use the auto-scroll hook for the messages container
    const { scrollRef, scrollToBottom } = useAutoScroll({
        content: messages,
        smooth: true,
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                // Add message to the list (in a real app, you'd handle this differently)
                setMessages(prev => [...prev, value.trim()]);
                setValue("");
                adjustHeight(true);
                // Scroll to bottom when a new message is added
                setTimeout(() => scrollToBottom(), 100);
            }
        }
    };

    const handleSendMessage = () => {
        if (value.trim()) {
            setMessages(prev => [...prev, value.trim()]);
            setValue("");
            adjustHeight(true);
            setTimeout(() => scrollToBottom(), 100);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center w-full">
            {/* Messages container with scroll capability */}

            <div
                ref={scrollRef}
                className="w-full max-w-4xl max-h-[50vh] overflow-y-auto mb-4 px-4 py-2 bg-neutral-950/50 backdrop-blur-sm"
            >
                {messages.length > 0 && (
                    <div className="space-y-4 py-4">
                        {messages.map((msg, index) => (
                            <div key={index} className="bg-neutral-950/50 p-3 rounded-lg text-white text-sm">
                                {msg}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full max-w-4xl mx-auto p-4 bg-neutral-950/50 backdrop-blur-md border-t border-neutral-800">
                <div className="relative bg-neutral-900 rounded-xl border border-neutral-800">
                    <div className="overflow-y-auto">
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask v0 a question..."
                            className={cn(
                                "w-full px-4 py-3",
                                "resize-none",
                                "bg-transparent",
                                "border-none",
                                "text-white text-sm",
                                "focus:outline-none",
                                "focus-visible:ring-0 focus-visible:ring-offset-0",
                                "placeholder:text-neutral-500 placeholder:text-sm",
                                "min-h-[60px]"
                            )}
                            style={{
                                overflow: "hidden",
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            {/* <button
                                type="button"
                                className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Paperclip className="w-4 h-4 text-white" />
                                <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                                    Attach
                                </span>
                            </button> */}
                        </div>
                        <div className="flex items-center gap-2">
                            {/* <button
                                type="button"
                                className="px-2 py-1 rounded-lg text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Project
                            </button> */}
                            <button
                                type="button"
                                onClick={handleSendMessage}
                                className={cn(
                                    "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1",
                                    value.trim()
                                        ? "bg-white text-black"
                                        : "text-zinc-400"
                                )}
                            >
                                <ArrowUpIcon
                                    className={cn(
                                        "w-4 h-4",
                                        value.trim()
                                            ? "text-black"
                                            : "text-zinc-400"
                                    )}
                                />
                                <span className="sr-only">Send</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
}

// function ActionButton({ icon, label }: ActionButtonProps) {
//     return (
//         <button
//             type="button"
//             className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
//         >
//             {icon}
//             <span className="text-xs">{label}</span>
//         </button>
//     );
// }