"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import React, { ReactNode } from "react";

interface ConvexClientProviderProps {
  children: ReactNode;
}

const ConvexClientProvider = ({ children }: ConvexClientProviderProps) => {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};

export default ConvexClientProvider;
