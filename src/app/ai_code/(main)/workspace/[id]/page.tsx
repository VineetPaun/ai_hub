"use client";

import ChatView from "@/components/custom/ChatView";
import CodeView from "@/components/custom/CodeView";
import React from "react";

interface WorkspacePageProps {
  params: {
    id: string;
  };
}

const WorkspacePage: React.FC<WorkspacePageProps> = ({ params }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <ChatView />
      <div className="col-span-2">
        <CodeView />
      </div>
    </div>
  );
};

export default WorkspacePage;