"use client"

import { useMemo, useState } from "react"
import { EventFilters, type EventFilterState } from "@/components/events/event-filters"
import { EventCard } from "@/components/events/event-card"
import { Separator } from "@/components/ui/separator"
import { EventGridSkeleton } from "@/components/events/event-skeletons"
import { EventEmpty } from "@/components/events/event-empty"
import { EventPagination } from "@/components/events/event-pagination"
import { Suspense } from "react"

type EventItem = {
  id: string
  title: string
  coverUrl: string
  city: string
  date: string
  fandom: string
  tags: string[]
}

const demoEvents: EventItem[] = [
  {
    id: "1",
    title: "Cosplay Meetup: Night City",
    coverUrl: "/globe.svg",
    city: "San Francisco",
    date: "2025-10-12T18:00:00Z",
    fandom: "Cyberpunk 2077",
    tags: ["cosplay", "photowalk"],
  },
  {
    id: "2",
    title: "Hyrule Fan Orchestra",
    coverUrl: "/vercel.svg",
    city: "Seattle",
    date: "2025-11-01T02:00:00Z",
    fandom: "Zelda",
    tags: ["music", "concert"],
  },
  {
    id: "3",
    title: "Spider-Verse Sketch Jam",
    coverUrl: "/next.svg",
    city: "New York",
    date: "2025-09-28T20:00:00Z",
    fandom: "Marvel",
    tags: ["art", "meetup"],
  },
]

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilterState>({ query: "", city: null, fandom: null, date: null })
  const [page, setPage] = useState(1)
  const pageSize = 6

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return demoEvents.filter((e) => {
      if (filters.city && e.city !== filters.city) return false
      if (filters.fandom && e.fandom !== filters.fandom) return false
      if (q && !(`${e.title} ${e.tags.join(" ")}`.toLowerCase().includes(q))) return false
      // date filter demo stub
      return true
    })
  }, [filters])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  function handleApply(next: EventFilterState) {
    setFilters(next)
    setPage(1)
  }

  function handleReset() {
    setFilters({ query: "", city: null, fandom: null, date: null })
    setPage(1)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Discover Events</h1>
      </div>
      <EventFilters onApply={handleApply} onReset={handleReset} />
      <Separator />
      <Suspense fallback={<EventGridSkeleton />}>
        {total === 0 ? (
          <EventEmpty onReset={handleReset} />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            <EventPagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
          </>
        )}
      </Suspense>
    </>
  )
}


