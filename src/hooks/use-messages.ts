import { useContext } from "react";
import { MessagesContext } from "@/context/MessagesContext";
import type { MessagesContextType } from "@/context/messages-types";

export function useMessages() {
  const context = useContext(MessagesContext);

  if (!context) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }

  return context;
}
