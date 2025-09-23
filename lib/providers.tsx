"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { Toaster } from "@/components/ui/toaster"
import { ProfileProvider } from "@/lib/profileContext"

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ProfileProvider>
        {children}
        <Toaster />
      </ProfileProvider>
    </NextThemesProvider>
  )
}
