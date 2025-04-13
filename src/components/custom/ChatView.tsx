"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Lookup from "@/data/Lookup";
import Prompt from "@/data/Prompt";
import { useMessages } from "@/hooks/use-messages";
import type { Message } from "@/context/messages-types";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { ArrowRight, Link, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatView = () => {
  const { id } = useParams();
  const convex = useConvex();
  const { userDetail } = useContext(UserDetailContext);
  const { messages, setMessages } = useMessages();
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const UpdateMessages = useMutation(api.workspace.UpdateMessages);

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id]);

  const GetWorkspaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    setMessages(result?.messages || []);
  };

  const GetAIResponse = async () => {
    if (!messages) return;

    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
    const result = await axios.post("/api/ai-chat", {
      prompt: PROMPT,
    });
    console.log(result.data.result);
    const aiResp: Message = {
      role: "ai",
      context: result.data.result,
    };
    setMessages((prev: Message[] | null) =>
      prev ? [...prev, aiResp] : [aiResp]
    );
    await UpdateMessages({
      messages: messages.concat(aiResp),
      workspaceId: id,
    });
    setLoading(false);
  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        GetAIResponse();
      }
    }
  }, [messages]);

  const onGenerate = async (input: string) => {
    const newMessage: Message = {
      role: "user",
      context: input,
    };
    setMessages((prev: Message[] | null) =>
      prev ? [...prev, newMessage] : [newMessage]
    );
    setUserInput("");
  };

  const messageArray = messages || [];

  return (
    <div className="relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide no-scrollbar">
        {messageArray.map((msg: Message, index: number) => (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-center leading-7 bg-[#1e1e1e]"
            key={index}>
            {msg.role === "user" && userDetail?.picture && (
              <Image
                src={userDetail.picture}
                alt="userImage"
                width={35}
                height={35}
                className="rounded-full"
              />
            )}
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p className="flex flex-col" {...props} />
                ),
              }}>
              {msg.context}
            </ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-lg flex gap-2 items-center bg-[#1e1e1e]">
            <Loader2Icon className="animate-spin" />
            <h2>Generating response...</h2>
          </div>
        )}
      </div>
      <div className="p-5 border rounded-xl max-w-xl w-full mt-3">
        <div className="flex gap-2">
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            value={userInput}
            onChange={(event) => setUserInput(event.target.value)}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 p-2 h-8 w-8 rounded-md cursor-pointer"
            />
          )}
        </div>
        <div>
          <Link className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default ChatView;
