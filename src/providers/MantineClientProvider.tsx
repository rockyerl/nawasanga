"use client";

import { type ReactNode } from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

export const mantineTheme = createTheme({
  fontFamily: "Roboto, Arial, sans-serif",
  headings: {
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  colors: {
    rimba: [
      "#eef5f3",
      "#d0e7e2",
      "#a2cfc5",
      "#6eb0a4",
      "#2A9478",
      "#1D6B5A",
      "#175749",
      "#104238",
      "#0a2d27",
      "#051916",
    ],
    emas: [
      "#faf6e8",
      "#f3ecd0",
      "#e9dfaa",
      "#dfcf84",
      "#d6c266",
      "#D4AF5A",
      "#C9A040",
      "#B8962E",
      "#9a7d26",
      "#7a631c",
    ],
  },
  primaryColor: "rimba",
  defaultRadius: "md",
});

export function MantineClientProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="light" forceColorScheme="light" theme={mantineTheme}>
      <Notifications position="top-right" zIndex={9999} />
      {children}
    </MantineProvider>
  );
}
