import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";

import {
  Box,
  ColorSchemeScript,
  createTheme,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { Notifications } from "@mantine/notifications";

export const metadata: Metadata = {
  title: "CrossView",
  description: "A simple and elegant multi-screen system",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const theme = createTheme({});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"
        />
      </head>
      <body>
        <TRPCReactProvider>
          <MantineProvider theme={theme} defaultColorScheme="auto">
            <Notifications />
            <Box w="100vw" h="100vh" style={{ overflow: "hidden" }}>
              {children}
            </Box>
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
