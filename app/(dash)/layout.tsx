import { redirect } from "next/navigation"
import { createClient } from "@/supabase/server"
import { ensureProfileWithDefaults, isProfileComplete } from "@/lib/profile"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

async function getUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) redirect("/login")

  const profile = await ensureProfileWithDefaults(user.id)
  if (!isProfileComplete(profile)) redirect("/complete-profile")

  return (
    <div className="min-h-screen bg-background">
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar user={user} />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}


