"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  useSandpack,
  SandpackFiles,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { useMessages } from "@/hooks/use-messages";
import type { Message } from "@/context/messages-types";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";

interface Files {
  [key: string]: { code: string };
}

const CodeView = () => {
  const { messages, setMessages } = useMessages();
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const { id } = useParams();
  const convex = useConvex();
  const sandpackRef = useRef(null);
  const prevFilesRef = useRef<SandpackFiles | null>(null);
  const [activeTab, setActiveTab] = useState("code");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<Files>(Lookup?.DEFAULT_FILE);

  useEffect(() => {
    id && GetFiles();
  }, [id]);

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id,
    });
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFiles);
    setLoading(false);
  };

  const GenerateAICode = async () => {
    if (!messages) return;

    setLoading(true);
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
    const result = await axios.post("/api/gen-ai-code", {
      prompt: PROMPT,
    });
    console.log(result.data);
    const aiResp = result.data;
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
    setFiles(mergedFiles);
    await UpdateFiles({
      workspaceId: id,
      files: aiResp?.files,
    });
    setLoading(false);
  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        GenerateAICode();
      }
    }
  }, [messages]);

  // Track file changes and persist to localStorage
  const FileChangeTracker = () => {
    const { sandpack } = useSandpack();
    const { files: sandpackFiles, activeFile } = sandpack;

    useEffect(() => {
      if (
        prevFilesRef.current &&
        JSON.stringify(prevFilesRef.current) !== JSON.stringify(sandpackFiles)
      ) {
        // Files have changed, update state and localStorage
        setFiles(sandpackFiles as Files);

        // Store all files in localStorage
        Object.keys(sandpackFiles).forEach((filePath) => {
          const fileContent = sandpackFiles[filePath]?.code;
          if (fileContent) {
            localStorage.setItem(`sandpack-file-${filePath}`, fileContent);
          }
        });

        prevFilesRef.current = sandpackFiles;
      }
    }, [sandpackFiles, activeFile]);

    return null; // This is a utility component, it doesn't render anything
  };

  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 justify-center rounded-full w-[140px] gap-3">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${activeTab == "code" && "text-blue-300 bg-blue-800 p-1 px-2 rounded-full"}`}>
            Code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${activeTab == "preview" && "text-blue-300 bg-blue-800 p-1 px-2 rounded-full"}`}>
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        files={files}
        template="react"
        theme={"dark"}
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio",
          ],
        }}>
        <FileChangeTracker />
        <SandpackLayout>
          {activeTab == "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandpackPreview
                style={{ height: "80vh" }}
                showNavigator={true}
              />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading &&
        <div className="p-10 bg-gray-900 opacity-65 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <Loader2Icon className="animate-spin h-10 w-10 text-white" />
          <h2>Generating your files...</h2>
        </div>
      }
    </div>
  );
};

export default CodeView;
