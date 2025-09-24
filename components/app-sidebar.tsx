"use client"

import type * as React from "react"
import { BookOpen, Bot, Frame, LifeBuoy, Map, PieChart, Send, Settings2, SquareTerminal,House } from "lucide-react"

import { NavMain } from "@/components/app-main"
import { NavProjects } from "@/components/app-projects"
import { NavSecondary } from "@/components/app-secondary"
import { NavUser } from "@/components/app-user"
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"

const data = {
  navSecondary: [
    {
      title: "Home",
      url: "/",
      icon: House,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  navMain: [ {
    title: "Home",
    url: "/",
    icon: House,
    isActive: true,
  },
    {
      title: "Fandom",
      url: "/",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "/",
        },
        {
          title: "Starred",
          url: "/",
        },
        {
          title: "Settings",
          url: "/",
        },
      ],
    },
    {
      title: "Events",
      url: "/events",
      icon: Bot,
      items: [
        {
          title: "All Events",
          url: "/events",
        },
        {
          title: "My RSVPs",
          url: "/events", // placeholder
        },
        {
          title: "Create Event",
          url: "/events", // placeholder
        },
      ],
    },
    
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],

 
}
interface SidebarUser {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    avatar_url?: string
  }
}

export function AppSidebar(
  { user, ...props }: { user: SidebarUser } & React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
