"use client";
import { createContext } from "react";

export type ScreenContextType = {
  screenID: number;
};

export const screenContext = createContext<ScreenContextType | undefined>(
  undefined
);
