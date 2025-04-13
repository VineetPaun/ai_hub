"use client";
import * as React from "react";
import type { MessagesContextType } from "./messages-types";
export type { Message } from "./messages-types";

const MessagesContext = React.createContext<MessagesContextType | undefined>(undefined);
MessagesContext.displayName = 'MessagesContext';

export { MessagesContext };