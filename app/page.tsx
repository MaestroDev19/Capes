import { createClient } from "../supabase/server"
import { redirect } from "next/navigation"
import { ensureProfileWithDefaults, isProfileComplete } from "@/lib/profile"
import { Navigation } from "@/components/navigation"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

/**
 * Fetches the current authenticated user from Supabase.
 * @returns The user object if authenticated, otherwise null.
 */
async function getUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export default async function Home() {
  const user = await getUser()

  // Protect the page: redirect to /login if not authenticated
  if (!user) {
    redirect("/login")
  }

  // Ensure profile row exists with default bio, and gate if incomplete
  const profile = await ensureProfileWithDefaults(user.id)
  if (!isProfileComplete(profile)) {
    redirect("/complete-profile")
  }

  // Content to be implemented

  return (
    <div className="min-h-screen bg-background">
    
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <div className="bg-muted/50 aspect-video rounded-xl" />
                  <div className="bg-muted/50 aspect-video rounded-xl" />
                  <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>
                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}

