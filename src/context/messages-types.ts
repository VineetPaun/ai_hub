import type { Dispatch, SetStateAction } from "react";

export interface Message {
  role: string;
  context: string;
  content?: string;
}

export interface MessagesContextType {
  messages: Message[] | null;
  setMessages: Dispatch<SetStateAction<Message[] | null>>;
}
